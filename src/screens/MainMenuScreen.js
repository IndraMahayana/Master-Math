import React, { useState, useEffect } from "react";
import { StyleSheet, Alert, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

import {
  checkPhaseUnlock,
  getRequiredScore,
} from "../systems/progressionSystem";
import { isLevelUnlocked } from "../systems/challengeSystem";

import ProfileCard from "../components/ProfileCard";
import QuickAccessSection from "../components/QuickAccessSection";
import LevelSection from "../components/LevelSection";
import ModeSelectionDialog from "../components/ModeSelectionDialog";

export default function MainMenuScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();

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

  return (
    <LinearGradient
      colors={["#0F2027", "#203A43", "#2C5364"]}
      style={[styles.container, { paddingTop: Math.max(insets.top + 10, 40) }]}
    >
      <ScrollView
        style={styles.mainScrollView}
        showsVerticalScrollIndicator={true}
        scrollIndicatorInsets={{ right: 1 }}
      >
        <ProfileCard userData={userData} navigation={navigation} />
        <QuickAccessSection navigation={navigation} />
        <LevelSection
          sections={sections}
          expandedPhases={expandedPhases}
          togglePhase={togglePhase}
          handleSelectLevel={handleSelectLevel}
        />
      </ScrollView>

      <ModeSelectionDialog
        visible={showModeDialog}
        onDismiss={() => setShowModeDialog(false)}
        selectedLevel={selectedLevel}
        startGame={startGame}
      />
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
});
