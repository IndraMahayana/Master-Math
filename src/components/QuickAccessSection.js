import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  getResponsiveFontSize,
  getContentPadding,
  getResponsiveSpacing,
} from "../utils/responsiveUtils";

export default function QuickAccessSection({ navigation }) {
  return (
    <View style={styles.quickAccessSection}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => navigation.navigate("ChallengeMenu")}
        style={styles.challengeButton}
      >
        <LinearGradient
          colors={["#FF416C", "#FF4B2B"]}
          style={styles.challengeGradient}
        >
          <MaterialCommunityIcons name="fire" size={32} color="#FFF" />
          <View style={styles.challengeTextWrap}>
            <Text
              style={[
                styles.challengeTitle,
                { fontSize: getResponsiveFontSize(16) },
              ]}
            >
              🔥 Arena Tantangan
            </Text>
            <Text
              style={[
                styles.challengeDesc,
                { fontSize: getResponsiveFontSize(11) },
              ]}
            >
              Tantangan Harian & Mingguan
            </Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  quickAccessSection: {
    marginHorizontal: getContentPadding(),
    marginBottom: getResponsiveSpacing(15),
    maxWidth: 800,
    alignSelf: "center",
    width: "90%",
  },
  challengeButton: {
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
  },
  challengeGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: getResponsiveSpacing(16),
  },
  challengeTextWrap: {
    marginLeft: getResponsiveSpacing(12),
    flex: 1,
  },
  challengeTitle: {
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 2,
  },
  challengeDesc: {
    color: "#FFE97D",
  },
});
