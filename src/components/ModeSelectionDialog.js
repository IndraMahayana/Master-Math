import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Dialog, Portal, Button, Text } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ModeSelectionDialog({
  visible,
  onDismiss,
  selectedLevel,
  startGame,
}) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialogStyle}>
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
          <Button onPress={onDismiss} textColor="#666">
            Batal
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialogStyle: {
    backgroundColor: "#1E293B",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  dialogTitle: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  dialogSub: {
    textAlign: "center",
    marginBottom: 20,
    color: "rgba(255,255,255,0.7)",
  },
  modeCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
  },
  modeGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  modeTextWrap: {
    marginLeft: 16,
    flex: 1,
  },
  modeTitle: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  modeDesc: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    marginTop: 2,
  },
});
