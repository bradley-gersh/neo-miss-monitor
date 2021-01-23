import * as React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { IndexCard } from "./IndexCard";

export function IndexList(props) {
  const asteroidData = props.data;

  return (
    <View>
      <Text style={styles.text}>HELLO</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "white",
    backgroundColor: "yellow",
  },
});
