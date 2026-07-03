import React, {useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {AppContext} from '../context/AppContext';
import ThemeToggle from '../components/ThemeToggle';

export default function SettingsScreen() {
    const {lang, changeLanguage, t, globalStyles} = useContext(AppContext);

    return (
        <View style={[globalStyles.container, styles.container]}>
            <Text style={[styles.heading, globalStyles.text]}>{t.settings}</Text>

            <View style={styles.section}>
                <Text style={[styles.label, globalStyles.text]}>{t.theme}</Text>
                <ThemeToggle/>
            </View>

            <View style={styles.section}>
                <Text style={[styles.label, globalStyles.text]}>{t.language}: {lang.toUpperCase()}</Text>
                <View style={styles.languageRow}>
                    <TouchableOpacity
                        style={[styles.languageButton, lang === 'nl' && styles.activeLanguageButton]}
                        onPress={() => changeLanguage('nl')}
                    >
                        <Text style={[styles.languageText, lang === 'nl' && styles.activeLanguageText]}>
                            Nederlands
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.languageButton, lang === 'en' && styles.activeLanguageButton]}
                        onPress={() => changeLanguage('en')}
                    >
                        <Text style={[styles.languageText, lang === 'en' && styles.activeLanguageText]}>
                            English
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.languageButton, lang === 'de' && styles.activeLanguageButton]}
                        onPress={() => changeLanguage('de')}
                    >
                        <Text style={[styles.languageText, lang === 'de' && styles.activeLanguageText]}>
                            Deutsch
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 40,
        paddingHorizontal: 20
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20
    },
    section: {
        marginVertical: 15
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
        fontWeight: '600'
    },
    row: {
        flexDirection: 'row',
        gap: 10,
    },
    languageRow: {
        flexDirection: 'row',
        backgroundColor: '#1E5C7E',
        borderRadius: 12,
        padding: 4,
    },
    languageButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 10,
    },
    activeLanguageButton: {
        backgroundColor: '#F5F5F5',
    },
    languageText: {
        color: '#F5F5F5',
        fontWeight: '600',
        fontSize: 15,
    },
    activeLanguageText: {
        color: '#1E5C7E',
    },
});