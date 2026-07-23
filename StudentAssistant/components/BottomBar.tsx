import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

export default function BottomBar() {
  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.icon}>
        <Ionicons name="list" size={24} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.icon}>
        <Ionicons name="document-text" size={24} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.home}>
        <Ionicons name="home" size={30} color="#000" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.icon}>
        <Ionicons name="film" size={24} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.icon}>
        <Ionicons name="sparkles" size={24} />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    height: 75,
    backgroundColor: "white",
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    elevation: 8,
  },

  icon: {
    width: 45,
    alignItems: "center",
  },

  home: {
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    marginTop: -30,
  },
});