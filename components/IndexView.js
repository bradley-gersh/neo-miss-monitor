import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  Switch,
} from "react-native";
import { IndexList } from "./IndexList";
import * as Notifications from "expo-notifications";
import { Picker } from "@react-native-picker/picker";

const background = require("../assets/background.png");

const formatDate = (date) =>
  date.getFullYear() +
  "-" +
  ("" + date.getMonth() + 1).padStart(2, "0") +
  "-" +
  ("" + date.getDate()).padStart(2, "0");

export function IndexView() {
  const [asteroidData, setAsteroidData] = React.useState(null);
  const [optionsVisible, setOptionsVisible] = React.useState(false);
  const [utcOffset, setUtcOffset] = React.useState(0);
  const [notificationsOn, setNotificationsOn] = React.useState(false);
  const [notificationsPermission, setNotificationsPermission] = React.useState(
    false
  );

  React.useEffect(() => {
    async function fetchData() {
      if (!asteroidData) {
        await Notifications.cancelAllScheduledNotificationsAsync();

        const today = new Date();
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const todayString = formatDate(today);
        const tomorrowString = formatDate(tomorrow);

        // const rawData = require("../sampleData/sampleData.json");

        const rawData = await axios.get(
          `https://api.nasa.gov/neo/rest/v1/feed?start_date=${todayString}&end_date=${tomorrowString}&api_key=j61KmanhEfIQUHCtW3XqzEwgfZT4Pw6zfF4SnJuE`
        );
        // console.log(rawData.data.near_earth_objects);
        if (rawData) {
          const asteroidsOnly = Object.values(
            rawData.data.near_earth_objects
          ).reduce(
            (dateArray, allAsteroids) => allAsteroids.concat(dateArray),
            []
          );
          // FOR TESTING ONLY: Add a hazardous asteroid passing by in ten seconds.
          const soon1 = new Date(Date.now() + 1000 * 10);
          const soon2 = new Date(Date.now() + 1000 * 15);
          asteroidsOnly.push({
            id: "2440012",
            name: "Sample Asteroid 1",
            nasa_jpl_url: "http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=2440012",
            estimated_diameter: {
              feet: {
                estimated_diameter_max: 2691.6899315481,
              },
            },
            is_potentially_hazardous_asteroid: true,
            close_approach_data: [
              {
                close_approach_date: soon1
                  .toLocaleString("en-GB", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                  .replace(/\ /g, "-"),
                close_approach_date_full:
                  soon1
                    .toLocaleString("en-GB", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                    .replace(/\ /g, "-") +
                  " " +
                  soon1.toISOString().slice(11, 16),
                epoch_date_close_approach: soon1.valueOf(),
                miss_distance: {
                  lunar: "19.7878445129",
                },
              },
            ],
          });
          asteroidsOnly.push({
            id: "2440013",
            name: "Sample Asteroid 2",
            nasa_jpl_url: "http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=2440012",
            estimated_diameter: {
              feet: {
                estimated_diameter_max: 2691.6899315481,
              },
            },
            is_potentially_hazardous_asteroid: false,
            close_approach_data: [
              {
                close_approach_date: soon2
                  .toLocaleString("en-GB", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                  .replace(/\ /g, "-"),
                close_approach_date_full:
                  soon2
                    .toLocaleString("en-GB", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                    .replace(/\ /g, "-") +
                  " " +
                  soon2.toISOString().slice(11, 16),
                epoch_date_close_approach: soon2.valueOf(),
                miss_distance: {
                  lunar: "159.7878445129",
                },
              },
            ],
          });
          const cleanData = reformatData(asteroidsOnly);
          setAsteroidData(cleanData);
          await scheduleNotifications();
        }
      }
    }
    fetchData();
    // console.log(asteroidData);
  }, [asteroidData]);

  React.useEffect(() => {
    setAsteroidData(updateTimeZone(asteroidData));
  }, [utcOffset]);

  const updateTimeZone = (asteroidsOnly) => {
    if (asteroidsOnly) {
      return asteroidsOnly.map((asteroid) => {
        const newDate = asteroid.date + 60 * 60 * 1000 * utcOffset;
        const newDateObj = new Date(newDate);
        const newDateString = newDateObj
          .toLocaleString("en-GB", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
          .replace(/\ /g, "-");
        const newTimeString =
          newDateObj.toISOString().slice(11, 16) +
          ` (UTC ${utcOffset < 0 ? utcOffset : `+${utcOffset}`})`;
        return {
          ...asteroid,
          date: newDate,
          dateString: newDateString,
          timeString: newTimeString,
        };
      });
    } else {
      return null;
    }
  };

  const reformatData = (asteroidsOnly) => {
    return asteroidsOnly
      .map((asteroid) => {
        const id = asteroid.id;
        let name = asteroid.name;
        if (name[0] === "(" && name[name.length - 1] === ")") {
          name = name.slice(1, name.length - 1);
        }
        const distance =
          Math.round(asteroid.close_approach_data[0].miss_distance.lunar * 10) /
          10;
        let [
          dateString,
          timeString,
        ] = asteroid.close_approach_data[0].close_approach_date_full.split(" ");
        timeString += ` (UTC)`;
        const date = asteroid.close_approach_data[0].epoch_date_close_approach;

        const nasaUrl = asteroid.nasa_jpl_url + ";orb=1;cov=0;log=0;cad=0#orb";
        const maxSize = Number(
          Number.parseFloat(
            asteroid.estimated_diameter.feet.estimated_diameter_max
          ).toPrecision(3)
        );
        // const roughSize = approx(maxSize);
        const isHazard = asteroid.is_potentially_hazardous_asteroid;

        return {
          id,
          name,
          distance,
          dateString,
          timeString,
          date,
          nasaUrl,
          maxSize,
          isHazard,
        };
      })
      .filter((asteroid) => asteroid.date > Date.now())
      .sort((asteroidA, asteroidB) => asteroidA.date - asteroidB.date);
  };

  React.useEffect(() => {
    const checkNotifications = async () => {
      if (notificationsOn && !notificationsPermission) {
        await Notifications.requestPermissionsAsync();
        const settings = await Notifications.getPermissionsAsync();
        if (
          settings.granted ||
          settings.ios?.status ===
            Notifications.IosAuthorizationStatus.PROVISIONAL
        ) {
          setNotificationsPermission(true);
          await scheduleNotifications();
        } else {
          await Notifications.cancelAllScheduledNotificationsAsync();
        }
      }
    };

    checkNotifications();
  }, [notificationsOn, notificationsPermission]);

  const scheduleNotifications = async () => {
    if (asteroidData) {
      await Promise.all(
        asteroidData.map((asteroid) => {
          const trigger = asteroid.date - Date.now();
          if (trigger > 2000) {
            const hazardTitle = asteroid.isHazard ? `⚠ ️` : ``;
            const hazardBody = asteroid.isHazard ? "Potential hazard. " : "";
            return Notifications.scheduleNotificationAsync({
              content: {
                title: hazardTitle + `Asteroid ${asteroid.name} passing Earth`,
                body:
                  hazardBody +
                  `${asteroid.maxSize} ft long, ${asteroid.distance} Lunar distances.`,
              },
              trigger: {
                seconds: trigger / 1000,
              },
            });
          } else {
            return true;
          }
        })
      );
    }
  };

  const utcArray = Object.keys([...Array(24)]).map((num) => num - 12);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground style={styles.bgImage} source={background}>
        <StatusBar style="light" />
        <View style={styles.topBar}>
          <Text style={styles.titleText}>neo misses</Text>
          <TouchableOpacity
            onPress={() => {
              setOptionsVisible(!optionsVisible);
            }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Options</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.indexPanel}>
          <Modal
            animationType="fade"
            visible={optionsVisible}
            transparent="true"
          >
            <View style={styles.centerView}>
              <View style={styles.optionsCard}>
                <Text style={styles.optionsTitleText}>OPTIONS</Text>
                <View style={styles.optionsLine}>
                  <Text style={styles.optionsText}>Asteroid notifications</Text>
                  <Switch
                    onValueChange={() => {
                      setNotificationsOn(!notificationsOn);
                    }}
                    value={notificationsOn}
                  />
                </View>
                <View style={styles.optionsLine}>
                  <Text style={styles.optionsText}>Time Zone</Text>
                  <Text style={styles.optionsText}>
                    {utcOffset < 0 ? `UTC ${utcOffset}` : `UTC +${utcOffset}`}
                  </Text>
                </View>
                <Picker
                  selectedValue={utcOffset}
                  onValueChange={(itemValue) => {
                    setUtcOffset(itemValue);
                  }}
                >
                  {utcArray.map((num) => (
                    <Picker.Item
                      key={num}
                      color="white"
                      label={num < 0 ? `UTC ${num}` : `UTC +${num}`}
                      value={num}
                    />
                  ))}
                </Picker>
                <View
                  style={styles.optionsLine}
                  onPress={() => {
                    setAsteroidData(null);
                  }}
                >
                  <TouchableOpacity>
                    <Text style={styles.optionsText}>Refresh</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setOptionsVisible(!optionsVisible);
                    }}
                  >
                    <Text style={styles.optionsText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
          <IndexList asteroidData={asteroidData} />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    flexDirection: "column",
    justifyContent: "center",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    // backgroundColor: "white",
  },
  titleText: {
    color: "#eeeeee",
    fontSize: 40,
    fontFamily: "System",
    // backgroundColor: "pink",
  },
  bgImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "flex-start",
  },
  button: {
    borderColor: "#eeeeee",
    borderWidth: 3,
    borderRadius: 10,
    marginTop: 5,
    // backgroundColor: "green",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    padding: 6,
    // backgroundColor: "red",
  },
  indexPanel: {
    paddingTop: 20,
    // backgroundColor: "red",
  },
  centerView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  optionsCard: {
    opacity: 1,
    marginTop: 20,
    backgroundColor: "rgba(80, 0, 80, 1)",
    borderWidth: 5,
    borderColor: "white",
    borderRadius: 10,
    padding: 5,
    margin: 10,
    color: "white",
    width: "80%",
  },
  optionsText: {
    fontSize: 20,
    color: "white",
  },
  optionsTitleText: {
    fontSize: 24,
    color: "white",
    textAlign: "center",
    padding: 10,
    fontWeight: "bold",
  },
  optionsLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
});
