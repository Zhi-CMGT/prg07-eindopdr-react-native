import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from "@expo/vector-icons/Ionicons"
import FavoritesScreen from '../screens/FavoritesScreen';
import HotspotsScreen from '../screens/HotspotsScreen';
import MapScreen from '../screens/MapScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const ICONS = {
    Map: {focused: 'map', outline: "map-outline"},
    Hotspots: {focused: 'location', outline: "location-outline"},
    Favorites: {focused: 'star', outline: "star-outline"},
    Settings: {focused: 'settings', outline: "settings-outline"},
};

function MyTabs() {
    return (
        <Tab.Navigator
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color}) => {
                    const icon = ICONS[route.name];
                    return (
                        <Ionicons
                            name={focused ? icon.focused : icon.outline}
                            size={28}
                            color={color}
                            style={{marginRight: -10}}
                        />
                    );
                },
                tabBarActiveTintColor: "#F5F5F5",
                tabBarInactiveTintColor: "#1E5C7E",
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: "#003554",
                    height: 70,
                    borderRadius: 25,
                    borderBottomWidth: 1,
                    borderTopWidth: 0,
                    position: 'absolute',
                    bottom: 10,
                    left: 10,
                    right: 10,
                    elevation: 5
                },
                tabBarItemStyle: {
                    paddingVertical: 15,
                },
            })}
        >
            <Tab.Screen name="Map" component={MapScreen}/>
            <Tab.Screen name="Hotspots" component={HotspotsScreen}/>
            <Tab.Screen name="Favorites" component={FavoritesScreen}/>
            <Tab.Screen name="Settings" component={SettingsScreen}/>
        </Tab.Navigator>
    )
}

export default MyTabs;