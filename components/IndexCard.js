import * as React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export function IndexCard({ asteroid }) {
  let name = asteroid.name;
  if (name[0] === "(" && name[name.length - 1] === ")") {
    name = name.slice(1, name.length - 1);
  }
  const distance =
    Math.round(asteroid.close_approach_data[0].miss_distance.lunar * 10) / 10;
  let [
    date,
    time,
  ] = asteroid.close_approach_data[0].close_approach_date_full.split(" ");
  time += ` (UTC)`;

  return (
    <TouchableOpacity
      style={distance <= 10 ? styles.indexCardWarning : styles.indexCard}
    >
      <View>
        <Text style={styles.indexCardName}>{name}</Text>
      </View>
      <View style={styles.indexCardInfo}>
        <Text style={styles.indexCardText}>
          <Text>{date + "\n"}</Text>
          <Text style={styles.distanceText}>{time}</Text>
        </Text>
        <Text style={styles.indexCardText}>
          <Text>Lunar distances:{"\n"}</Text>
          <Text
            style={
              distance <= 10 ? styles.distanceTextWarning : styles.distanceText
            }
          >
            {distance}
          </Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  indexCard: {
    backgroundColor: "rgba(120, 0, 130, 0.5)",
    borderWidth: 5,
    borderColor: "white",
    borderRadius: 10,
    padding: 5,
    margin: 10,
    opacity: 1,
  },
  indexCardWarning: {
    backgroundColor: "rgba(200, 0, 0, 0.5)",
    borderWidth: 5,
    borderColor: "white",
    borderRadius: 10,
    padding: 5,
    margin: 10,
    opacity: 1,
  },
  indexCardText: {
    color: "white",
    alignSelf: "center",
    textAlign: "center",
    paddingLeft: 5,
    paddingRight: 5,
  },
  distanceText: {
    fontSize: 20,
    color: "white",
  },
  distanceTextWarning: {
    fontSize: 20,
    // color: "rgba(255, 6, 0, 1)",
    color: "white",
  },
  indexCardInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  indexCardName: {
    fontSize: 24,
    color: "white",
    textAlign: "center",
    padding: 10,
    fontWeight: "bold",
  },
});
