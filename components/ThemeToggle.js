import React, {useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {AppContext} from '../context/AppContext';

export default function ThemeToggle() {
    const {theme, toggleTheme} = useContext(AppContext);

    return (
        <View style={styles.row}>
            <TouchableOpacity
                style={[styles.option, theme === 'light' && styles.activeOption]}
                onPress={() => toggleTheme('light')}
            >
                <Text style={styles.icon}>☀️</Text>
                <Text style={[styles.label, theme === 'light' && styles.activeLabel]}>Light</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.option, theme === 'dark' && styles.activeOption]}
                onPress={() => toggleTheme('dark')}
            >
                <Text style={styles.icon}>🌙</Text>
                <Text style={[styles.label, theme === 'dark' && styles.activeLabel]}>Dark</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        backgroundColor: '#1E5C7E',
        borderRadius: 12,
        padding: 4
    },
    option: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 10,
    },
    activeOption: {
        backgroundColor: '#F5F5F5'
    },
    icon: {
        fontSize: 18,
        marginRight: 8
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#F5F5F5'
    },
    activeLabel: {
        color: '#1E5C7E'
    }
});