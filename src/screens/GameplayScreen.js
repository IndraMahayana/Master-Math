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
import {
  calculateScore,
  applyEndGameBonuses,
  getPenaltyScore,
} from "../systems/scoreSystem";
import { isBossLevel } from "../systems/progressionSystem";
import { updateLeaderboard } from "../systems/leaderboardSystem";
import { arrayUnion } from "firebase/firestore";
import {
  getResponsiveFontSize,
  getResponsiveSpacing,
  getDeviceType,
  getResponsiveElevation,
} from "../utils/responsiveUtils";

export default function GameplayScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const deviceType = getDeviceType();

  // Responsive styles
  const responsiveStyles = useMemo(
    () => ({
      questionFontSize: getResponsiveFontSize(24),
      optionFontSize: getResponsiveFontSize(16),
      buttonPadding: getResponsiveSpacing(12),
      headerFontSize: getResponsiveFontSize(18),
      elevation: getResponsiveElevation(4),
    }),
    [deviceType],
  );

  // Pastikan levelId selalu string
  const levelId = String(
    route.params && route.params.levelId ? route.params.levelId : "1",
  );
  const levelTitle =
    route.params && route.params.levelTitle
      ? route.params.levelTitle
      : "Level 1";

  const gameMode = route.params?.gameMode || "sudden_death";

  // MAX_TIME stabil, tidak berubah setiap render. Timer ketat untuk boss level.
  const MAX_TIME = useMemo(() => {
    if (gameMode === "daily_challenge" || gameMode === "weekly_challenge")
      return 15;
    const base = 10 + parseInt(levelId, 10) * 5;
    return isBossLevel(levelId) ? Math.min(base, 20) : base;
  }, [levelId, gameMode]);
  const INITIAL_LIVES = 3;

  const [currentQ, setCurrentQ] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MAX_TIME);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(
    gameMode === "lives" ||
      gameMode === "daily_challenge" ||
      gameMode === "weekly_challenge"
      ? INITIAL_LIVES
      : null,
  );
  const [gameOver, setGameOver] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
  const [gameOverReason, setGameOverReason] = useState(null); // 'time-up', 'wrong-answer', 'out-of-lives', 'win'

  const [questionNumber, setQuestionNumber] = useState(1);
  const [isPerfect, setIsPerfect] = useState(true);
  const [highestStreak, setHighestStreak] = useState(0);

  // States for displaying bonuses in modal
  const [perfectBonusDisplay, setPerfectBonusDisplay] = useState(0);
  const [firstClearBonusDisplay, setFirstClearBonusDisplay] = useState(0);

  // Gunakan ref agar endGame selalu baca nilai score terbaru tanpa dependency masalah
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const gameOverRef = useRef(gameOver);
  gameOverRef.current = gameOver;

  // ─── Generate soal ───────────────────────────────────────────────────────────
  const loadQuestion = useCallback(
    (qNumOverride = null) => {
      try {
        const isChallenge =
          gameMode === "daily_challenge" || gameMode === "weekly_challenge";
        const qNum =
          gameMode === "20_questions" || isChallenge
            ? qNumOverride || questionNumber
            : null;

        let targetLevelId = levelId;
        if (isChallenge) {
          targetLevelId = Math.floor(Math.random() * 45) + 1; // Acak level 1-45
        }

        const newQ = generateMathProblem(targetLevelId, qNum);
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
      setCurrentQ({
        q: "5 + 3 = ?",
        answer: "8",
        options: ["6", "7", "8", "9"],
      });
      setTimeLeft(MAX_TIME);
    },
    [levelId, MAX_TIME],
  );

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

        let bonusScore = applyEndGameBonuses(finalScore, isPerfect);
        let perfectBonusPoints = bonusScore - finalScore; // The difference is the perfect bonus

        let newTotalScore = bonusScore;
        let completedChallenges = [];
        let completedLevels = [];
        let currentUsername = auth.currentUser.email?.split("@")[0] || "Guest";
        let firstClearBonusPoints = 0;

        if (userSnap.exists()) {
          const data = userSnap.data();
          completedLevels = data.completedLevels || [];

          // First Clear Bonus: If they scored >= 1000 and haven't cleared it before
          if (!completedLevels.includes(levelId) && bonusScore >= 1000) {
            firstClearBonusPoints = 1000;
            bonusScore += firstClearBonusPoints; // Update the bonus score they earned this round
          }

          // Akumulasikan skor total pemain agar level berikutnya bisa terbuka (Grinding)
          newTotalScore = (data.score || 0) + bonusScore;

          if (data.username) currentUsername = data.username;
          completedChallenges = data.completedChallenges || [];
        }

        // Set states for modal
        setPerfectBonusDisplay(perfectBonusPoints);
        setFirstClearBonusDisplay(firstClearBonusPoints);

        // Jika ini mode challenge, simpan skor ke database challenge khusus
        if (gameMode === "daily_challenge" || gameMode === "weekly_challenge") {
          const challengeType =
            gameMode === "daily_challenge" ? "daily" : "weekly";
          const challengeRef = doc(
            db,
            `challenge_leaderboards/${challengeType}/users`,
            auth.currentUser.uid,
          );
          const challengeSnap = await getDoc(challengeRef);

          let chScore = bonusScore;
          let chStreak = highestStreak;
          if (challengeSnap.exists()) {
            const chData = challengeSnap.data();
            if (chData.score && chData.score > bonusScore)
              chScore = chData.score;
            if (chData.streak && chData.streak > highestStreak)
              chStreak = chData.streak;
          }

          await setDoc(
            challengeRef,
            {
              score: chScore,
              streak: chStreak,
              username: currentUsername,
              date: new Date().toISOString(),
            },
            { merge: true },
          );

          return; // Jangan simpan ke skor utama dan history level
        }

        let updates = {
          email: auth.currentUser.email,
          score: newTotalScore,
          lastPlayed: new Date(),
        };

        // Jika skor >= 1000, level dianggap selesai (Unlock system)
        if (bonusScore >= 1000) {
          updates.completedLevels = arrayUnion(levelId);
        }

        // Jika perfect run, tambahkan ke completed challenges
        if (isPerfect && finalScore > 0) {
          updates.completedChallenges = arrayUnion(`perfect_level_${levelId}`);
        }

        await setDoc(userRef, updates, { merge: true });

        // ✅ Simpan ke gameHistory collection (bukan subcollection)
        const gameHistoryDoc = await addDoc(collection(db, "gameHistory"), {
          uid: auth.currentUser.uid,
          levelId: String(levelId),
          levelTitle,
          mode: gameMode,
          score: bonusScore,
          streak: highestStreak,
          isPerfect,
          createdAt: new Date(),
        });

        console.log("✅ Game saved to gameHistory:", {
          docId: gameHistoryDoc.id,
          uid: auth.currentUser.uid,
          levelId,
          score: bonusScore,
          mode: gameMode,
          timestamp: new Date().toISOString(),
        });

        // Update level-specific leaderboard
        await updateLeaderboard(levelId, {
          score: bonusScore,
          streak: highestStreak,
          username: currentUsername,
        });
      } catch (error) {
        console.error("❌ Error saving score:", error);
        console.error("Error stack:", error.stack);
        Alert.alert("Error", "Gagal menyimpan skor: " + error.message);
      }
    },
    [levelId, levelTitle, isPerfect, highestStreak],
  );

  // ─── Game Over ────────────────────────────────────────────────────────────────
  const endGame = useCallback(
    async (
      finalScore,
      isTimeOut = false,
      isOutOfLives = false,
      isWin = false,
    ) => {
      if (gameOverRef.current) return; // jangan panggil dua kali
      setGameOver(true);
      await saveScore(finalScore);
      let reason = isTimeOut ? "time-up" : "wrong-answer";
      if (
        (gameMode === "lives" ||
          gameMode === "daily_challenge" ||
          gameMode === "weekly_challenge") &&
        isOutOfLives
      ) {
        reason = "out-of-lives";
      }
      if (isWin) {
        reason = "win";
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
      if (
        gameMode === "lives" ||
        gameMode === "daily_challenge" ||
        gameMode === "weekly_challenge"
      ) {
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

      const timeTaken = MAX_TIME - timeLeft;
      const isCorrect = String(selectedOption) === String(currentQ.answer);

      if (isCorrect) {
        const newCombo = combo + 1;
        setCombo(newCombo);

        if (newCombo > highestStreak) {
          setHighestStreak(newCombo);
        }

        const points = calculateScore({
          difficulty: currentQ.difficulty || "Easy",
          streak: newCombo,
          timeTaken,
          isBoss: isBossLevel(levelId),
        });

        setScore((prev) => prev + points);

        if (gameMode === "20_questions" || gameMode === "daily_challenge") {
          if (questionNumber >= 20) {
            endGame(scoreRef.current + points, false, false, true); // Menang
            return;
          } else {
            const nextQ = questionNumber + 1;
            setQuestionNumber(nextQ);
            loadQuestion(nextQ);
          }
        } else if (gameMode === "weekly_challenge") {
          if (questionNumber >= 100) {
            endGame(scoreRef.current + points, false, false, true); // Menang
            return;
          } else {
            const nextQ = questionNumber + 1;
            setQuestionNumber(nextQ);
            loadQuestion(nextQ);
          }
        } else {
          loadQuestion();
        }
      } else {
        setIsPerfect(false);
        setCombo(0);

        const penalizedScore = getPenaltyScore(scoreRef.current);
        setScore(penalizedScore);

        if (
          gameMode === "lives" ||
          gameMode === "daily_challenge" ||
          gameMode === "weekly_challenge"
        ) {
          setLives((prev) => {
            const newLives = prev - 1;
            if (newLives <= 0) {
              endGame(penalizedScore, false, true);
            } else {
              loadQuestion();
            }
            return newLives;
          });
        } else {
          endGame(penalizedScore, false);
        }
      }
    },
    [
      currentQ,
      combo,
      timeLeft,
      loadQuestion,
      endGame,
      gameMode,
      highestStreak,
      MAX_TIME,
      levelId,
      questionNumber,
    ],
  );

  // ─── Handle Retry ─────────────────────────────────────────────────────────────
  const handleRetry = useCallback(() => {
    setShowGameOverModal(false);
    setGameOverReason(null);
    setGameOver(false);
    setScore(0);
    setCombo(0);
    setHighestStreak(0);
    setIsPerfect(true);
    setQuestionNumber(1);
    setPerfectBonusDisplay(0);
    setFirstClearBonusDisplay(0);
    setTimeLeft(MAX_TIME);
    if (
      gameMode === "lives" ||
      gameMode === "daily_challenge" ||
      gameMode === "weekly_challenge"
    )
      setLives(INITIAL_LIVES);
    gameOverRef.current = false;
    loadQuestion(1);
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
        style={[
          styles.container,
          { paddingTop: Math.max(insets.top + 10, 30) },
        ]}
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
        style={[
          styles.container,
          {
            paddingTop: Math.max(insets.top + 10, 30),
            paddingBottom: Math.max(insets.bottom, 10),
          },
        ]}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.statsBox}>
            <Text style={styles.scoreText}>SKOR: {score}</Text>
            {(gameMode === "lives" ||
              gameMode === "daily_challenge" ||
              gameMode === "weekly_challenge") &&
              lives !== null && (
                <View style={{ flexDirection: "row", marginTop: 4 }}>
                  {Array.from({ length: Math.max(0, lives) }).map((_, i) => (
                    <MaterialCommunityIcons
                      key={i}
                      name="heart"
                      size={16}
                      color="#FF3D00"
                      style={{ marginRight: 2 }}
                    />
                  ))}
                </View>
              )}
            {(gameMode === "20_questions" ||
              gameMode === "daily_challenge") && (
              <Text
                style={{
                  color: "#FFD700",
                  fontWeight: "bold",
                  marginTop: 4,
                  fontSize: 16,
                }}
              >
                🎯 SOAL: {questionNumber}/20
              </Text>
            )}
            {gameMode === "weekly_challenge" && (
              <Text
                style={{
                  color: "#FFD700",
                  fontWeight: "bold",
                  marginTop: 4,
                  fontSize: 16,
                }}
              >
                🔥 SOAL: {questionNumber}/100
              </Text>
            )}
            {combo > 1 && (
              <Text style={styles.comboText}>🔥 COMBO x{combo} 🔥</Text>
            )}
            {isBossLevel(levelId) && (
              <Text style={[styles.comboText, { color: "#8e44ad" }]}>
                👾 BOSS LEVEL 👾
              </Text>
            )}
          </View>
          <View style={styles.suddenDeathBadge}>
            <Text style={styles.suddenDeathText}>
              {gameMode === "daily_challenge"
                ? "📅 HARIAN"
                : gameMode === "weekly_challenge"
                  ? "📆 MINGGUAN"
                  : gameMode === "lives"
                    ? "❤️ MODE NYAWA"
                    : gameMode === "20_questions"
                      ? "🎯 20 SOAL"
                      : "☠️ SUDDEN DEATH"}
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
                    colors={["#FF6B6B", "#E63946"]}
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
        perfectBonus={perfectBonusDisplay}
        firstClearBonus={firstClearBonusDisplay}
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
    paddingHorizontal: 15,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  loadingText: {
    color: "#FFD700",
    fontSize: 16,
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
    flex: 1,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFD700",
  },
  comboText: {
    fontSize: 13,
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
    marginLeft: 10,
  },
  suddenDeathText: {
    color: "#FF3D00",
    fontWeight: "bold",
    fontSize: 11,
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
    marginBottom: 12,
    fontWeight: "900",
    fontSize: 14,
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
    paddingVertical: 25,
    paddingHorizontal: 15,
    backgroundColor: "rgba(255, 255, 255, 0.97)",
    alignItems: "center",
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 15,
  },
  levelTitle: {
    textAlign: "center",
    color: "#1F1F1F",
    marginBottom: 12,
    fontWeight: "900",
    fontSize: 13,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  questionText: {
    fontSize: 26,
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
    width: "48%",
    marginBottom: 12,
    borderRadius: 15,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  optionGradient: {
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  optionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
