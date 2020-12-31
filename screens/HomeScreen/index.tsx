import Constants from "expo-constants";
import React, { FC, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { RNAgenda, RNWeekView } from "../../components";

const generateDates = (hours: number, minutes?: number) => {
  const date = new Date();
  date.setHours(date.getHours() + hours);
  if (minutes != null) {
    date.setMinutes(minutes);
  }
  return date;
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
  eventContainer: {
    borderWidth: 1,
    borderColor: "black",
  },
});

const sampleEvents = [
  {
    id: 1,
    description: "Event 1",
    startDate: generateDates(0),
    endDate: generateDates(2),
    color: "blue",
  },
  {
    id: 2,
    description: "Event 2",
    startDate: generateDates(1),
    endDate: generateDates(4),
    color: "red",
  },
  {
    id: 3,
    description: "Event 3",
    startDate: generateDates(-5),
    endDate: generateDates(-3),
    color: "green",
  },
];

interface HomeScreenProps {}

const HomeScreen: FC<HomeScreenProps> = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View
          style={{
            alignItems: "center",
          }}
        />
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ borderBottomWidth: 1, borderColor: "red", flexGrow: 1 }}>
          <RNAgenda
            onDayPress={({ dateString }: { dateString: string }) => {
              setSelectedDate(new Date(dateString));
            }}
          >
            <RNWeekView events={sampleEvents} />
          </RNAgenda>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
