import React, {useContext} from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
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
                <View style={styles.row}>
                    <Button title="NL" onPress={() => changeLanguage('nl')} disabled={lang === 'nl'}/>
                    <Button title="EN" onPress={() => changeLanguage('en')} disabled={lang === 'en'}/>
                    <Button title="DE" onPress={() => changeLanguage('de')} disabled={lang === 'de'}/>
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
        gap: 10
    }
});