import React, {useState, useContext, useCallback} from 'react';
import {View, Text, TextInput, Button, StyleSheet, FlatList, Share, ActivityIndicator} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {fetchHotspots} from '../services/hotspotService';
import {getLocalNotes, saveLocalNote, deleteLocalNote, getFavorites, toggleFavorite} from '../storage/storageService';
import {AppContext} from '../context/AppContext';
import EmptyState from '../components/EmptyState';
import {getLocalizedField} from '../utils/hotspotLocalization';

export default function FavoritesScreen() {
    const {globalStyles, t, lang} = useContext(AppContext);
    const [favHotspots, setFavHotspots] = useState([]);
    const [notes, setNotes] = useState({});
    const [inputText, setInputText] = useState({});
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            const loadFavoriteData = async () => {
                try {
                    const allHotspots = await fetchHotspots();
                    const favIds = await getFavorites();
                    const localNotes = await getLocalNotes();

                    const filtered = allHotspots.filter(h => favIds.includes(h.id));

                    setFavHotspots(filtered);
                    setNotes(localNotes);
                    setInputText(localNotes);
                } catch (e) {
                    console.error(e);
                } finally {
                    setLoading(false);
                }
            };
            loadFavoriteData();
        }, [])
    );

    const handleSave = async (id) => {
        await saveLocalNote(id, inputText[id] || '');
        alert("Notitie opgeslagen!");
        // Ververs data
        const localNotes = await getLocalNotes();
        setNotes(localNotes);
    };

    const handleDeleteNote = async (id) => {
        await deleteLocalNote(id);
        const updatedInput = {...inputText};
        delete updatedInput[id];
        setInputText(updatedInput);
        const localNotes = await getLocalNotes();
        setNotes(localNotes);
    };

    const handleRemoveFavorite = async (id) => {
        await toggleFavorite(id);
        // Direct uit de gefilterde state halen voor soepele UI
        setFavHotspots(prev => prev.filter(h => h.id !== id));
    };

    const handleShare = async (hotspot, note) => {
        try {
            const name = getLocalizedField(hotspot, 'name', lang);
            await Share.share({
                message: `Check out ${name} in Barendrecht! Adres: ${hotspot.address}. Mijn notitie: ${note || 'Geen opmerkingen.'}`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#051923" style={styles.loader}/>;
    }

    return (
        <View style={[globalStyles.container, styles.container]}>
            <FlatList
                data={favHotspots}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <EmptyState
                        icon="⭐"
                        message="Je hebt nog geen favorieten toegevoegd. Markeer ze met een ster op het Hotspots scherm!"
                    />
                }
                renderItem={({item}) => (
                    <View style={globalStyles.card}>
                        <Text style={[styles.title, globalStyles.text]}>
                            {getLocalizedField(item, 'name', lang)}
                        </Text>
                        <Text style={[styles.noteText, globalStyles.text]}>
                            {notes[item.id] ? `📝 ${notes[item.id]}` : t.noNotes}
                        </Text>

                        <TextInput
                            style={[styles.input, {color: globalStyles.text.color, borderColor: '#ccc'}]}
                            placeholder={t.addNote}
                            placeholderTextColor="#999"
                            value={inputText[item.id] || ''}
                            onChangeText={(text) => setInputText({...inputText, [item.id]: text})}
                        />

                        <View style={styles.buttonRow}>
                            <Button title={t.save} onPress={() => handleSave(item.id)} color="#006494"/>
                            {notes[item.id] && (
                                <Button title={t.delete} onPress={() => handleDeleteNote(item.id)} color="#1E5C7E"/>
                            )}
                            <Button title="Unfav" onPress={() => handleRemoveFavorite(item.id)} color="#003554"/>
                            <Button title={t.share} onPress={() => handleShare(item, notes[item.id])} color="#051923"/>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 40,
        paddingHorizontal: 15
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4
    },
    noteText: {
        fontStyle: 'italic',
        marginVertical: 6,
        color: '#1E5C7E',
        fontSize: 14
    },
    input: {
        borderWidth: 1.5,
        borderRadius: 8,
        padding: 10,
        marginVertical: 10,
        fontSize: 16
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        gap: 4
    },
    loader: {
        flex: 1,
        justifyContent: 'center'
    }
});