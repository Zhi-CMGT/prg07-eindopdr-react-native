import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import translations from '../context/translations';

export const AppContext = createContext();

export const AppProvider = ({children}) => {
    const [theme, setTheme] = useState('light');
    const [lang, setLang] = useState('nl');

    useEffect(() => {
        const loadSettings = async () => {
            const savedTheme = await AsyncStorage.getItem('theme');
            const savedLang = await AsyncStorage.getItem('lang');
            if (savedTheme) setTheme(savedTheme);
            if (savedLang) setLang(savedLang);
        };
        loadSettings();
    }, []);

    const toggleTheme = async (newTheme) => {
        setTheme(newTheme);
        await AsyncStorage.setItem('theme', newTheme);
    };

    const changeLanguage = async (newLang) => {
        setLang(newLang);
        await AsyncStorage.setItem('lang', newLang);
    };

    const styles = {
        container: {
            flex: 1,
            backgroundColor: theme === 'light' ? '#F5F5F5' : '#051923',
        },
        text: {
            color: theme === 'light' ? '#051923' : '#F5F5F5',
            fontSize: 16,
        },
        subText: {
            color: theme === 'light' ? '#1E5C7E' : '#F5F5F5',
            fontSize: 14,
            fontWeight: '600',
        },
        address: {
            color: theme === 'light' ? '#1E5C7E' : '#F5F5F5',
            fontSize: 12,
            marginTop: 2,
        },
        story: {
            color: theme === 'light' ? '#1E5C7E' : '#F5F5F5',
            fontSize: 14,
            marginTop: 6,
            lineHeight: 20
        },
        accentText: {
            color: theme === 'light' ? '#006494' : '#F5F5F5',
        },
        card: {
            backgroundColor: theme === 'light' ? '#FFFFFF' : '#003554',
            padding: 16,
            marginVertical: 10,
            borderRadius: 12,
            elevation: 4,
            shadowColor: '#051923',
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.1,
            shadowRadius: 4,
        },
        button: {
            backgroundColor: theme === 'light' ? '#006494' : '#1E5C7E',
            borderRadius: 8,
            paddingVertical: 10,
            alignItems: 'center',
        },

        buttonText: {
            color: '#F5F5F5',
            fontWeight: '600',
        },
    };

    return (
        <AppContext.Provider value={{
            theme, toggleTheme,
            lang, changeLanguage,
            t: translations[lang],
            globalStyles: styles
        }}>
            {children}
        </AppContext.Provider>
    );
};