import Constants from "expo-constants";
import React, { FC } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { RNScrollView } from "../../components";

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

interface ProfileScreenProps {}

const ProfileScreen: FC<ProfileScreenProps> = () => {
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
        styles={{
          style: { borderTopLeftRadius: 44 },
          underlayColor: "#DDD",
        }}
      />
    </View>
  );
};

export default ProfileScreen;
