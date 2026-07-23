import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

interface Props {
  title: string;
}

export default function LessonCard({
  title,
}: Props) {
  return (
    <View style={styles.card}>

      <Text style={styles.title}>
        {title}
      </Text>

      <View style={styles.content} />

      <View style={styles.actions}>

        <TouchableOpacity style={styles.button}>
          <Ionicons name="list" size={22} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Ionicons name="document-text" size={22} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Ionicons name="film" size={22} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Ionicons name="sparkles" size={22} />
        </TouchableOpacity>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  card: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDD",
    marginBottom: 20,
    overflow: "hidden",
  },

  title: {
    textAlign: "center",
    padding: 10,
    fontWeight: "bold",
    fontSize: 18,
    borderBottomWidth: 1,
    borderColor: "#DDD",
  },

  content: {
    height: 150,
  },

  actions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#DDD",
  },

  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderLeftWidth: 1,
    borderColor: "#DDD",
  },
});