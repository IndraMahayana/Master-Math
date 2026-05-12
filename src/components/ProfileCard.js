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
    backgroundColor: "rgba(255,255,255,0.98)",
    borderRadius: 24,
    elevation: 10,
    borderWidth: 1.5,
    borderColor: "rgba(255, 107, 107, 0.4)",
    shadowColor: "#1F1F1F",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
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
    backgroundColor: "#FF6B6B",
    justifyContent: "center",
    alignItems: "center",
    marginRight: getResponsiveSpacing(12),
    elevation: 5,
    borderWidth: 2,
    borderColor: "#FF6B6B",
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
    color: "#1F1F1F",
    letterSpacing: 0.5,
    fontSize: 16,
  },
  scoreText: {
    color: "#555",
    marginLeft: 6,
    fontWeight: "600",
    fontSize: 14,
  },
  scoreBold: {
    fontWeight: "bold",
    color: "#FF9800",
  },
});
