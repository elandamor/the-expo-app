import format from "date-fns/format";
import Constants from "expo-constants";
import React, { FC, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { RNAgenda, RNWeekView } from "../../components";

const generateDates = (hour: number, minutes?: number) => {
  const formattedDate = format(new Date(), "yyyy-MM-dd");

  return `${formattedDate}T${hour < 10 ? "0" + hour : hour}:${
    minutes || "00"
  }:00`;
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

const stylists = [
  {
    id: "1",
    name: "Wanda",
  },
  {
    id: "2",
    name: "Zizipho",
  },
  {
    id: "3",
    name: "Abbi",
  },
];

const sampleEvents = [
  // {
  //   id: 1,
  //   description: "Event 1",
  //   startDate: generateDates(8),
  //   endDate: generateDates(8, 30),
  //   client: {
  //     id: "1",
  //     name: "Andile Abede",
  //   },
  //   stylist: stylists[0],
  //   duration: 90,
  // },
  // {
  //   id: 2,
  //   startDate: generateDates(10),
  //   endDate: generateDates(13, 30),
  //   client: {
  //     id: "2",
  //     name: "James Ndlovu",
  //   },
  //   stylist: stylists[2],
  //   duration: 120,
  // },
  // {
  //   id: 3,
  //   startDate: generateDates(12, 30),
  //   endDate: generateDates(15),
  //   client: {
  //     id: "3",
  //     name: "Sipho Abede",
  //   },
  //   stylist: stylists[1],
  //   duration: 60,
  // },
  {
    id: 4,
    startDate: generateDates(8, 30),
    endDate: generateDates(13, 30),
    client: {
      id: "4",
      name: "Thato Nkosi",
    },
    stylist: stylists[0],
    duration: 60,
  },
  // {
  //   id: 5,
  //   startDate: generateDates(8),
  //   endDate: generateDates(11, 30),
  //   client: {
  //     id: "5",
  //     name: "Ben Ndlovu",
  //   },
  //   stylist: stylists[1],
  //   duration: 60,
  // },
  {
    id: 6,
    startDate: generateDates(13, 30),
    endDate: generateDates(14),
    client: {
      id: "6",
      name: "Thandolwethu Mpofu",
    },
    stylist: stylists[0],
    duration: 60,
  },
];

export type EventType = {
  id: number;
  description: string;
  startDate: Date;
  endDate: Date;
  client: {
    id: string;
    name: string;
  };
  stylist: {
    id: string;
    name: string;
  };
  duration: number;
};

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
            <RNWeekView headers={stylists} events={sampleEvents} />
          </RNAgenda>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
