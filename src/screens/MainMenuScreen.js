import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  SectionList,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import {
  Text,
  Button,
  Title,
  Card,
  List,
  Dialog,
  Portal,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { auth, db } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  checkPhaseUnlock,
  getRequiredScore,
} from "../systems/progressionSystem";
import { isLevelUnlocked } from "../systems/challengeSystem";
import {
  getResponsiveFontSize,
  getResponsiveWidth,
  getResponsiveSpacing,
  getDeviceType,
  getNumColumns,
  getContentPadding,
  getResponsiveElevation,
  getMaxContentWidth,
} from "../utils/responsiveUtils";

export default function MainMenuScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const deviceType = getDeviceType();
  const numColumns = getNumColumns();

  // Responsive styles
  const responsiveStyles = useMemo(
    () => ({
      containerPadding: getContentPadding(),
      contentPadding: getResponsiveSpacing(15),
      profileCardPadding: getResponsiveSpacing(20),
      itemTitleSize: getResponsiveFontSize(14),
      itemDescSize: getResponsiveFontSize(12),
      sectionTitleSize: getResponsiveFontSize(18),
      elevation: getResponsiveElevation(4),
    }),
    [deviceType],
  );

  const [userData, setUserData] = useState({
    username:
      route.params?.playerName ||
      (auth.currentUser ? auth.currentUser.email?.split("@")[0] : "Guest"),
    score: route.params?.score || 0,
    photoURL: null,
    completedLevels: [],
    completedChallenges: [],
  });

  const [showModeDialog, setShowModeDialog] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [expandedPhases, setExpandedPhases] = useState({
    0: true,
    1: false,
    2: false,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const userSnap = await getDoc(doc(db, "users", auth.currentUser.uid));
          if (userSnap.exists()) {
            let data = userSnap.data();
            const today = new Date().toISOString().split("T")[0];
            const lastLogin = data.lastLoginDate;

            if (lastLogin !== today) {
              const newScore = (data.score || 0) + 1000;
              await updateDoc(doc(db, "users", auth.currentUser.uid), {
                lastLoginDate: today,
                score: newScore,
              });
              data.score = newScore;
              data.lastLoginDate = today;
              Alert.alert(
                "🎉 Bonus Login Harian!",
                "Kamu mendapatkan +1000 Poin untuk login hari ini!",
              );
            }

            setUserData(data);
          }
        } catch (error) {
          console.log("Error fetching user data", error);
        }
      }
    };

    const unsubscribe = navigation.addListener("focus", () => {
      fetchUserData();
    });

    return unsubscribe;
  }, [navigation]);

  const phasesData = [
    {
      title: "Fase 1: Aritmatika & Dasar",
      data: [
        { id: "1", title: "Level 1: Penjumlahan" },
        { id: "2", title: "Level 2: Pengurangan" },
        { id: "3", title: "Level 3: Perkalian" },
        { id: "4", title: "Level 4: Pembagian" },
        { id: "5", title: "Level 5: Operasi Campuran" },
        { id: "6", title: "Level 6: Pecahan" },
        { id: "7", title: "Level 7: Desimal" },
        { id: "8", title: "Level 8: Persen" },
        { id: "9", title: "Level 9: Rasio & Proporsi" },
        { id: "10", title: "Level 10: Perbandingan" },
        { id: "11", title: "Level 11: Pembulatan" },
        { id: "12", title: "Level 12: Estimasi Cepat" },
        { id: "13", title: "Level 13: Faktor & Kelipatan" },
        { id: "14", title: "Level 14: FPB & KPK" },
        { id: "15", title: "Level 15: Bilangan Negatif" },
      ],
    },
    {
      title: "Fase 2: Aljabar",
      data: [
        { id: "16", title: "Level 16: Variabel" },
        { id: "17", title: "Level 17: Persamaan Linear" },
        { id: "18", title: "Level 18: Pertidaksamaan" },
        { id: "19", title: "Level 19: Sistem Persamaan" },
        { id: "20", title: "Level 20: Aljabar Ekspresi" },
        { id: "21", title: "Level 21: Faktorisasi" },
        { id: "22", title: "Level 22: Kuadrat" },
        { id: "23", title: "Level 23: Fungsi" },
        { id: "24", title: "Level 24: Fungsi Linear" },
        { id: "25", title: "Level 25: Fungsi Kuadrat" },
        { id: "26", title: "Level 26: Polinomial" },
        { id: "27", title: "Level 27: Substitusi" },
        { id: "28", title: "Level 28: Eliminasi" },
        { id: "29", title: "Level 29: Grafik Fungsi" },
        { id: "30", title: "Level 30: Transformasi Fungsi" },
      ],
    },
    {
      title: "Fase 3: Geometri",
      data: [
        { id: "31", title: "Level 31: Bangun Datar" },
        { id: "32", title: "Level 32: Keliling & Luas" },
        { id: "33", title: "Level 33: Bangun Ruang" },
        { id: "34", title: "Level 34: Volume" },
        { id: "35", title: "Level 35: Sudut" },
        { id: "36", title: "Level 36: Segitiga" },
        { id: "37", title: "Level 37: Lingkaran" },
        { id: "38", title: "Level 38: Teorema Pythagoras" },
        { id: "39", title: "Level 39: Transformasi Geometri" },
        { id: "40", title: "Level 40: Simetri" },
        { id: "41", title: "Level 41: Koordinat Kartesius" },
        { id: "42", title: "Level 42: Jarak Titik" },
        { id: "43", title: "Level 43: Garis & Gradien" },
        { id: "44", title: "Level 44: Vektor Dasar" },
        { id: "45", title: "Level 45: Geometri Analitik" },
      ],
    },
  ];

  const phaseUnlocks = checkPhaseUnlock(userData);

  const sections = phasesData.map((phase, index) => {
    let isPhaseUnlocked = true;
    if (index === 1) isPhaseUnlocked = phaseUnlocks.phase2;
    if (index === 2) isPhaseUnlocked = phaseUnlocks.phase3;

    return {
      title: phase.title,
      isPhaseUnlocked,
      data: phase.data.map((lvl) => {
        const levelNum = parseInt(lvl.id, 10);
        const reqScore = getRequiredScore(levelNum);
        const unlocked = isPhaseUnlocked && isLevelUnlocked(userData, lvl);
        return {
          ...lvl,
          requiredScore: reqScore,
          unlocked,
        };
      }),
    };
  });

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.log("Error signing out: ", error);
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    }
  };

  const togglePhase = (phaseIndex) => {
    setExpandedPhases((prev) => ({
      ...prev,
      [phaseIndex]: !prev[phaseIndex],
    }));
  };

  const handleSelectLevel = (level) => {
    if (level.unlocked) {
      setSelectedLevel(level);
      setShowModeDialog(true);
    } else {
      Alert.alert(
        "Terkunci 🔒",
        `Kumpulkan skor setidaknya ${level.requiredScore} Pts untuk membuka area ini! (Skor saat ini: ${userData.score})`,
      );
    }
  };

  const startGame = (mode) => {
    setShowModeDialog(false);
    if (selectedLevel) {
      navigation.navigate("Gameplay", {
        levelId: selectedLevel.id,
        levelTitle: selectedLevel.title,
        gameMode: mode,
      });
    }
  };

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
    <LinearGradient
      colors={["#1F1F1F", "#2A2A2A"]}
      style={[styles.container, { paddingTop: Math.max(insets.top + 10, 40) }]}
    >
      <ScrollView
        style={styles.mainScrollView}
        showsVerticalScrollIndicator={true}
        scrollIndicatorInsets={{ right: 1 }}
      >
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
                <Title
                  style={[
                    styles.welcomeText,
                    { fontSize: getResponsiveFontSize(18) },
                  ]}
                  numberOfLines={1}
                >
                  {userData.username}
                </Title>
                <View style={styles.scoreContainer}>
                  <MaterialCommunityIcons
                    name="star"
                    size={16}
                    color="#FF9800"
                  />
                  <Text
                    style={[
                      styles.scoreText,
                      { fontSize: getResponsiveFontSize(12) },
                    ]}
                  >
                    Skor: <Text style={styles.scoreBold}>{userData.score}</Text>{" "}
                    Pts
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
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color="#FFF"
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.topButtonsContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate("Leaderboard")}
              style={styles.topButton}
            >
              <LinearGradient
                colors={["#2196F3", "#1976D2"]}
                style={styles.topButtonGradient}
              >
                <MaterialCommunityIcons name="trophy" size={24} color="#FFF" />
                <Text
                  style={[
                    styles.topButtonText,
                    { fontSize: getResponsiveFontSize(13) },
                  ]}
                >
                  Papan Peringkat
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate("QuestionWarehouse")}
              style={styles.topButton}
            >
              <LinearGradient
                colors={["#FF6B6B", "#FF5252"]}
                style={styles.topButtonGradient}
              >
                <MaterialCommunityIcons
                  name="book-open-variant"
                  size={24}
                  color="#FFF"
                />
                <Text
                  style={[
                    styles.topButtonText,
                    { fontSize: getResponsiveFontSize(13), color: "#FFF" },
                  ]}
                >
                  Gudang Soal
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <Title
            style={[
              styles.sectionTitle,
              { fontSize: getResponsiveFontSize(16) },
            ]}
          >
            ⚔️ Pilih Level
          </Title>

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
                      expandedPhases[phaseIndex]
                        ? "chevron-down"
                        : "chevron-right"
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
                  {section.title.includes("Fase 2")
                    ? "70% Fase 1"
                    : "60% Fase 2"}{" "}
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
      </ScrollView>

      {/* Mode Selection Dialog */}
      <Portal>
        <Dialog
          visible={showModeDialog}
          onDismiss={() => setShowModeDialog(false)}
          style={styles.dialogStyle}
        >
          <Dialog.Title style={styles.dialogTitle}>
            Pilih Mode Permainan
          </Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogSub}>
              Tentukan tingkat kesulitanmu untuk {selectedLevel?.title}:
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.modeCard}
              onPress={() => startGame("sudden_death")}
            >
              <LinearGradient
                colors={["#FF416C", "#FF4B2B"]}
                style={styles.modeGradient}
              >
                <MaterialCommunityIcons name="skull" size={28} color="#FFF" />
                <View style={styles.modeTextWrap}>
                  <Text style={styles.modeTitle}>Sudden Death</Text>
                  <Text style={styles.modeDesc}>
                    1 Kali Salah / Waktu Habis = Kalah
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.modeCard}
              onPress={() => startGame("lives")}
            >
              <LinearGradient
                colors={["#11998e", "#38ef7d"]}
                style={styles.modeGradient}
              >
                <MaterialCommunityIcons
                  name="cards-heart"
                  size={28}
                  color="#FFF"
                />
                <View style={styles.modeTextWrap}>
                  <Text style={styles.modeTitle}>Mode Nyawa (3 ❤️)</Text>
                  <Text style={styles.modeDesc}>
                    Punya 3 kesempatan sebelum Game Over
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.modeCard}
              onPress={() => startGame("20_questions")}
            >
              <LinearGradient
                colors={["#8E2DE2", "#4A00E0"]}
                style={styles.modeGradient}
              >
                <MaterialCommunityIcons
                  name="format-list-numbered"
                  size={28}
                  color="#FFF"
                />
                <View style={styles.modeTextWrap}>
                  <Text style={styles.modeTitle}>Mode 20 Soal 🎯</Text>
                  <Text style={styles.modeDesc}>
                    Selesaikan 20 soal bertahap hingga Final Boss!
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowModeDialog(false)} textColor="#666">
              Batal
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainScrollView: {
    flex: 1,
  },
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
  avatarInitial: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
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
  topButtonsContainer: {
    flexDirection: "row",
    gap: getResponsiveSpacing(12),
    marginBottom: getResponsiveSpacing(20),
    marginHorizontal: getResponsiveSpacing(6),
  },
  topButton: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    minHeight: getResponsiveFontSize(56),
  },
  topButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: getResponsiveSpacing(12),
    gap: getResponsiveSpacing(8),
  },
  topButtonText: {
    fontWeight: "900",
    color: "#FFF",
    textAlign: "center",
    fontSize: 13,
    letterSpacing: 0.3,
  },
  phaseContainer: {
    marginBottom: getResponsiveSpacing(10),
  },
  phaseHeaderTouchable: {
    backgroundColor: "rgba(26, 41, 128, 0.9)",
    borderRadius: 14,
    paddingVertical: getResponsiveSpacing(12),
    paddingHorizontal: getResponsiveSpacing(14),
    marginBottom: getResponsiveSpacing(8),
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(38, 208, 206, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
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
  listContainer: {
    paddingBottom: getResponsiveSpacing(20),
    paddingHorizontal: getResponsiveSpacing(4),
  },
  listItem: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    borderRadius: 16,
    marginBottom: getResponsiveSpacing(11),
    elevation: 5,
    borderWidth: 1,
    borderColor: "rgba(38, 208, 206, 0.15)",
    paddingVertical: getResponsiveSpacing(10),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  lockedItem: {
    opacity: 0.6,
    backgroundColor: "rgba(230, 230, 230, 0.9)",
  },
  itemTitle: {
    fontWeight: "900",
    fontSize: getResponsiveFontSize(13),
    color: "#1F1F1F",
    letterSpacing: 0.2,
  },
  itemDesc: {
    color: "#666",
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
  bottomButtonsContainer: {
    flexDirection: "row",
    gap: getResponsiveSpacing(12),
    marginTop: getResponsiveSpacing(16),
    marginBottom: getResponsiveSpacing(24),
    marginHorizontal: getResponsiveSpacing(6),
    paddingTop: getResponsiveSpacing(14),
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
  },
  bottomButton: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 6,
    minHeight: getResponsiveFontSize(56),
  },
  bottomButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: getResponsiveSpacing(12),
    gap: getResponsiveSpacing(8),
  },
  bottomButtonText: {
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
  },
  dialogStyle: {
    backgroundColor: "#fff",
    borderRadius: 20,
    maxWidth: 500,
    alignSelf: "center",
  },
  dialogTitle: {
    textAlign: "center",
    fontWeight: "900",
    color: "#FF6B6B",
    fontSize: getResponsiveFontSize(16),
  },
  dialogSub: {
    textAlign: "center",
    marginBottom: getResponsiveSpacing(15),
    color: "#555",
    fontSize: getResponsiveFontSize(13),
  },
  modeCard: {
    marginBottom: getResponsiveSpacing(12),
    borderRadius: 15,
    overflow: "hidden",
    elevation: 4,
  },
  modeGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: getResponsiveSpacing(15),
  },
  modeTextWrap: {
    marginLeft: getResponsiveSpacing(12),
    flex: 1,
  },
  modeTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: getResponsiveFontSize(14),
  },
  modeDesc: {
    color: "#eee",
    fontSize: getResponsiveFontSize(11),
    marginTop: 2,
  },
});
