import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Text, Card, List } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function QuestionWarehouseScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [isGridView, setIsGridView] = useState(false);

  const categories = [
    {
      id: "1",
      title: "Pertambahan",
      icon: "plus-circle",
      color: "#FF6B6B",
      gradient: ["#FF6B6B", "#FF8E72"],
      description: "Soal latihan penjumlahan",
    },
    {
      id: "2",
      title: "Pengurangan",
      icon: "minus-circle",
      color: "#4ECDC4",
      gradient: ["#4ECDC4", "#44A08D"],
      description: "Soal latihan pengurangan",
    },
    {
      id: "3",
      title: "Perkalian",
      icon: "multiplication",
      color: "#FFD93D",
      gradient: ["#FFD93D", "#FFA500"],
      description: "Soal latihan perkalian",
    },
    {
      id: "4",
      title: "Pembagian",
      icon: "division",
      color: "#6BCB77",
      gradient: ["#6BCB77", "#4D96BA"],
      description: "Soal latihan pembagian",
    },
    {
      id: "5",
      title: "Akar Kuadrat",
      icon: "square-root-box",
      color: "#9B59B6",
      gradient: ["#9B59B6", "#8E44AD"],
      description: "Soal latihan akar kuadrat",
    },
    {
      id: "6",
      title: "Logaritma",
      icon: "function",
      color: "#3498DB",
      gradient: ["#3498DB", "#2980B9"],
      description: "Soal latihan logaritma",
    },
    {
      id: "7",
      title: "Aljabar Dasar",
      icon: "variable",
      color: "#E74C3C",
      gradient: ["#E74C3C", "#C0392B"],
      description: "Soal latihan aljabar sederhana",
    },
    {
      id: "8",
      title: "Modulo (Sisa Bagi)",
      icon: "percent",
      color: "#16A085",
      gradient: ["#16A085", "#117A65"],
      description: "Soal latihan modulo/sisa bagi",
    },
    {
      id: "9",
      title: "Trigonometri",
      icon: "sine-wave",
      color: "#8E44AD",
      gradient: ["#8E44AD", "#6C3483"],
      description: "Soal latihan sin, cos, tan",
    },
    {
      id: "10",
      title: "Kalkulus (Turunan)",
      icon: "calculator",
      color: "#2980B9",
      gradient: ["#2980B9", "#1F618D"],
      description: "Soal latihan turunan fungsi",
    },
    {
      id: "11",
      title: "Persamaan Linear",
      icon: "chart-line",
      color: "#F39C12",
      gradient: ["#F39C12", "#D68910"],
      description: "Soal latihan persamaan linear",
    },
    {
      id: "12",
      title: "Persamaan Kuadrat",
      icon: "chart-scatter",
      color: "#C0392B",
      gradient: ["#C0392B", "#A93226"],
      description: "Soal latihan persamaan kuadrat",
    },
  ];

  const handleSelectCategory = (category) => {
    navigation.navigate("PracticeProblems", {
      categoryId: category.id,
      categoryTitle: category.title,
      categoryColor: category.color,
    });
  };

  const renderCategoryCard = (category) => (
    <TouchableOpacity
      key={category.id}
      activeOpacity={0.8}
      onPress={() => handleSelectCategory(category)}
      style={[styles.cardWrapper, isGridView && styles.cardWrapperGrid]}
    >
      <LinearGradient colors={category.gradient} style={[styles.categoryCard, isGridView && styles.categoryCardGrid]}>
        <View style={[styles.cardIconContainer, isGridView && styles.cardIconContainerGrid]}>
          <MaterialCommunityIcons name={category.icon} size={isGridView ? 40 : 50} color="#FFF" />
        </View>
        <View style={styles.cardTextContainer}>
          <Text style={[styles.categoryTitle, isGridView && styles.categoryTitleGrid]} numberOfLines={isGridView ? 2 : 1}>{category.title}</Text>
          {!isGridView && (
            <Text style={styles.categoryDesc}>{category.description}</Text>
          )}
        </View>
        {!isGridView && (
          <MaterialCommunityIcons name="chevron-right" size={24} color="#FFF" />
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={["#0F2027", "#203A43", "#2C5364"]}
      style={[styles.container, { paddingTop: Math.max(insets.top, 20) }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="chevron-left" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gudang Soal</Text>
        <TouchableOpacity
          onPress={() => setIsGridView(!isGridView)}
          style={styles.toggleButton}
        >
          <MaterialCommunityIcons name={isGridView ? "view-list" : "view-grid"} size={26} color="#FFD700" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        nestedScrollEnabled={true}
      >
        <Text style={styles.subtitle}>
          Pilih kategori soal untuk melatih kemampuan matematikamu:
        </Text>

        <View style={[styles.categoriesGrid, isGridView && styles.categoriesGridWrap]}>
          {categories.map((category) => renderCategoryCard(category))}
        </View>

        <Card style={styles.infoCard}>
          <Card.Content>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons
                name="information-outline"
                size={20}
                color="#FFD700"
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>
                Tidak ada batas waktu untuk praktik! Kerjakan soal sesuai
                kemampuanmu dan pelajari cara penyelesaiannya.
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  toggleButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "rgba(212, 175, 55, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.3)",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 10,
    marginBottom: 20,
    textAlign: "center",
  },
  categoriesGrid: {
    gap: 12,
    marginBottom: 20,
  },
  categoriesGridWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  cardWrapper: {
    borderRadius: 18,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  cardWrapperGrid: {
    width: "48%",
    marginBottom: 12,
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  categoryCardGrid: {
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
    minHeight: 140,
  },
  cardIconContainer: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 15,
    marginRight: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  cardIconContainerGrid: {
    marginRight: 0,
    marginBottom: 12,
    width: 55,
    height: 55,
    borderRadius: 14,
  },
  cardTextContainer: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#FFF",
    marginBottom: 4,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  categoryTitleGrid: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 0,
  },
  categoryDesc: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  infoCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    elevation: 0,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  infoIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 20,
  },
});
