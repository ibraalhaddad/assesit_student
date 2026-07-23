import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
} from "react-native";

import Header from "../../components/Header";
import LessonCard from "../../components/LessonCard";
import BottomBar from "../../components/BottomBar";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <LessonCard title="عنوان الفقرة" />
        <LessonCard title="عنوان الفقرة" />
      </ScrollView>

      <BottomBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },

  content: {
    padding: 15,
    paddingBottom: 120,
  },
});