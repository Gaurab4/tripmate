"""OpenStreetMap / Nominatim integration for fetching attractions."""
import requests

# Nominatim usage policy requires a valid User-Agent
USER_AGENT = "TripMate/1.0 (travel planning app)"
NOMINATIM_URL = "https://nominatim.openstreetmap.org/search"


def search_places(query, location=None, types=None):
    """
    Search for places using OpenStreetMap Nominatim.
    Returns list of {name, place_id, types, formatted_address, rating, ...}
    Returns empty list if request fails.
    No API key required.
    """
    print("[Places] search_places() called, query=%r" % query)
    text_query = f"{query} attractions" if not types else f"{query} {types}"
    params = {
        "q": text_query[:200],
        "format": "json",
        "limit": 15,
        "addressdetails": 1,
    }
    headers = {"User-Agent": USER_AGENT}

    try:
        print("[Places] Calling Nominatim, q=%r" % text_query[:80])
        resp = requests.get(NOMINATIM_URL, params=params, headers=headers, timeout=10)
        print("[Places] API response status=%s" % resp.status_code)
        resp.raise_for_status()
        places = resp.json()
        print("[Places] Got %d places" % len(places))

        results = []
        for p in places[:15]:
            display_name = p.get("display_name", "")
            osm_type = p.get("type", "")
            osm_class = p.get("class", "")
            types_list = [t for t in [osm_class, osm_type] if t]
            name = display_name.split(",")[0].strip() if display_name else "Place"

            results.append({
                "name": name,
                "place_id": str(p.get("place_id", "")),
                "types": types_list,
                "formatted_address": display_name,
                "rating": None,
            })
        print("[Places] Returning %d results" % len(results))
        return results
    except Exception as e:
        print("[Places] Error: %s" % e)
    print("[Places] Returning [] (failed)")
    return []
