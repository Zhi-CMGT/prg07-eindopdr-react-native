import React from 'react';
import {NavigationContainer} from "@react-navigation/native";
import MyTabs from "./navigation/BottomTabNavigator";
import {AppProvider} from "./context/AppContext";
import {StatusBar} from 'expo-status-bar';

export default function App() {
    return (
        <AppProvider>
            <NavigationContainer>
                <MyTabs/>
                <StatusBar style="auto"/>
            </NavigationContainer>
        </AppProvider>
    );
}