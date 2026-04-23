import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Alert,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Text, TextInput, Button, Title } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { MaterialCommunityIcons } from "@expo/vector-icons";

WebBrowser.maybeCompleteAuthSession();

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // [PLACEHOLDER] SILAKAN GANTI DENGAN CLIENT ID MILIK ANDA DARI GOOGLE CLOUD CONSOLE
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: "PLACEHOLDER_WEB_CLIENT_ID",
    androidClientId: "PLACEHOLDER_ANDROID_CLIENT_ID",
    iosClientId: "PLACEHOLDER_IOS_CLIENT_ID",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      setLoading(true);
      signInWithCredential(auth, credential)
        .then(async (result) => {
          const user = result.user;
          // Cek apakah user sudah punya data document, jika belum buatkan
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (!userDoc.exists()) {
            await setDoc(doc(db, "users", user.uid), {
              username: user.displayName || user.email.split("@")[0],
              email: user.email,
              score: 0,
              createdAt: new Date(),
            });
          }
          setLoading(false);
          // Redirect ke login saat sukses
          Alert.alert(
            "Sukses",
            "Registrasi dengan Google berhasil. Silakan Login!",
            [{ text: "OK", onPress: () => navigation.replace("Login") }],
          );
        })
        .catch((error) => {
          setLoading(false);
          Alert.alert(
            "Gagal",
            "Terjadi kesalahan saat otentikasi Google: " + error.message,
          );
        });
    } else if (response?.type === "error" || response?.type === "dismiss") {
      Alert.alert(
        "Peringatan",
        "Proses Registrasi Google dibatalkan atau bermasalah.",
      );
    }
  }, [response]);

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case "auth/email-already-in-use":
        return "Email ini sudah terdaftar!";
      case "auth/invalid-email":
        return "Format email tidak valid!";
      case "auth/weak-password":
        return "Password terlalu lemah (minimal 6 karakter).";
      case "auth/operation-not-allowed":
        return "Gagal: Fitur Sign In Email/Password belum diaktifkan di Firebase Console Anda!";
      default:
        return "Terjadi kesalahan. Silakan coba lagi.";
    }
  };

  const handleRegister = async () => {
    if (!username.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Peringatan", "Semua kolom wajib diisi!");
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: email,
        score: 0,
        createdAt: new Date(),
      });

      // Tujuan Point 2: Setelah register berhasil langsung redirect ke menu login
      Alert.alert("Sukses", "Akun berhasil dibuat!", [
        { text: "Login Sekarang", onPress: () => navigation.replace("Login") },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert("Gagal Mendaftar", getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#1A2980", "#26D0CE"]} style={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBadge}>
            <MaterialCommunityIcons
              name="calculator-variant"
              size={35}
              color="#fff"
            />
          </View>
        </View>
        <Title style={styles.title}>Buat Akun</Title>
        <Text style={styles.subtitle}>Bergabunglah dengan Master Math</Text>

        <TextInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          mode="outlined"
          autoCapitalize="words"
          outlineColor="#e0e0e0"
          activeOutlineColor="#26D0CE"
          left={<TextInput.Icon icon="account" color="#1A2980" />}
        />

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          outlineColor="#e0e0e0"
          activeOutlineColor="#26D0CE"
          left={<TextInput.Icon icon="email" color="#1A2980" />}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          mode="outlined"
          secureTextEntry={!showPassword}
          outlineColor="#e0e0e0"
          activeOutlineColor="#26D0CE"
          left={<TextInput.Icon icon="lock" color="#1A2980" />}
          right={
            <TextInput.Icon
              icon={showPassword ? "eye-off" : "eye"}
              color="#1A2980"
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />

        <Button
          mode="contained"
          icon="account-plus"
          onPress={handleRegister}
          style={styles.button}
          contentStyle={styles.buttonContent}
          loading={loading}
          disabled={loading}
        >
          Daftar dengan Email
        </Button>

        <Text style={styles.divider}>ATAU</Text>

        <Button
          mode="outlined"
          icon="google"
          onPress={() => promptAsync()}
          style={[styles.button, styles.googleButton]}
          contentStyle={styles.buttonContent}
          textColor="#D32F2F"
          disabled={!request || loading}
        >
          Daftar dengan Google
        </Button>

        <TouchableOpacity
          onPress={() => navigation.navigate("Login")}
          style={styles.linkContainer}
        >
          <Text style={styles.linkText}>
            Sudah punya akun? <Text style={styles.linkTextBold}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: windowWidth * 0.9,
    maxWidth: 400,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 30,
    borderRadius: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    color: "#1A2980",
    marginBottom: 5,
  },
  subtitle: {
    textAlign: "center",
    marginBottom: 30,
    color: "#4a4a4a",
    fontSize: 14,
  },
  input: {
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  button: {
    marginTop: 15,
    borderRadius: 15,
    backgroundColor: "#1A2980",
    elevation: 5,
  },
  googleButton: {
    backgroundColor: "#fff",
    borderColor: "#D32F2F",
    borderWidth: 1.5,
  },
  buttonContent: {
    paddingVertical: 10,
  },
  divider: {
    textAlign: "center",
    marginVertical: 15,
    color: "#757575",
    fontWeight: "bold",
  },
  linkContainer: {
    marginTop: 25,
    alignItems: "center",
  },
  linkText: {
    color: "#1A2980",
    fontSize: 14,
  },
  linkTextBold: {
    fontWeight: "bold",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: "#1A2980",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#1A2980",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
});
