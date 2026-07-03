import React, {useContext} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {AppContext} from '../context/AppContext';

export default function EmptyState({message, icon = '⭐'}) {
    const {globalStyles} = useContext(AppContext);

    return (
        <View style={styles.container}>
            <Text style={styles.icon}>{icon}</Text>
            <Text style={[styles.message, globalStyles.text]}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 60,
        paddingHorizontal: 30
    },
    icon: {
        fontSize: 40,
        marginBottom: 12
    },
    message: {
        textAlign: 'center',
        color: 'gray',
        fontSize: 15,
        lineHeight: 22
    }
});