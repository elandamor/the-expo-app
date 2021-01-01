import React, { FC } from "react";
import { Text, TouchableOpacity } from "react-native";

export interface EventType {
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
}

interface EventProps {
  data: EventType;
  onPress?: (event: EventType) => void;
}

const Event: FC<EventProps> = ({ data: event, onPress }) => {
  return (
    <TouchableOpacity
      onPress={() => onPress && onPress(event)}
      disabled={!onPress}
      style={{
        backgroundColor: "#e6e6e6",
        borderRadius: 4,
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: -1,
        paddingHorizontal: 8,
        width: "100%",
      }}
    >
      <Text numberOfLines={1}>{event.client.name}</Text>
    </TouchableOpacity>
  );
};

export default Event;
