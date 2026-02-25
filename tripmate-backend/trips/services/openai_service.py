"""Gemini-based itinerary generation and customization (google.genai SDK)."""
import json
import os
import re

from google import genai
from google.genai import types

_client = None

def _get_client():
    global _client
    if _client is None:
        _client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))
    return _client

MODEL = "gemini-2.5-flash"

SYSTEM_PROMPT = """You are an expert travel planner. Create day-by-day itineraries as JSON.

CRITICAL RULES:
1. DO NOT include flights or how to reach the destination. DO NOT include hotel check-in or checkout. The user is already at the destination (or will arrange travel and accommodation separately). Focus only on what to do and see and eat there.

2. TIME-BASED SCHEDULING: Schedule each activity at the best time of day — but do NOT include a "time" field for: breakfast, lunch, dinner. Only include "time" for: attraction, viewpoint, trek, and similar activities (e.g. "09:00", "14:30").
   - For meals (breakfast/lunch/dinner): recommend 2–3 great places per meal slot (e.g. "Breakfast options: Café A, Bistro B, Bakery C" in the description or as 2–3 separate food activities).
   - Sunrise/sunset viewpoints: early morning or late afternoon; include "time".
   - Museums/monuments: mid-morning or afternoon; include "time".
   - Temples/religious sites: morning; include "time".

3. GEOGRAPHIC FLOW — keep activities nearby, no back-and-forth:
   - If the user is at a place A, the NEXT activity must be near A — not far away and then later coming back to the same area. Plan in a logical sequence: stay in one area, then move to the next area; do not zigzag.
   - Breakfast, lunch, and dinner: recommend places that are NEAR the area where the user is at that time (e.g. if morning activities are in the Old Town, suggest breakfast in or near Old Town; if afternoon is at the museum district, suggest lunch near that area). Never suggest a meal far from where they already are or will be.
   - Cluster activities in the same zone before moving to another zone; avoid "go to A, then far to B, then back near A".

4. Activity icons: use only "attraction" | "viewpoint" | "trek" | "food". Never use "flight" or "hotel".
5. For every activity include "duration": a short estimate (e.g. "1–2 hours", "45 min") so users know how long each activity takes.
6. Match user interests. Use the provided places data when relevant.
7. Output valid JSON only. No markdown, no explanation.
"""

USER_PROMPT_TEMPLATE = """Create a trip plan for {destination} from {start_date} to {end_date}.
Interests: {interests}

Places data (use when relevant):
{places_json}

Return JSON array of days. Each day: {{"day": 1, "date": "YYYY-MM-DD", "activities": [...]}}
Each activity: {{"name": "...", "description": "...", "icon": "attraction|viewpoint|trek|food", "time": "HH:MM", "duration": "e.g. 1–2 hours or 45 min"}}
- Include "time" only for non-food activities. Omit "time" for breakfast/lunch/dinner.
- Include "duration" for every activity: estimated time for that activity (e.g. "1–2 hours", "45 min", "30 min") so the user knows how long it will take.
- For breakfast, lunch, and dinner: recommend 2–3 great places each, and place them NEAR the area where the user is at that time (e.g. breakfast near morning activities, lunch near midday activities).
- Do not include flights, hotel check-in, or hotel checkout.
- Keep the route logical: next activity near the previous one; no far-away then back-to-same-area.
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
    match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
    if match:
        text = match.group(1).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
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

    client = _get_client()
    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(system_instruction=SYSTEM_PROMPT),
    )
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
        # No time for food/hotel; require time for attraction/viewpoint/trek
        if activity_type in ("food", "eating", "hotel"):
            extra = f'Add a new activity (type: {activity_type}) that fits the day. Do NOT include a "time" field for this activity.'
        else:
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

    client = _get_client()
    response = client.models.generate_content(
        model=MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(system_instruction=SYSTEM_PROMPT),
    )
    text = response.text if response else ""
    new_plan = _parse_json_from_text(text)
    if not isinstance(new_plan, list):
        return plan
    return new_plan
