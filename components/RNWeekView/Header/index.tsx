import React from "react";
import { Text, View } from "react-native";
import { calculateDaysArray, getFormattedDate } from "../utils";
import styles from "./Header.styles";

const getDayTextStyles = (numberOfDays) => {
  const fontSize = numberOfDays === 7 ? 12 : 14;
  return {
    fontSize,
  };
};

const Column = ({ column, numberOfDays, format, style, textStyle }) => {
  return (
    <View style={[styles.column, style]}>
      <Text
        style={[
          // { color: style.color },
          getDayTextStyles(numberOfDays),
          // textStyle,
        ]}
      >
        {getFormattedDate(column, format)}
      </Text>
    </View>
  );
};

const Columns = ({ columns, numberOfDays, format, style, textStyle }) => {
  return (
    <View style={styles.columns}>
      {columns.map((column) => {
        return (
          <Column
            style={style}
            textStyle={textStyle}
            key={column}
            column={column}
            numberOfDays={numberOfDays}
            format={format}
          />
        );
      })}
    </View>
  );
};

const WeekViewHeader = ({ numberOfDays, initialDate, formatDate }) => {
  const columns = calculateDaysArray(new Date(), numberOfDays, false);
  console.log({ columns });

  return (
    <View style={styles.container}>
      {columns && (
        <Columns
          format={formatDate}
          columns={columns}
          numberOfDays={numberOfDays}
          style={{}}
          textStyle={{}}
        />
      )}
    </View>
  );
};

// WeekViewHeader.propTypes = {
//   numberOfDays: PropTypes.oneOf(availableNumberOfDays).isRequired,
//   initialDate: PropTypes.string.isRequired,
//   formatDate: PropTypes.string,
//   style: PropTypes.object,
//   textStyle: PropTypes.object,
//   rightToLeft: PropTypes.bool,
// };

WeekViewHeader.defaultProps = {
  formatDate: "MMM D",
};

export default React.memo(WeekViewHeader);
