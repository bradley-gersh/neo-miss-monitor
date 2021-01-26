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
/*
const sampleAsteroid = JSON.parse(`{
  "links": {
    "self": "http://www.neowsapp.com/rest/v1/neo/2440012?api_key=DEMO_KEY"
  },
  "id": "2440012",
  "neo_reference_id": "2440012",
  "name": "440012 (2002 LE27)",
  "nasa_jpl_url": "http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=2440012",
  "absolute_magnitude_h": 19.3,
  "estimated_diameter": {
    "kilometers": {
      "estimated_diameter_min": 0.3669061375,
      "estimated_diameter_max": 0.8204270649
    },
    "meters": {
      "estimated_diameter_min": 366.9061375314,
      "estimated_diameter_max": 820.4270648822
    },
    "miles": {
      "estimated_diameter_min": 0.2279848336,
      "estimated_diameter_max": 0.5097895857
    },
    "feet": {
      "estimated_diameter_min": 1203.7603322587,
      "estimated_diameter_max": 2691.6899315481
    }
  },
  "is_potentially_hazardous_asteroid": true,
  "close_approach_data": [
    {
      "close_approach_date": "2015-09-07",
      "close_approach_date_full": "2015-Sep-07 07:32",
      "epoch_date_close_approach": 1441611120000,
      "relative_velocity": {
        "kilometers_per_second": "1.1630787733",
        "kilometers_per_hour": "4187.0835837756",
        "miles_per_hour": "2601.6909079299"
      },
      "miss_distance": {
        "astronomical": "0.4981692661",
        "lunar": "193.7878445129",
        "kilometers": "74525061.108023207",
        "miles": "46307725.6547539766"
      },
      "orbiting_body": "Earth"
    }
  ],
  "is_sentry_object": false
}`);
*/
