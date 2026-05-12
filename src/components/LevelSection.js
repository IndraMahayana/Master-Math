import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { List, Text } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  getResponsiveFontSize,
  getContentPadding,
  getResponsiveSpacing,
} from "../utils/responsiveUtils";

export default function LevelSection({
  sections,
  expandedPhases,
  togglePhase,
  handleSelectLevel,
}) {
  const renderLevelItem = ({ item }) => (
    <List.Item
      title={<Text style={styles.itemTitle}>{item.title}</Text>}
      description={
        <Text style={styles.itemDesc}>
          {item.unlocked
            ? "Tersedia Dimainkan"
            : `Butuh Skor Tertinggi: ${item.requiredScore}`}
        </Text>
      }
      left={(props) => (
        <View
          style={[
            styles.iconContainer,
            item.unlocked ? styles.iconUnlocked : styles.iconLocked,
          ]}
        >
          <List.Icon
            {...props}
            icon={item.unlocked ? "sword-cross" : "lock"}
            color="#fff"
          />
        </View>
      )}
      onPress={() => handleSelectLevel(item)}
      style={[styles.listItem, !item.unlocked && styles.lockedItem]}
    />
  );

  return (
    <View style={styles.contentContainer}>
      <Text
        style={[styles.sectionTitle, { fontSize: getResponsiveFontSize(16) }]}
      >
        ⚔️ Pilih Level
      </Text>

      {sections.map((section, phaseIndex) => (
        <View key={phaseIndex} style={styles.phaseContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => togglePhase(phaseIndex)}
            style={styles.phaseHeaderTouchable}
          >
            <View style={styles.phaseHeaderContent}>
              <MaterialCommunityIcons
                name={
                  expandedPhases[phaseIndex] ? "chevron-down" : "chevron-right"
                }
                size={24}
                color="#FFF"
              />
              <Text style={styles.phaseHeader}>
                {section.title} {section.isPhaseUnlocked ? "" : " 🔒"}
              </Text>
            </View>
          </TouchableOpacity>

          {!section.isPhaseUnlocked && expandedPhases[phaseIndex] && (
            <Text style={styles.phaseLockedDesc}>
              Selesaikan{" "}
              {section.title.includes("Fase 2") ? "70% Fase 1" : "60% Fase 2"}{" "}
              untuk membuka!
            </Text>
          )}

          {expandedPhases[phaseIndex] && (
            <View style={styles.levelsContainer}>
              {section.data.map((item) => (
                <View key={item.id}>{renderLevelItem({ item })}</View>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "rgba(255,255,255,0.08)",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: getResponsiveSpacing(18),
    paddingHorizontal: getResponsiveSpacing(12),
    marginHorizontal: getContentPadding(),
    maxWidth: 800,
    width: "90%",
    alignSelf: "center",
    marginBottom: getResponsiveSpacing(20),
  },
  sectionTitle: {
    color: "#FF6B6B",
    fontWeight: "900",
    marginBottom: getResponsiveSpacing(16),
    marginLeft: getResponsiveSpacing(8),
    letterSpacing: 0.5,
    fontSize: 18,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  phaseContainer: {
    marginBottom: getResponsiveSpacing(10),
  },
  phaseHeaderTouchable: {
    backgroundColor: "rgba(74, 0, 224, 0.85)",
    borderRadius: 14,
    paddingVertical: getResponsiveSpacing(12),
    paddingHorizontal: getResponsiveSpacing(14),
    marginBottom: getResponsiveSpacing(8),
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(142, 45, 226, 0.4)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  phaseHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  phaseHeader: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: "900",
    color: "#FFD700",
    marginLeft: getResponsiveSpacing(10),
    flex: 1,
    letterSpacing: 0.3,
  },
  phaseLockedDesc: {
    color: "#ffcccc",
    fontSize: getResponsiveFontSize(10),
    marginLeft: getResponsiveSpacing(12),
    marginBottom: getResponsiveSpacing(6),
    fontStyle: "italic",
    paddingHorizontal: getResponsiveSpacing(12),
  },
  levelsContainer: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    paddingHorizontal: getResponsiveSpacing(4),
    paddingVertical: getResponsiveSpacing(6),
    marginBottom: getResponsiveSpacing(8),
  },
  listItem: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    marginBottom: getResponsiveSpacing(11),
    elevation: 0,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: getResponsiveSpacing(10),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  lockedItem: {
    opacity: 0.5,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
  itemTitle: {
    fontWeight: "900",
    fontSize: getResponsiveFontSize(13),
    color: "#E0E0E0",
    letterSpacing: 0.2,
  },
  itemDesc: {
    color: "rgba(255,255,255,0.6)",
    fontSize: getResponsiveFontSize(11),
    fontWeight: "500",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 44,
    height: 44,
    borderRadius: 22,
    marginVertical: "auto",
    marginLeft: 5,
    marginRight: 10,
  },
  iconUnlocked: {
    backgroundColor: "#FF3D00",
  },
  iconLocked: {
    backgroundColor: "#9E9E9E",
  },
});
