import * as React from "react";
import { StyleSheet, Text, ScrollView, View } from "react-native";
import { IndexCard } from "./IndexCard";

export function IndexList({ asteroidData }) {
  return (
    <ScrollView style={styles.scrollPanel} showsVerticalScrollIndicator={false}>
      {asteroidData ? (
        asteroidData.map((asteroid) => (
          <IndexCard key={asteroid.id} asteroid={asteroid} />
        ))
      ) : (
        <View style={styles.centerView}>
          <Text style={styles.loadingText}>Loading ...</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    color: "#eeeeee",
  },
  text: {
    color: "#eeeeee",
    backgroundColor: "yellow",
  },
  loadingText: {
    color: "#eeeeee",
    fontStyle: "italic",
  },
  scrollPanel: {
    marginBottom: 48,
  },
  centerView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
});
