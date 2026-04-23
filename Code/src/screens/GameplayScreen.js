import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Text,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { generateMathProblem } from "../utils/mathGenerator";
import GameOverModal from "../components/GameOverModal";
import { db, auth } from "../firebaseConfig";
import { doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";

export default function GameplayScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();

  // Pastikan levelId selalu string
  const levelId = String(
    route.params && route.params.levelId ? route.params.levelId : "1",
  );
  const levelTitle =
    route.params && route.params.levelTitle
      ? route.params.levelTitle
      : "Level 1";

  const gameMode = route.params?.gameMode || "sudden_death";

  // MAX_TIME stabil, tidak berubah setiap render
  const MAX_TIME = useMemo(() => 10 + parseInt(levelId, 10) * 5, [levelId]);
  const INITIAL_LIVES = 3;

  const [currentQ, setCurrentQ] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MAX_TIME);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(gameMode === "lives" ? INITIAL_LIVES : null);
  const [gameOver, setGameOver] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [gameOverReason, setGameOverReason] = useState(null); // 'time-up', 'wrong-answer', atau 'out-of-lives'

  // Gunakan ref agar endGame selalu baca nilai score terbaru tanpa dependency masalah
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const gameOverRef = useRef(gameOver);
  gameOverRef.current = gameOver;

  // ─── Generate soal ───────────────────────────────────────────────────────────
  const loadQuestion = useCallback(() => {
    try {
      const newQ = generateMathProblem(levelId);
      if (
        newQ &&
        newQ.q &&
        Array.isArray(newQ.options) &&
        newQ.options.length > 0
      ) {
        setCurrentQ(newQ);
        setTimeLeft(MAX_TIME);
        return;
      }
    } catch (e) {
      console.error("generateMathProblem error:", e);
    }
    // Fallback jika generator gagal
    setCurrentQ({ q: "5 + 3 = ?", answer: "8", options: ["6", "7", "8", "9"] });
    setTimeLeft(MAX_TIME);
  }, [levelId, MAX_TIME]);

  // Load soal pertama saat layar dibuka
  useEffect(() => {
    loadQuestion();
  }, []); // hanya sekali saat mount

  // ─── Simpan skor ke Firebase ──────────────────────────────────────────────────
  const saveScore = useCallback(
    async (finalScore) => {
      if (!auth.currentUser) return;
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        let highScore = finalScore;
        if (userSnap.exists()) {
          const data = userSnap.data();
          if (data.score && data.score > finalScore) highScore = data.score;
        }
        await setDoc(
          userRef,
          {
            email: auth.currentUser.email,
            score: highScore,
            lastPlayed: new Date(),
          },
          { merge: true },
        );
        await addDoc(collection(userRef, "history"), {
          levelId,
          levelTitle,
          score: finalScore,
          date: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error saving score:", error);
      }
    },
    [levelId, levelTitle],
  );

  // ─── Game Over ────────────────────────────────────────────────────────────────
  const endGame = useCallback(
    async (finalScore, isTimeOut = false, isOutOfLives = false) => {
      if (gameOverRef.current) return; // jangan panggil dua kali
      setGameOver(true);
      await saveScore(finalScore);
      let reason = isTimeOut ? "time-up" : "wrong-answer";
      if (gameMode === "lives" && isOutOfLives) {
        reason = "out-of-lives";
      }
      setGameOverReason(reason);
      setShowGameOverModal(true);
    },
    [saveScore, gameMode],
  );

  // ─── Timer countdown ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!currentQ || gameOver) return;

    if (timeLeft <= 0) {
      if (gameMode === "lives") {
        setLives((prev) => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            endGame(scoreRef.current, true, true);
          } else {
            setCombo(0);
            loadQuestion();
          }
          return newLives;
        });
      } else {
        endGame(scoreRef.current, true);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, currentQ, gameOver, endGame, gameMode, loadQuestion]);

  // ─── Handle jawaban ───────────────────────────────────────────────────────────
  const handleAnswer = useCallback(
    (selectedOption) => {
      if (gameOverRef.current || !currentQ) return;

      const isCorrect = String(selectedOption) === String(currentQ.answer);
      if (isCorrect) {
        const newCombo = combo + 1;
        const timeBonus = Math.floor(timeLeft / 2);
        const points = 10 + combo * 5 + timeBonus;
        const newScore = scoreRef.current + points;
        setScore(newScore);
        setCombo(newCombo);
        loadQuestion();
      } else {
        if (gameMode === "lives") {
           setLives((prev) => {
             const newLives = prev - 1;
             if (newLives <= 0) {
               endGame(scoreRef.current, false, true);
             } else {
               setCombo(0);
               loadQuestion();
             }
             return newLives;
           });
        } else {
          endGame(scoreRef.current, false);
        }
      }
    },
    [currentQ, combo, timeLeft, loadQuestion, endGame, gameMode],
  );

  // ─── Handle Retry ─────────────────────────────────────────────────────────────
  const handleRetry = useCallback(() => {
    setShowGameOverModal(false);
    setGameOverReason(null);
    setGameOver(false);
    setScore(0);
    setCombo(0);
    setTimeLeft(MAX_TIME);
    if (gameMode === "lives") setLives(INITIAL_LIVES);
    gameOverRef.current = false;
    loadQuestion();
  }, [MAX_TIME, loadQuestion, gameMode]);

  // ─── Handle Back to Menu ──────────────────────────────────────────────────────
  const handleBackToMenu = useCallback(() => {
    setShowGameOverModal(false);
    navigation.replace("MainMenu", { score: scoreRef.current });
  }, [navigation]);

  // ─── Render loading ───────────────────────────────────────────────────────────
  if (!currentQ) {
    return (
      <LinearGradient
        colors={["#0F2027", "#203A43", "#2C5364"]}
        style={[styles.container, { paddingTop: Math.max(insets.top + 10, 30) }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>Memuat soal...</Text>
        </View>
      </LinearGradient>
    );
  }

  const timerColor = timeLeft > MAX_TIME * 0.4 ? "#00FF87" : "#FF3D00";
  const progress = Math.max(0, Math.min(1, timeLeft / MAX_TIME));

  // ─── Render utama ─────────────────────────────────────────────────────────────
  return (
    <>
      <LinearGradient
        colors={["#0F2027", "#203A43", "#2C5364"]}
        style={[styles.container, { paddingTop: Math.max(insets.top + 10, 30), paddingBottom: Math.max(insets.bottom, 10) }]}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.statsBox}>
            <Text style={styles.scoreText}>SKOR: {score}</Text>
            {gameMode === "lives" && lives !== null && (
              <View style={{flexDirection: 'row', marginTop: 4}}>
                {Array.from({ length: Math.max(0, lives) }).map((_, i) => (
                  <MaterialCommunityIcons key={i} name="heart" size={16} color="#FF3D00" style={{marginRight: 2}} />
                ))}
              </View>
            )}
            {combo > 1 && (
              <Text style={styles.comboText}>🔥 COMBO x{combo} 🔥</Text>
            )}
          </View>
          <View style={styles.suddenDeathBadge}>
            <Text style={styles.suddenDeathText}>
              {gameMode === "lives" ? "❤️ MODE NYAWA" : "☠️ SUDDEN DEATH"}
            </Text>
          </View>
        </View>

        {/* Timer Bar — custom (web-safe) */}
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${Math.round(progress * 100)}%`,
                backgroundColor: timerColor,
              },
            ]}
          />
        </View>
        <Text style={[styles.timerText, { color: timerColor }]}>
          {timeLeft} Detik Tersisa!
        </Text>

        {/* Konten soal & pilihan */}
        <View style={styles.contentWrap}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Kartu Soal */}
            <View style={styles.questionCard}>
              <Text style={styles.levelTitle}>{levelTitle}</Text>
              <Text style={styles.questionText}>{currentQ.q}</Text>
            </View>

            {/* Pilihan Jawaban */}
            <View style={styles.optionsContainer}>
              {currentQ.options.map((option, index) => (
                <TouchableOpacity
                  key={`${index}-${option}`}
                  activeOpacity={0.8}
                  style={styles.optionButton}
                  onPress={() => handleAnswer(option)}
                  disabled={gameOver}
                >
                  <LinearGradient
                    colors={["#1A2980", "#26D0CE"]}
                    style={styles.optionGradient}
                    start={[0, 0]}
                    end={[1, 1]}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </LinearGradient>

      {/* Game Over Modal */}
      <GameOverModal
        visible={showGameOverModal}
        reason={gameOverReason}
        score={score}
        levelTitle={levelTitle}
        onRetry={handleRetry}
        onBackToMenu={handleBackToMenu}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  loadingText: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 12,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 10,
  },
  statsBox: {
    flexDirection: "column",
  },
  scoreText: {
    fontSize: 24,
    fontWeight: "900",
    color: "#FFD700",
  },
  comboText: {
    fontSize: 15,
    color: "#FF4500",
    fontWeight: "bold",
    marginTop: 2,
  },
  suddenDeathBadge: {
    backgroundColor: "rgba(255, 0, 0, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FF3D00",
  },
  suddenDeathText: {
    color: "#FF3D00",
    fontWeight: "bold",
    fontSize: 12,
  },
  progressBarBg: {
    height: 12,
    borderRadius: 6,
    marginVertical: 5,
    backgroundColor: "rgba(255,255,255,0.2)",
    overflow: "hidden",
  },
  progressBarFill: {
    height: 12,
    borderRadius: 6,
  },
  timerText: {
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "900",
    fontSize: 18,
  },
  contentWrap: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  questionCard: {
    paddingVertical: 35,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255, 255, 255, 0.97)",
    alignItems: "center",
    borderRadius: 25,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 15,
  },
  levelTitle: {
    textAlign: "center",
    color: "#1A2980",
    marginBottom: 16,
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  questionText: {
    fontSize: 34,
    textAlign: "center",
    fontWeight: "900",
    color: "#111",
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  optionButton: {
    width: "48%", // Responsif terhadap berbagai ukuran layar
    marginBottom: 15,
    borderRadius: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  optionGradient: {
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
});
