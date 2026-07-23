import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Header() {
  return (
    <View style={styles.container}>

      <Ionicons
        name="person-circle-outline"
        size={42}
      />

      <Text style={styles.title}>
        شعار التطبيق
      </Text>

      <Ionicons
        name="menu"
        size={35}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    height: 70,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: "#DDD",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});