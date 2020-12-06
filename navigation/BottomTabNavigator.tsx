import { Feather as Icon } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { HomeScreen, ProfileScreen } from "../screens";

const { width } = Dimensions.get("screen");

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    flexDirection: "row",
  },
  header: {
    borderTopLeftRadius: 44,
    borderTopRightRadius: 44,
    flexDirection: "row",
    height: 56,
    width: width,
  },
  tab: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});

function MyTabBar({ state, descriptors, navigation, ...props }) {
  const { bottom } = useSafeAreaInsets();
  console.log({ state, descriptors, navigation, props });

  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }

  return (
    <View style={[styles.container, { minHeight: 56 + bottom }]}>
      <View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: "#DDD",
            borderTopLeftRadius: 44,
            borderTopRightRadius: 44,
          },
        ]}
      />
      <View style={[styles.header]}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          const Icon = options.tabBarIcon || null;

          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tab}
            >
              {Icon && <Icon />}
              {props.showLabel && (
                <Text style={{ color: isFocused ? "#673ab7" : "#222" }}>
                  {label}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

type BottomTabParamList = {
  Home: undefined;
  Profile: undefined;
};

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: Colors[colorScheme].tint,
        showLabel: true,
      }}
      tabBar={(props) => <MyTabBar {...props} />}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

function TabBarIcon(props: { name: string; color: string }) {
  return <Icon size={24} style={{ marginBottom: -3 }} {...props} />;
}

export type ProfileParamList = {
  ProfileScreen: undefined;
};

const ProfileStack = createStackNavigator<ProfileParamList>();

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator headerMode="none">
      <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
}
