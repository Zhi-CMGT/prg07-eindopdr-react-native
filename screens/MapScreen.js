import React, {useEffect, useState, useRef, useContext, useCallback} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ActivityIndicator} from 'react-native';
import MapView, {Marker, Polyline, Callout} from 'react-native-maps';
import * as Location from 'expo-location';
import {useFocusEffect} from '@react-navigation/native';
import Ionicons from "@expo/vector-icons/Ionicons";
import {fetchHotspots} from '../services/hotspotService';
import {getFavorites, toggleFavorite} from '../storage/storageService';
import {AppContext} from '../context/AppContext';
import {getLocalizedField} from '../utils/hotspotLocalization';

export default function MapScreen({route}) {
    const mapRef = useRef(null);
    const markerRefs = useRef({});
    const {globalStyles, theme, lang} = useContext(AppContext);
    const selectedHotspot = route.params?.selectedHotspot;

    const [hotspots, setHotspots] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [travelTime, setTravelTime] = useState(null);
    const [loadingRoute, setLoadingRoute] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(true);
    const [activeHotspot, setActiveHotspot] = useState(null);
    const [selectedMode, setSelectedMode] = useState(null);

    useEffect(() => {
        const loadHotspots = async () => {
            const data = await fetchHotspots();
            setHotspots(data);
        };
        loadHotspots();
    }, []);

    useFocusEffect(
        useCallback(() => {
            const loadFavorites = async () => {
                const favs = await getFavorites();
                setFavorites(favs);
            };
            loadFavorites();
        }, [])
    );

    useEffect(() => {
        (async () => {
            let {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setLoadingLocation(false);
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const initialCoords = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            };

            setUserLocation(initialCoords);
            setLoadingLocation(false);

            if (!selectedHotspot && mapRef.current) {
                mapRef.current.animateToRegion({
                    ...initialCoords,
                    latitudeDelta: 0.03,
                    longitudeDelta: 0.03,
                }, 1000);
            }
        })();
    }, []);

    useEffect(() => {
        if (selectedHotspot && mapRef.current) {
            resetRouteAndSelection();
            setActiveHotspot(selectedHotspot);

            mapRef.current.animateToRegion({
                latitude: selectedHotspot.latitude,
                longitude: selectedHotspot.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }, 1000);

            setTimeout(() => {
                if (markerRefs.current[selectedHotspot.id]) {
                    markerRefs.current[selectedHotspot.id].showCallout();
                }
            }, 1200);
        }
    }, [selectedHotspot]);

    const resetRouteAndSelection = () => {
        setRouteCoordinates([]);
        setTravelTime(null);
        setSelectedMode(null);
        setActiveHotspot(null);
    };

    const handleMapPress = (e) => {
        if (e.nativeEvent.action !== 'marker-press') {
            resetRouteAndSelection();
        }
    };

    const handleToggleFavorite = async (hotspotId) => {
        const updatedFavs = await toggleFavorite(hotspotId);
        setFavorites(updatedFavs);
    };

    const calculateRoute = async (mode, targetHotspot) => {
        if (!userLocation || !targetHotspot) return;

        setLoadingRoute(true);
        setSelectedMode(mode);

        const osrmDomain = mode === 'car' ? 'routed-car' : mode === 'bike' ? 'routed-bike' : 'routed-foot';

        try {
            const url = `https://routing.openstreetmap.de/${osrmDomain}/route/v1/driving/${userLocation.longitude},${userLocation.latitude};${targetHotspot.longitude},${targetHotspot.latitude}?overview=full&geometries=geojson`;

            const response = await fetch(url);
            const json = await response.json();

            if (json.routes && json.routes.length > 0) {
                const coords = json.routes[0].geometry.coordinates.map(coord => ({
                    latitude: coord[1],
                    longitude: coord[0]
                }));
                setRouteCoordinates(coords);

                const durationMinutes = Math.round(json.routes[0].duration / 60);
                setTravelTime(Math.max(1, durationMinutes));
            }
        } catch (error) {
            console.error("Fout bij berekenen navigatieroute:", error);
        } finally {
            setLoadingRoute(false);
        }
    };

    const handleShowAll = () => {
        resetRouteAndSelection();
        mapRef.current?.animateToRegion({
            latitude: 51.8459, // Centraal Barendrecht fallback
            longitude: 4.5301,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
        }, 1000);
    };

    if (loadingLocation) {
        return (
            <View style={[globalStyles.container, styles.loaderFull]}>
                <ActivityIndicator size="large" color="#051923"/>
                <Text style={[styles.loaderText, globalStyles.text]}>Locatie bepalen...</Text>
            </View>
        );
    }

    const activeIsFavorite = activeHotspot ? favorites.includes(activeHotspot.id) : false;
    const activeStory = activeHotspot ? getLocalizedField(activeHotspot, 'story', lang) : '';

    return (
        <View style={[globalStyles.container, styles.container]}>
            <MapView
                ref={mapRef}
                style={styles.map}
                showsUserLocation={true}
                userInterfaceStyle={theme === 'dark' ? 'dark' : 'light'}
                onPress={handleMapPress}
                initialRegion={{
                    latitude: userLocation ? userLocation.latitude : 51.8459,
                    longitude: userLocation ? userLocation.longitude : 4.5301,
                    latitudeDelta: 0.03,
                    longitudeDelta: 0.03,
                }}
            >
                {hotspots.map((hotspot) => (
                    <Marker
                        key={hotspot.id}
                        ref={el => markerRefs.current[hotspot.id] = el}
                        coordinate={{latitude: hotspot.latitude, longitude: hotspot.longitude}}
                        pinColor={activeHotspot?.id === hotspot.id ? "blue" : "red"}
                        onPress={(e) => {
                            e.stopPropagation();
                            setActiveHotspot(hotspot);
                            setRouteCoordinates([]);
                            setTravelTime(null);
                            setSelectedMode(null);
                        }}
                    >
                        <Callout>
                            <View style={styles.calloutView}>
                                <Text style={styles.calloutTitle}>{getLocalizedField(hotspot, 'name', lang)}</Text>
                                <Text style={styles.calloutType}>{hotspot.type}</Text>
                                {favorites.includes(hotspot.id) && (
                                    <Text style={styles.calloutFav}>⭐ Favoriet</Text>
                                )}
                            </View>
                        </Callout>
                    </Marker>
                ))}

                {routeCoordinates.length > 0 && (
                    <Polyline
                        coordinates={routeCoordinates}
                        strokeColor={selectedMode === 'car' ? '#d90429' : selectedMode === 'bike' ? '#70e000' : '#00b4d8'}
                        strokeWidth={5}
                    />
                )}
            </MapView>

            <TouchableOpacity style={styles.floatButton} onPress={handleShowAll}>
                <Text style={styles.buttonText}>🌐 Alle locaties</Text>
            </TouchableOpacity>

            {activeHotspot && (
                <View style={[globalStyles.card, styles.routingPanel]}>
                    <View style={styles.panelHeader}>
                        <Text style={[styles.panelTitle, globalStyles.text]} numberOfLines={1}>
                            {getLocalizedField(activeHotspot, 'name', lang)}
                        </Text>
                        <TouchableOpacity
                            style={styles.favButton}
                            onPress={() => handleToggleFavorite(activeHotspot.id)}
                        >
                            <Ionicons
                                name={activeIsFavorite ? "star" : "star-outline"}
                                size={24}
                                color={activeIsFavorite ? "#FFD700" : "#888"}
                            />
                        </TouchableOpacity>
                    </View>

                    {!!activeStory && (
                        <Text style={styles.storyText} numberOfLines={4}>
                            {activeStory}
                        </Text>
                    )}

                    <Text style={styles.selectText}>Kies een route:</Text>
                    <View style={styles.modeRow}>
                        <TouchableOpacity
                            style={[styles.modeButton, selectedMode === 'car' && styles.activeMode]}
                            onPress={() => calculateRoute('car', activeHotspot)}
                        >
                            <Text style={styles.modeIcon}>🚗</Text>
                            <Text style={[styles.modeLabel, selectedMode === 'car' && {color: '#fff'}]}>Auto</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.modeButton, selectedMode === 'bike' && styles.activeMode]}
                            onPress={() => calculateRoute('bike', activeHotspot)}
                        >
                            <Text style={styles.modeIcon}>🚲</Text>
                            <Text style={[styles.modeLabel, selectedMode === 'bike' && {color: '#fff'}]}>Fiets</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.modeButton, selectedMode === 'foot' && styles.activeMode]}
                            onPress={() => calculateRoute('foot', activeHotspot)}
                        >
                            <Text style={styles.modeIcon}>🚶</Text>
                            <Text style={[styles.modeLabel, selectedMode === 'foot' && {color: '#fff'}]}>Lopend</Text>
                        </TouchableOpacity>
                    </View>

                    {travelTime !== null && (
                        <View style={styles.timeContainer}>
                            <Text style={styles.timeText}>⏱️ Geschatte reistijd: {travelTime} min</Text>
                        </View>
                    )}
                </View>
            )}

            {loadingRoute && (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#00b4d8"/>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    map: {
        width: '100%',
        height: '100%'
    },
    loaderFull: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loaderText: {
        marginTop: 10,
        fontWeight: '600',
        fontSize: 16
    },
    calloutView: {
        width: 180,
        padding: 8
    },
    calloutTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#051923'
    },
    calloutType: {
        color: '#1E5C7E',
        fontSize: 14,
        marginTop: 2
    },
    calloutFav: {
        color: '#006494',
        fontSize: 12,
        marginTop: 4,
        fontWeight: '700'
    },
    floatButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: '#003554',
        paddingVertical: 12,
        paddingHorizontal: 18,
        borderRadius: 25,
        elevation: 5,
    },
    buttonText: {
        color: '#F5F5F5',
        fontWeight: 'bold',
        fontSize: 14
    },
    routingPanel: {
        position: 'absolute',
        bottom: 95,
        left: 15,
        right: 15,
        padding: 18,
        borderRadius: 15,
        elevation: 10,
    },
    panelHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
    },
    panelTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
        paddingRight: 10
    },
    favButton: {
        padding: 4
    },
    storyText: {
        fontSize: 14,
        color: '#1E5C7E',
        lineHeight: 20,
        marginBottom: 15
    },
    selectText: {
        color: '#1E5C7E',
        fontSize: 14,
        marginBottom: 10,
        fontWeight: '600'
    },
    modeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    modeButton: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#1E5C7E',
        paddingVertical: 10,
        marginHorizontal: 5,
        borderRadius: 12,
    },
    activeMode: {
        backgroundColor: '#006494',
        borderColor: '#006494'
    },
    modeIcon: {
        fontSize: 22
    },
    modeLabel: {
        fontSize: 12,
        marginTop: 4,
        color: '#051923',
        fontWeight: '600'
    },
    timeContainer: {
        marginTop: 15,
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#1E5C7E',
        paddingTop: 12
    },
    timeText: {
        fontWeight: 'bold',
        color: '#006494',
        fontSize: 16
    },
    loaderContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(5, 25, 35, 0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    }
});