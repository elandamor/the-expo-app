import Constants from "expo-constants";
import React, { FC, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { RNScrollView, RNTextInput } from "../../components";

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
  const [refreshing, setRefreshing] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View
          style={{
            alignItems: "center",
          }}
        />
      </View>
      <RNScrollView
        enablePullToRefresh
        refreshing={refreshing}
        styles={{
          contentContainerStyle: { padding: 16 },
          style: { borderTopLeftRadius: 44 },
          underlayColor: "#DDD",
        }}
        onRefresh={() => {
          setRefreshing(true);
          wait(2000).then(() => setRefreshing(false));
        }}
      >
        {[...new Array(10)].map((_, index) => (
          <RNTextInput key={index} />
        ))}
      </RNScrollView>
    </View>
  );
};

export default HomeScreen;
