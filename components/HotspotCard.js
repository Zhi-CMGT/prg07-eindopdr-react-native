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
                <Text style={globalStyles.subText}>{t.type}: {hotspot.type}</Text>
                <Text style={globalStyles.address}>{hotspot.address}</Text>
                {!!story && (
                    <Text style={globalStyles.story} numberOfLines={2}>{story}</Text>
                )}
            </View>
            <TouchableOpacity style={globalStyles.starButton} onPress={onFavoriteToggle}>
                <Ionicons
                    name={isFavorite ? "star" : "star-outline"}
                    size={28}
                    color={isFavorite ? "#FFD700" : "#888"}
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
    starButton: {
        padding: 8
    }
});