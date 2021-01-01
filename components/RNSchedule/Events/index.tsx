import differenceInMinutes from "date-fns/differenceInMinutes";
import format from "date-fns/format";
import memoizeOne from "memoize-one";
import React, { FC } from "react";
import { View } from "react-native";
import { ItemType } from "..";
import Event, { EventType } from "../Event";
import { CONTAINER_WIDTH, TIME_LABEL_HEIGHT } from "../utils";
import styles from "./Events.styles";

const GREY_COLOR = "#D4D7DA";

const MINUTES_IN_HOUR = 60;
const EVENTS_CONTAINER_WIDTH = CONTAINER_WIDTH;

interface EventsProps {
  events: EventType[];
  item: ItemType;
  numberOfColumns: number;
  times: string[];
  onEventPress?: (event: EventType) => void;
}

const Events: FC<EventsProps> = ({
  numberOfColumns,
  times,
  events,
  item,
  onEventPress,
}) => {
  const { from: openingTime, to: closingTime } = { from: "08:00", to: "17:00" };

  const getEventItemWidth = () => {
    return Math.floor(EVENTS_CONTAINER_WIDTH / numberOfColumns);
  };

  const getStyleForEvent = (event: EventType) => {
    const formattedDate = format(new Date(), "yyyy-MM-dd");
    const dateTime = `${formattedDate}T${openingTime}`;
    const openingHours = new Date(dateTime).getHours();
    const startDate = new Date(event.startDate);
    const endDate = new Date(event.endDate);
    const startHours = startDate.getHours();
    const startMinutes = startDate.getMinutes();
    const endMinutes = endDate.getMinutes();
    const hoursAfterOpening = startHours - openingHours;
    const top = hoursAfterOpening * TIME_LABEL_HEIGHT + startMinutes;
    const deltaMinutes = differenceInMinutes(endDate, startDate);
    const deltaHours = deltaMinutes / MINUTES_IN_HOUR;
    const heightOffset = deltaMinutes === 30 || deltaMinutes % 60 > 0 ? 3 : 1;
    // if (startMinutes > 0 && endMinutes > 0) heightOffset = 5
    const height =
      deltaHours * TIME_LABEL_HEIGHT +
      (startMinutes > 0 && endMinutes > 0 ? 5 : heightOffset);
    const width = getEventItemWidth();

    return {
      top,
      left: 0,
      height,
      width,
    };
  };

  const getEventsWithPosition = (totalEvents: EventType[]) => {
    const eventsWithPosition = totalEvents.reduce((events, event, index) => {
      const style = getStyleForEvent(event);

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
    >
      {times.map((time) => {
        return (
          <View
            key={time}
            style={[styles.timeRow, { height: TIME_LABEL_HEIGHT }]}
            pointerEvents="none"
          >
            <View style={styles.timeLabelLine} />
          </View>
        );
      })}
      <View style={styles.events}>
        {finalEvents.map(({ data: event, style }) => (
          <View key={event.id} style={[style, styles.event, { padding: 4 }]}>
            <Event data={event} onPress={onEventPress} />
          </View>
        ))}
      </View>
    </View>
  );
};

export default Events;
