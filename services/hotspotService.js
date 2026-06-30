const HOTSPOTS_URL = '';

export async function fetchHotspots() {
    const response = await fetch(HOTSPOTS_URL);
    const data = await response.json();
    return data.hotspots;
}