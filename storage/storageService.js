import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_KEY = '@hotspot_notes';
const FAVORITES_KEY = '@hotspot_favorites';

export const getFavorites = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(FAVORITES_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error("Fout bij ophalen favorieten", e);
        return [];
    }
};

export const toggleFavorite = async (hotspotId) => {
    try {
        const currentFavs = await getFavorites();
        let updatedFavs;
        if (currentFavs.includes(hotspotId)) {
            updatedFavs = currentFavs.filter(id => id !== hotspotId);
        } else {
            updatedFavs = [...currentFavs, hotspotId];
        }
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavs));
        return updatedFavs;
    } catch (e) {
        console.error("Fout bij updaten favorieten", e);
        return [];
    }
};

export const getLocalNotes = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(NOTES_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : {};
    } catch (e) {
        console.error("Fout bij ophalen notities", e);
        return {};
    }
};

export const saveLocalNote = async (hotspotId, noteText) => {
    try {
        const currentNotes = await getLocalNotes();
        currentNotes[hotspotId] = noteText;
        await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(currentNotes));
    } catch (e) {
        console.error("Fout bij opslaan van notitie", e);
    }
};

export const deleteLocalNote = async (hotspotId) => {
    try {
        const currentNotes = await getLocalNotes();
        delete currentNotes[hotspotId];
        await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(currentNotes));
    } catch (e) {
        console.error("Fout bij verwijderen van notitie", e);
    }
};