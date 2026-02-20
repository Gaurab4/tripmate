"""Gemini-based itinerary generation and customization."""
import json
import os
import re

import google.generativeai as genai

genai.configure(api_key=os.environ.get("GEMINI_API_KEY", ""))

SYSTEM_PROMPT = """You are an expert travel planner. Create day-by-day itineraries as JSON.

CRITICAL RULES:
1. TIME-BASED SCHEDULING: Schedule each activity at the best time of day for that experience:
   - Sunrise/sunset viewpoints: early morning or late afternoon
   - Museums/monuments: mid-morning or afternoon (when open)
   - Markets/shopping: morning when fresh, or late afternoon
   - Lunch: 12:00–14:00, Dinner: 19:00–21:00
   - Temples/religious sites: morning (often best light and fewer crowds)
   - Nightlife/evening spots: evening
   Include a "time" field for each activity (e.g. "09:00", "14:30").

2. GEOGRAPHIC FLOW (ROUTE OPTIMIZATION): Plan a logical route from a starting point:
   - Start from the natural entry point (airport, railway station, or hotel)
   - Go to the hotel/check-in first if arriving
   - Then visit nearby places first (within walking/short drive)
   - Progress outward in ONE general direction — do not zigzag
   - Avoid: one activity 10km north, next 10km south, then back north
   - Cluster activities in the same area before moving to the next cluster
   - Think: airport → hotel → nearby market → places near market → further attractions in same direction

3. Match user interests. Use the provided places data when relevant.
4. Output valid JSON only. No markdown, no explanation.
"""

USER_PROMPT_TEMPLATE = """Create a trip plan for {destination} from {start_date} to {end_date}.
Interests: {interests}

Places data (use when relevant):
{places_json}

Return JSON array of days. Each day: {{"day": 1, "date": "YYYY-MM-DD", "activities": [...]}}
Each activity: {{"name": "...", "description": "...", "icon": "flight|hotel|attraction|food", "time": "HH:MM"}}
"""

CUSTOMIZE_PROMPT_TEMPLATE = """Current plan (JSON):
{plan_json}

Action: {action}
Day index: {day_index}
{extra}

Return the updated plan as a JSON array of days (same format). No markdown, no explanation."""


def _parse_json_from_text(text):
    """Extract JSON from model response, handling markdown code blocks."""
    text = (text or "").strip()
    # Remove markdown code blocks
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
    if match:
        text = match.group(1).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        # Try to find JSON array
        match = re.search(r"\[\s*\{[\s\S]*\}\s*\]", text)
        if match:
            return json.loads(match.group(0))
    return []


def generate_itinerary(destination, start_date, end_date, interests, places_data=None):
    """Generate a day-by-day itinerary using Gemini."""
    places = places_data or []
    places_json = json.dumps(places[:20], indent=2) if places else "[]"

    prompt = USER_PROMPT_TEMPLATE.format(
        destination=destination,
        start_date=str(start_date),
        end_date=str(end_date),
        interests=", ".join(interests) if interests else "general exploration",
        places_json=places_json,
    )

    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        system_instruction=SYSTEM_PROMPT,
    )
    response = model.generate_content(prompt)
    text = response.text if response else ""
    plan = _parse_json_from_text(text)
    if not isinstance(plan, list):
        return []
    return plan


def customize_itinerary(plan, action, day_index, activity_index=None, activity_type="attraction", activity_time=None):
    """Add, replace, or remove an activity and return the updated plan."""
    plan_json = json.dumps(plan, indent=2)
    extra = ""
    if action == "add":
        time_note = f" The user wants this activity at {activity_time}." if activity_time else ""
        extra = f'Add a new activity (type: {activity_type}) that fits the day and follows time + route rules.{time_note} Include "time": "{activity_time or "12:00"}" in the new activity.'
    elif action == "replace" and activity_index is not None:
        extra = f"Replace the activity at index {activity_index} with a different one (type: {activity_type})."
    elif action == "remove" and activity_index is not None:
        extra = f"Remove the activity at index {activity_index}."

    prompt = CUSTOMIZE_PROMPT_TEMPLATE.format(
        plan_json=plan_json,
        action=action,
        day_index=day_index,
        extra=extra,
    )

    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash",
        system_instruction=SYSTEM_PROMPT,
    )
    response = model.generate_content(prompt)
    text = response.text if response else ""
    new_plan = _parse_json_from_text(text)
    if not isinstance(new_plan, list):
        return plan
    return new_plan
