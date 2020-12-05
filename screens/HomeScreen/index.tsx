import Constants from "expo-constants";
import React, { FC, useCallback, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const wait = (timeout: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });
};

const { width } = Dimensions.get("screen");

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    flex: 1,
  },
  header: {
    backgroundColor: "#DDD",
    borderBottomRightRadius: 44,
    minHeight: 56 + Constants.statusBarHeight,
    width: width,
  },
});

interface HomeScreenProps {}

const HomeScreen: FC<HomeScreenProps> = () => {
  const { bottom } = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View
          style={{
            alignItems: "center",
          }}
        />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "#DDD",
            }}
          />
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              backgroundColor: "#FFF",
              borderTopLeftRadius: 44,
            }}
            contentContainerStyle={{
              flexGrow: 1,
              padding: 16,
              paddingBottom: 16 + bottom,
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {[...new Array(0)].map((_, index) => (
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
              />
            ))}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default HomeScreen;
