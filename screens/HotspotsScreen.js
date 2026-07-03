import React, {useState, useContext, useCallback} from 'react';
import {View, FlatList, ActivityIndicator, StyleSheet} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {fetchHotspots} from '../services/hotspotService';
import {getFavorites, toggleFavorite} from '../storage/storageService';
import {AppContext} from '../context/AppContext';
import HotspotCard from '../components/HotspotCard';

export default function HotspotsScreen({navigation}) {
    const [hotspots, setHotspots] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const {globalStyles} = useContext(AppContext);

    useFocusEffect(
        useCallback(() => {
            const loadData = async () => {
                try {
                    const data = await fetchHotspots();
                    const favs = await getFavorites();
                    setHotspots(data);
                    setFavorites(favs);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            };
            loadData();
        }, [])
    );

    const handleFavoriteToggle = async (id) => {
        const updatedFavs = await toggleFavorite(id);
        setFavorites(updatedFavs);
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#051923" style={styles.loader}/>;
    }

    return (
        <View style={[globalStyles.container, styles.container]}>
            <FlatList
                data={hotspots}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <HotspotCard
                        hotspot={item}
                        isFavorite={favorites.includes(item.id)}
                        onFavoriteToggle={() => handleFavoriteToggle(item.id)}
                        onPress={() => navigation.navigate('Map', {selectedHotspot: item})}
                    />
                )}
                contentContainerStyle={styles.list}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 40
    },
    list: {
        paddingHorizontal: 15,
        paddingBottom: 30
    },
    loader: {
        flex: 1,
        justifyContent: 'center'
    }
});