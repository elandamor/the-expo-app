import differenceInMinutes from "date-fns/differenceInMinutes";
import format from "date-fns/format";
import memoizeOne from "memoize-one";
import React, { FC, useState } from "react";
import { Text, TouchableWithoutFeedback, View } from "react-native";
import { ItemType } from "..";
import { EventType } from "../../../screens/HomeScreen";
import { CONTAINER_WIDTH, TIME_LABEL_HEIGHT } from "../utils";
import styles from "./Events.styles";

const GREY_COLOR = "#70757a";

const MINUTES_IN_HOUR = 60;
const EVENT_HORIZONTAL_PADDING = 10;
const EVENTS_CONTAINER_WIDTH = CONTAINER_WIDTH;

interface EventsProps {
  hoursInDisplay: number;
  events: EventType[];
  item: ItemType;
  numberOfColumns: number;
  times: string[];
}

const Events: FC<EventsProps> = ({
  hoursInDisplay,
  numberOfColumns,
  times,
  events,
  item,
}) => {
  const { from: openingTime, to: closingTime } = { from: "08:00", to: "17:00" };

  const [containerHeight, setContainerHeight] = useState(0);

  const getEventItemWidth = () => {
    return EVENTS_CONTAINER_WIDTH / numberOfColumns;
  };

  const getStyleForEvent = (event: EventType, index: number) => {
    const formattedDate = format(new Date(), "yyyy-MM-dd");
    const dateTime = `${formattedDate}T${openingTime}`;
    const openingHours = new Date(dateTime).getHours();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    const startHours = startDate.getHours();
    const startMinutes = startDate.getMinutes();
    const hoursAfterOpening = startHours - openingHours;
    const totalStartMinutes =
      hoursAfterOpening * TIME_LABEL_HEIGHT + startMinutes;
    const top = hoursAfterOpening * TIME_LABEL_HEIGHT + startMinutes;
    const deltaMinutes = differenceInMinutes(endDate, startDate);
    const height = (deltaMinutes / 60) * TIME_LABEL_HEIGHT;
    const width = getEventItemWidth();

    console.log({
      dateTime,
      openingHours,
      deltaMinutes,
      hoursAfterOpening,
      startHours,
      startMinutes,
      totalStartMinutes,
      height,
      top,
    });

    return {
      top,
      left: 0,
      height,
      width,
    };
  };

  const getEventsWithPosition = (totalEvents: EventType[]) => {
    const eventsWithPosition = totalEvents.reduce((events, event, index) => {
      const style = getStyleForEvent(event, index);

      events.push({ data: event, style });

      return events;
    }, [] as { data: EventType; style: { top: number; left: number; height: number; width: number } }[]);

    return eventsWithPosition;
  };

  const processEvents = memoizeOne((events: EventType[], item: ItemType) => {
    const totalEvents = events.filter((event) => event.stylist.id === item.id);
    const totalEventsWithPosition = getEventsWithPosition(totalEvents);

    return totalEventsWithPosition;
  });

  const finalEvents = processEvents(events, item);
  // console.log({ containerHeight, finalEvents });

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        width: CONTAINER_WIDTH / numberOfColumns,
        borderRightWidth: 1,
        borderColor: GREY_COLOR,
        flexGrow: 1,
      }}
      onLayout={(event) => setContainerHeight(event.nativeEvent.layout.height)}
    >
      {times.map((time) => {
        return (
          <View
            key={time}
            style={[styles.timeRow, { height: TIME_LABEL_HEIGHT }]}
          >
            <View style={styles.timeLabelLine} />
          </View>
        );
      })}
      <View style={styles.events}>
        {finalEvents.map(({ data: event, style }, index) => (
          <TouchableWithoutFeedback onPress={() => null} key={index}>
            <View style={[style, styles.event, { padding: 4 }]}>
              <View
                style={{
                  backgroundColor: "#cfcfcf",
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  width: style.width - 8,
                }}
              >
                <Text>{event.client.name}</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        ))}
      </View>
    </View>
  );
};

export default Events;
