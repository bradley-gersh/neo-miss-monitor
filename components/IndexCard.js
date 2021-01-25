import * as React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    };
  },
});

export function IndexCard({ asteroid }) {
  // let name = asteroid.name;
  // if (name[0] === "(" && name[name.length - 1] === ")") {
  //   name = name.slice(1, name.length - 1);
  // }
  // const distance =
  //   Math.round(asteroid.close_approach_data[0].miss_distance.lunar * 10) / 10;
  // let [
  //   date,
  //   time,
  // ] = asteroid.close_approach_data[0].close_approach_date_full.split(" ");
  // time += ` (UTC)`;

  // const nasaUrl = asteroid.nasa_jpl_url;
  // const maxSize = asteroid.estimated_diameter.feet.estimated_diameter_max;
  // const roughSize = approx(maxSize);
  // const isHazard = asteroid.is_potentially_hazardous_asteroid;

  const {
    name,
    distance,
    dateString,
    timeString,
    nasaUrl,
    maxSize,
    isHazard,
  } = asteroid;

  const [modalVisible, setModalVisible] = React.useState(false);
  return (
    <View>
      <Modal
        animationType="fade"
        visible={modalVisible}
        transparent="true"
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centerView}>
          <TouchableOpacity
            style={
              distance <= 19.5 ? styles.detailCardWarning : styles.detailCard
            }
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View>
              <Text style={styles.indexCardName}>{name}</Text>
            </View>
            <View>
              {isHazard ? (
                <Text style={styles.hazardText}>Potentially hazardous</Text>
              ) : (
                <Text style={styles.hazardText}>
                  Not considered a potential hazard
                </Text>
              )}
            </View>
            <View>
              <Text>
                Approximate size: {approx(maxSize)} ({maxSize})
              </Text>
              <Text>Approach distance: {distance} Lunar distances</Text>
              <Text>
                Time of closest approach: {dateString}, {timeString}
              </Text>
              <TouchableOpacity
                onPress={async () => {
                  // await WebBrowser.openBrowserAsync({ nasaUrl });
                }}
              >
                <Text>NASA orbit diagram</Text>
              </TouchableOpacity>
              <Button
                onPress={async () => {
                  console.log("******* I AM HEREEEEE3 ******");
                  // Following lines should be moved to the Options modal
                  await Notifications.requestPermissionsAsync();
                  const settings = await Notifications.getPermissionsAsync();
                  console.log(
                    settings.granted ||
                      settings.ios?.status ===
                        Notifications.IosAuthorizationStatus.PROVISIONAL
                  );
                  // up to here
                  await Notifications.scheduleNotificationAsync({
                    content: {
                      title: "Passing Asteroid",
                      body: `${name} is now passing Earth (${distance} Lunar distances)`,
                    },
                    trigger: null,
                  });
                }}
                title="Send Notification"
              />
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
      <TouchableOpacity
        style={distance <= 19.5 ? styles.indexCardWarning : styles.indexCard}
        onPress={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View>
          <Text style={styles.indexCardName}>{name}</Text>
        </View>
        <View style={styles.indexCardInfo}>
          <Text style={styles.indexCardText}>
            <Text>{dateString + "\n"}</Text>
            <Text style={styles.distanceText}>{timeString}</Text>
          </Text>
          <Text style={styles.indexCardText}>
            <Text>Lunar distances:{"\n"}</Text>
            <Text
              style={
                distance <= 19.5
                  ? styles.distanceTextWarning
                  : styles.distanceText
              }
            >
              {distance}
            </Text>
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const approx = (size) => {
  switch (size) {
    default:
      return "big";
  }
};

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
  centerView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  detailCard: {
    opacity: 1,
    marginTop: 20,
    backgroundColor: "rgba(120, 0, 130, 1)",
    borderWidth: 5,
    borderColor: "white",
    borderRadius: 10,
    padding: 5,
    margin: 10,
  },
  detailCardWarning: {
    opacity: 1,
    marginTop: 20,
    backgroundColor: "rgba(120, 0, 0, 1)",
    borderWidth: 5,
    borderColor: "white",
    borderRadius: 10,
    padding: 5,
    margin: 10,
  },
  hazardText: {
    color: "white",
    fontStyle: "italic",
  },
});
