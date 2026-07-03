import React, {useContext} from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import {AppContext} from '../context/AppContext';
import Ionicons from "@expo/vector-icons/Ionicons";
import {getLocalizedField} from '../utils/hotspotLocalization';

export default function HotspotCard({hotspot, onPress, isFavorite, onFavoriteToggle}) {
    const {globalStyles, t, lang} = useContext(AppContext);

    const name = getLocalizedField(hotspot, 'name', lang);
    const story = getLocalizedField(hotspot, 'story', lang);

    return (
        <TouchableOpacity style={[globalStyles.card, styles.cardContainer]} onPress={onPress}>
            <View style={styles.textContainer}>
                <Text style={[styles.title, globalStyles.text]}>{name}</Text>
                <Text style={styles.subText}>{t.type}: {hotspot.type}</Text>
                <Text style={styles.address}>{hotspot.address}</Text>
                {!!story && (
                    <Text style={styles.story} numberOfLines={2}>{story}</Text>
                )}
            </View>
            <TouchableOpacity style={styles.starButton} onPress={onFavoriteToggle}>
                <Ionicons
                    name={isFavorite ? "star" : "star-outline"}
                    size={28}
                    color={isFavorite ? "#006494" : "#1E5C7E"}
                />
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    textContainer: {
        flex: 1,
        paddingRight: 12
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4
    },
    subText: {
        color: '#1E5C7E',
        fontSize: 14,
        fontWeight: '600'
    },
    address: {
        color: '#1E5C7E',
        fontSize: 12,
        marginTop: 2
    },
    story: {
        color: '#006494',
        fontSize: 14,
        marginTop: 6,
        lineHeight: 20
    },
    starButton: {
        padding: 8
    }
});