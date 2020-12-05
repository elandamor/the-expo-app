import { StackNavigationProp } from "@react-navigation/stack";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import React, { FC, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PublicStackParamsList } from "../../navigation";

const { width } = Dimensions.get("screen");

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    flex: 1,
  },
  header: {
    alignItems: "center",
    backgroundColor: "#DDD",
    borderBottomRightRadius: 44,
    borderTopRightRadius: 44,
    borderTopLeftRadius: 44,
    flex: 1,
    justifyContent: "center",
    padding: 40,
    paddingTop: Constants.statusBarHeight + 40,
    width: width,
  },
  footer: {
    flex: 0,
    position: "relative",
  },
  button: {
    backgroundColor: "#000",
    borderRadius: 56,
    height: 64,
  },
});

interface RegisterScreenProps {
  navigation: StackNavigationProp<PublicStackParamsList, "Register">;
}

const RegisterScreen: FC<RegisterScreenProps> = ({ navigation }) => {
  const { bottom } = useSafeAreaInsets();

  const [value, onChangeText] = useState("");

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#DDD" />
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.header}>
            <View
              style={{
                backgroundColor: "#CCC",
                borderRadius: 24,
                height: 120,
                width: 120,
              }}
            />
          </View>
          <View style={styles.footer}>
            <View
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: "#DDD",
              }}
            />
            <View
              style={{
                backgroundColor: "#FFF",
                borderTopLeftRadius: 44,
                flex: 0,
                padding: 16,
                paddingBottom: 16 + bottom,
              }}
            >
              <View style={{ marginVertical: 16 }}>
                {[...new Array(3)].map((_, index) => (
                  <TextInput
                    key={index}
                    style={{
                      height: 56,
                      borderColor: "#DDD",
                      borderRadius: 40,
                      borderWidth: 1,
                      marginBottom: 16,
                      paddingHorizontal: 16,
                    }}
                    onChangeText={(text) => onChangeText(text)}
                    value={value}
                  />
                ))}
              </View>
              <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                <View style={styles.button} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <View style={[styles.button, { backgroundColor: "#FFF" }]} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterScreen;
