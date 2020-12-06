import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LandingScreen, LoginScreen, RegisterScreen } from "../screens";
import BottomTabNavigator from "./BottomTabNavigator";

export type PublicStackParamsList = {
  Home: undefined;
  Landing: undefined;
  Login: undefined;
  Register: undefined;
};

const PublicStack = createStackNavigator<PublicStackParamsList>();

const PublicNavigator = () => {
  return (
    <PublicStack.Navigator screenOptions={{ headerShown: false }}>
      <PublicStack.Screen name="Landing" component={LandingScreen} />
      <PublicStack.Screen name="Register" component={RegisterScreen} />
      <PublicStack.Screen name="Login" component={LoginScreen} />
      <PublicStack.Screen name="Home" component={BottomTabNavigator} />
    </PublicStack.Navigator>
  );
};

export type PrivateStackParamsList = {
  Home: undefined;
};

const PrivateStack = createStackNavigator<PrivateStackParamsList>();

const PrivateNavigator = () => {
  return (
    <PrivateStack.Navigator screenOptions={{ headerShown: false }}>
      <PrivateStack.Screen name="Home" component={BottomTabNavigator} />
    </PrivateStack.Navigator>
  );
};

const RootNavigator = () => {
  const { isAuthenticated } = { isAuthenticated: false };

  if (!isAuthenticated) {
    return <PublicNavigator />;
  }

  return <PrivateNavigator />;
};

export default function Navigation() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
