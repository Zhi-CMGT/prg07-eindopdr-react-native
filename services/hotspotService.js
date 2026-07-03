const HOTSPOTS_URL = 'https://raw.githubusercontent.com/Zhi-CMGT/prg07-eindopdr-react-native/refs/heads/main/assets/data/barendrechtHotspots.json';

export async function fetchHotspots() {
    const response = await fetch(HOTSPOTS_URL);
    const data = await response.json();
    return data.hotspots;
}