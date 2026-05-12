import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Card, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  getResponsiveFontSize,
  getContentPadding,
  getResponsiveSpacing,
} from "../utils/responsiveUtils";

export default function ProfileCard({ userData, navigation }) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() =>
        navigation
          .getParent()
          ?.navigate("ProfileTab", { screen: "ProfileScreen" })
      }
      style={styles.profileCard}
    >
      <Card style={styles.profileCardInner}>
        <Card.Content style={styles.profileContent}>
          <View style={styles.avatarPlaceholder}>
            <MaterialCommunityIcons
              name="account-circle"
              size={getResponsiveFontSize(45)}
              color="#fff"
            />
          </View>
          <View style={styles.textWrap}>
            <Text
              style={[
                styles.welcomeText,
                { fontSize: getResponsiveFontSize(18) },
              ]}
              numberOfLines={1}
            >
              {userData.username}
            </Text>
            <View style={styles.scoreContainer}>
              <MaterialCommunityIcons name="star" size={16} color="#FF9800" />
              <Text
                style={[
                  styles.scoreText,
                  { fontSize: getResponsiveFontSize(12) },
                ]}
              >
                Skor: <Text style={styles.scoreBold}>{userData.score}</Text> Pts
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile")}
            style={styles.settingsButton}
          >
            <MaterialCommunityIcons name="cog" size={24} color="#FF6B6B" />
          </TouchableOpacity>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    marginHorizontal: getContentPadding(),
    marginTop: getResponsiveSpacing(10),
    marginBottom: getResponsiveSpacing(12),
    maxWidth: 600,
    alignSelf: "center",
    width: "90%",
    borderRadius: 20,
  },
  profileCardInner: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 24,
    elevation: 0,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  profileContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: getResponsiveSpacing(12),
    paddingHorizontal: getResponsiveSpacing(12),
  },
  avatarPlaceholder: {
    width: getResponsiveFontSize(50),
    height: getResponsiveFontSize(50),
    borderRadius: getResponsiveFontSize(25),
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: getResponsiveSpacing(12),
    elevation: 0,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  scoreContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: getResponsiveSpacing(6),
  },
  settingsButton: {
    padding: getResponsiveSpacing(8),
    marginLeft: getResponsiveSpacing(12),
    borderRadius: 12,
    backgroundColor: "rgba(26, 41, 128, 0.1)",
  },
  textWrap: {
    flex: 1,
  },
  welcomeText: {
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.5,
    fontSize: 16,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  scoreText: {
    color: "rgba(255, 255, 255, 0.7)",
    marginLeft: 6,
    fontWeight: "600",
    fontSize: 14,
  },
  scoreBold: {
    fontWeight: "900",
    color: "#FFD700",
    textShadowColor: "rgba(255, 215, 0, 0.4)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
});
