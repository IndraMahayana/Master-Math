import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const windowWidth = Dimensions.get("window").width;

export default function GameOverModal({
  visible,
  reason, // 'time-up' atau 'wrong-answer'
  score,
  levelTitle,
  onRetry,
  onBackToMenu,
}) {
  const isTimeUp = reason === "time-up";
  const isOutOfLives = reason === "out-of-lives";
  const title = isOutOfLives ? "💔 NYAWA HABIS!" : (isTimeUp ? "⏰ WAKTU HABIS!" : "❌ JAWABAN SALAH!");
  const message = isOutOfLives
    ? "Kamu telah kehilangan seluruh nyawa!"
    : (isTimeUp ? "Waktu bermain kamu habis!" : "Jawaban kamu salah!");

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent
    >
      {/* Semi-transparent overlay */}
      <View style={styles.overlay}>
        {/* Modal Card */}
        <View style={styles.modalCard}>
          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Message */}
          <Text style={styles.message}>{message}</Text>

          {/* Level Info */}
          <View style={styles.infoBox}>
            <Text style={styles.levelLabel}>Level</Text>
            <Text style={styles.levelValue}>{levelTitle}</Text>
          </View>

          {/* Score Display */}
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>Skor Akhir</Text>
            <Text style={styles.scoreValue}>{score}</Text>
          </View>

          {/* Buttons Container */}
          <View style={styles.buttonsContainer}>
            {/* Retry Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.retryButtonWrapper}
              onPress={onRetry}
            >
              <LinearGradient
                colors={["#4C63D2", "#A78BFA"]}
                style={styles.retryButton}
                start={[0, 0]}
                end={[1, 1]}
              >
                <Text style={styles.retryButtonText}>Coba Lagi</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Back to Menu Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.backButtonWrapper}
              onPress={onBackToMenu}
            >
              <LinearGradient
                colors={["#FF6B6B", "#FFB366"]}
                style={styles.backButton}
                start={[0, 0]}
                end={[1, 1]}
              >
                <Text style={styles.backButtonText}>Kembali ke Menu</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 32,
    width: windowWidth - 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#111",
    marginBottom: 12,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
    fontWeight: "500",
  },
  infoBox: {
    backgroundColor: "rgba(200, 210, 255, 0.3)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    width: "100%",
    alignItems: "center",
  },
  levelLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
    marginBottom: 4,
  },
  levelValue: {
    fontSize: 18,
    fontWeight: "900",
    color: "#1A2980",
  },
  scoreBox: {
    backgroundColor: "#FFE97D20",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 28,
    width: "100%",
    alignItems: "center",
  },
  scoreLabel: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: "900",
    color: "#fff",
  },
  buttonsContainer: {
    width: "100%",
    gap: 12,
  },
  retryButtonWrapper: {
    borderRadius: 14,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  retryButton: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  backButtonWrapper: {
    borderRadius: 14,
    overflow: "hidden",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  backButton: {
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
