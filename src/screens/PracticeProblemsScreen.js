import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  TextInput,
} from "react-native";
import { Text, Card, Button, SegmentedButtons } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// Problem generation functions
const generateProblem = (categoryId, difficulty = "easy") => {
  const randInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  let problem = {};

  switch (categoryId) {
    case "1": // Pertambahan (Addition)
      {
        let a, b;
        if (difficulty === "easy") {
          a = randInt(1, 20);
          b = randInt(1, 20);
        } else if (difficulty === "medium") {
          a = randInt(20, 100);
          b = randInt(20, 100);
        } else {
          a = randInt(100, 999);
          b = randInt(100, 999);
        }
        problem = {
          question: `${a} + ${b} = ?`,
          answer: a + b,
          hint: "Jumlahkan kedua angka. Mulai dari angka pertama, kemudian tambahkan angka kedua.",
          steps: [
            `Tambahkan angka pertama: ${a}`,
            `Dengan angka kedua: ${b}`,
            `Hasilnya: ${a} + ${b} = ${a + b}`,
          ],
        };
      }
      break;

    case "2": // Pengurangan (Subtraction)
      {
        let a, b;
        if (difficulty === "easy") {
          a = randInt(10, 30);
          b = randInt(1, a - 1);
        } else if (difficulty === "medium") {
          a = randInt(50, 150);
          b = randInt(1, a - 1);
        } else {
          a = randInt(500, 1000);
          b = randInt(1, a - 1);
        }
        problem = {
          question: `${a} - ${b} = ?`,
          answer: a - b,
          hint: "Kurangi angka kedua dari angka pertama. Pastikan hasilnya positif.",
          steps: [
            `Kurangi angka pertama: ${a}`,
            `Dengan angka kedua: ${b}`,
            `Hasilnya: ${a} - ${b} = ${a - b}`,
          ],
        };
      }
      break;

    case "3": // Perkalian (Multiplication)
      {
        let a, b;
        if (difficulty === "easy") {
          a = randInt(2, 10);
          b = randInt(2, 10);
        } else if (difficulty === "medium") {
          a = randInt(10, 20);
          b = randInt(10, 20);
        } else {
          a = randInt(20, 50);
          b = randInt(20, 50);
        }
        problem = {
          question: `${a} × ${b} = ?`,
          answer: a * b,
          hint: "Kalikan angka pertama dengan angka kedua. Gunakan tabel perkalian jika perlu.",
          steps: [
            `Kalikan angka pertama: ${a}`,
            `Dengan angka kedua: ${b}`,
            `Hasilnya: ${a} × ${b} = ${a * b}`,
          ],
        };
      }
      break;

    case "4": // Pembagian (Division)
      {
        let b, a;
        if (difficulty === "easy") {
          b = randInt(2, 10);
          const quotient = randInt(2, 10);
          a = b * quotient;
        } else if (difficulty === "medium") {
          b = randInt(10, 20);
          const quotient = randInt(2, 10);
          a = b * quotient;
        } else {
          b = randInt(10, 30);
          const quotient = randInt(5, 20);
          a = b * quotient;
        }
        problem = {
          question: `${a} ÷ ${b} = ?`,
          answer: a / b,
          hint: "Bagilah angka pertama dengan angka kedua. Hasil pembagian dengan angka yang membagi habis akan menjadi bilangan bulat.",
          steps: [
            `Bagi angka pertama: ${a}`,
            `Dengan angka kedua: ${b}`,
            `Hasilnya: ${a} ÷ ${b} = ${a / b}`,
          ],
        };
      }
      break;

    case "5": // Akar Kuadrat (Square Root)
      {
        let base;
        if (difficulty === "easy") {
          base = randInt(1, 10);
        } else if (difficulty === "medium") {
          base = randInt(10, 20);
        } else {
          base = randInt(20, 30);
        }
        const number = base * base;
        problem = {
          question: `√${number} = ?`,
          answer: base,
          hint: "Cari angka yang jika dikalikan dengan dirinya sendiri akan menghasilkan angka dalam akar. Gunakan tabel kuadrat sempurna.",
          steps: [
            `Cari akar kuadrat dari: ${number}`,
            `Cari angka yang jika dikuadratkan menghasilkan ${number}`,
            `${base} × ${base} = ${number}`,
            `Jadi √${number} = ${base}`,
          ],
        };
      }
      break;

    case "6": // Logaritma (Logarithm)
      {
        const base = 10;
        const exponents = [1, 2, 3, 4, 5];
        const exp = exponents[randInt(0, exponents.length - 1)];
        const number = Math.pow(base, exp);
        problem = {
          question: `log₁₀(${number}) = ?`,
          answer: exp,
          hint: "Logaritma adalah kebalikan dari pangkat. Cari pangkat berapa jika 10 dipangkatkan akan menghasilkan angka tersebut.",
          steps: [
            `Cari logaritma basis 10 dari: ${number}`,
            `Cari pangkat x dimana 10^x = ${number}`,
            `10^${exp} = ${number}`,
            `Jadi log₁₀(${number}) = ${exp}`,
          ],
        };
      }
      break;

    case "7": // Aljabar Dasar (Basic Algebra)
      {
        // Soal: ax + b = c, cari x
        let a, b, c;
        if (difficulty === "easy") {
          a = randInt(2, 5);
          b = randInt(1, 10);
          const x = randInt(1, 5);
          c = a * x + b;
        } else if (difficulty === "medium") {
          a = randInt(3, 8);
          b = randInt(5, 20);
          const x = randInt(2, 10);
          c = a * x + b;
        } else {
          a = randInt(5, 12);
          b = randInt(10, 30);
          const x = randInt(5, 20);
          c = a * x + b;
        }
        const x = (c - b) / a;
        problem = {
          question: `${a}x + ${b} = ${c}\nCari nilai x!`,
          answer: x,
          hint: "Langkah: (1) Kurangi kedua sisi dengan angka konstanta. (2) Bagi kedua sisi dengan koefisien x.",
          steps: [
            `Persamaan: ${a}x + ${b} = ${c}`,
            `Kurangi kedua sisi dengan ${b}: ${a}x = ${c} - ${b}`,
            `${a}x = ${c - b}`,
            `Bagi kedua sisi dengan ${a}: x = ${c - b} ÷ ${a}`,
            `x = ${x}`,
          ],
        };
      }
      break;

    case "8": // Modulo (Modulo)
      {
        let a, b;
        if (difficulty === "easy") {
          a = randInt(5, 20);
          b = randInt(2, 8);
        } else if (difficulty === "medium") {
          a = randInt(20, 100);
          b = randInt(8, 15);
        } else {
          a = randInt(100, 200);
          b = randInt(10, 20);
        }
        const remainder = a % b;
        problem = {
          question: `${a} mod ${b} = ?`,
          answer: remainder,
          hint: "Modulo adalah sisa dari pembagian. Bagi angka pertama dengan angka kedua, sisanya adalah jawaban.",
          steps: [
            `Cari sisa bagi dari: ${a} ÷ ${b}`,
            `${a} ÷ ${b} = ${Math.floor(a / b)} sisa ${remainder}`,
            `Jadi ${a} mod ${b} = ${remainder}`,
          ],
        };
      }
      break;

    case "9": // Trigonometri (Trigonometry)
      {
        // Soal: sin, cos, tan untuk sudut istimewa
        const angles = [
          { angle: 0, sin: "0", cos: "1", tan: "0" },
          { angle: 30, sin: "1/2", cos: "√3/2", tan: "1/√3" },
          { angle: 45, sin: "√2/2", cos: "√2/2", tan: "1" },
          { angle: 60, sin: "√3/2", cos: "1/2", tan: "√3" },
          { angle: 90, sin: "1", cos: "0", tan: "∞" },
        ];

        const trigFunctions = ["sin", "cos", "tan"];
        const selectedFunc =
          trigFunctions[randInt(0, trigFunctions.length - 1)];
        const selectedAngle = angles[randInt(0, angles.length - 1)];

        let answer;
        if (selectedFunc === "sin") {
          answer = selectedAngle.sin;
        } else if (selectedFunc === "cos") {
          answer = selectedAngle.cos;
        } else {
          answer = selectedAngle.tan;
        }

        problem = {
          question: `${selectedFunc}(${selectedAngle.angle}°) = ?`,
          answer: answer,
          hint: "Ini adalah sudut istimewa. Hafal nilai sin, cos, dan tan untuk sudut 0°, 30°, 45°, 60°, dan 90°.",
          steps: [
            `Cari nilai ${selectedFunc} untuk sudut ${selectedAngle.angle}°`,
            `Ini adalah sudut istimewa dalam trigonometri`,
            `Nilai yang dihafalkan:`,
            `${selectedFunc}(${selectedAngle.angle}°) = ${answer}`,
          ],
        };
      }
      break;

    case "10": // Kalkulus - Turunan (Calculus - Derivative)
      {
        // Soal: Turunan dari ax^n adalah n*a*x^(n-1)
        let a, n;
        if (difficulty === "easy") {
          a = randInt(1, 5);
          n = randInt(2, 4);
        } else if (difficulty === "medium") {
          a = randInt(2, 8);
          n = randInt(3, 5);
        } else {
          a = randInt(3, 10);
          n = randInt(4, 6);
        }

        const coeff = n * a;
        const power = n - 1;
        problem = {
          question: `Turunan dari f(x) = ${a}x^${n} adalah?`,
          answer: `${coeff}x^${power}`,
          hint: "Gunakan aturan pangkat: Turunkan koefisien dikalikan pangkat, lalu kurangi pangkat dengan 1.",
          steps: [
            `f(x) = ${a}x^${n}`,
            `Gunakan aturan turunan: d/dx(ax^n) = n·a·x^(n-1)`,
            `f'(x) = ${n}·${a}·x^(${n}-1)`,
            `f'(x) = ${coeff}x^${power}`,
          ],
        };
      }
      break;

    case "11": // Persamaan Linear (Linear Equation)
      {
        // Soal: ax + b = cx + d
        let a, b, c, d;
        if (difficulty === "easy") {
          a = randInt(1, 3);
          b = randInt(1, 10);
          c = randInt(1, 3);
          const x = randInt(1, 5);
          d = c * x - a * x + b;
        } else if (difficulty === "medium") {
          a = randInt(2, 5);
          b = randInt(5, 15);
          c = randInt(2, 5);
          const x = randInt(2, 10);
          d = c * x - a * x + b;
        } else {
          a = randInt(3, 8);
          b = randInt(10, 30);
          c = randInt(3, 8);
          const x = randInt(5, 15);
          d = c * x - a * x + b;
        }

        const x = (d - b) / (a - c);
        problem = {
          question: `${a}x + ${b} = ${c}x + ${d}\nCari x!`,
          answer: x,
          hint: "Langkah: (1) Kumpulkan suku x di satu sisi. (2) Kumpulkan konstanta di sisi lain. (3) Bagi untuk mendapat x.",
          steps: [
            `Persamaan: ${a}x + ${b} = ${c}x + ${d}`,
            `Pindahkan x ke satu sisi: ${a}x - ${c}x = ${d} - ${b}`,
            `${a - c}x = ${d - b}`,
            `x = ${d - b} ÷ ${a - c}`,
            `x = ${x}`,
          ],
        };
      }
      break;

    case "12": // Persamaan Kuadrat (Quadratic Equation)
      {
        // Soal: x^2 + bx + c = 0, cari x menggunakan diskriminan
        let b, c;
        let x1, x2;

        if (difficulty === "easy") {
          x1 = randInt(1, 5);
          x2 = randInt(1, 5);
          b = -(x1 + x2);
          c = x1 * x2;
        } else if (difficulty === "medium") {
          x1 = randInt(1, 10);
          x2 = randInt(1, 10);
          b = -(x1 + x2);
          c = x1 * x2;
        } else {
          x1 = randInt(5, 15);
          x2 = randInt(5, 15);
          b = -(x1 + x2);
          c = x1 * x2;
        }

        const discriminant = b * b - 4 * c;

        problem = {
          question: `x² + (${b})x + ${c} = 0\nCari x!`,
          answer: `x = ${x1} atau x = ${x2}`,
          hint: "Gunakan faktorisasi atau rumus ABC. Cari dua angka yang jika dikalikan hasilnya c dan jika dijumlahkan hasilnya b.",
          steps: [
            `Persamaan kuadrat: x² + (${b})x + ${c} = 0`,
            `Gunakan rumus ABC atau faktorisasi`,
            `Diskriminan (D) = b² - 4ac = (${b})² - 4(1)(${c})`,
            `D = ${b * b} - ${4 * c} = ${discriminant}`,
            `x = (-b ± √D) / 2a = (-${b} ± √${discriminant}) / 2`,
            `x₁ = ${x1} atau x₂ = ${x2}`,
          ],
        };
      }
      break;

    default:
      problem = {
        question: "Soal tidak ditemukan",
        answer: 0,
        steps: [],
      };
  }

  return problem;
};

export default function PracticeProblemsScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { categoryId, categoryTitle, categoryColor } = route.params;

  const [difficulty, setDifficulty] = useState("easy");
  const [currentProblem, setCurrentProblem] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [showSolution, setShowSolution] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    generateNewProblem();
  }, [difficulty]);

  const generateNewProblem = () => {
    const problem = generateProblem(categoryId, difficulty);
    setCurrentProblem(problem);
    setUserAnswer("");
    setShowSolution(false);
    setShowCorrectAnswer(false);
  };

  const checkAnswer = (userInput, correctAnswer) => {
    // Check for numeric answers
    const userNum = parseFloat(userInput);
    if (!isNaN(userNum) && typeof correctAnswer === "number") {
      return Math.abs(userNum - correctAnswer) < 0.01;
    }

    // Check for string answers (case-insensitive, ignoring spaces)
    if (typeof correctAnswer === "string") {
      const normalizeString = (str) =>
        str.toLowerCase().replace(/\s/g, "").replace(/atau/g, "|");
      return (
        normalizeString(userInput) === normalizeString(correctAnswer) ||
        normalizeString(userInput)
          .split("|")
          .some((ans) =>
            normalizeString(correctAnswer).split("|").includes(ans.trim()),
          )
      );
    }

    return false;
  };

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) {
      Alert.alert("Peringatan", "Silakan masukkan jawaban terlebih dahulu!");
      return;
    }

    const isCorrect = checkAnswer(userAnswer, currentProblem.answer);
    const newTotal = totalCount + 1;

    if (isCorrect) {
      const newCorrect = correctCount + 1;
      setCorrectCount(newCorrect);
      setTotalCount(newTotal);
      Alert.alert(
        "✓ Benar!",
        `Jawaban Anda benar! 🎉\n\nSkor: ${newCorrect}/${newTotal}`,
        [
          {
            text: "Soal Berikutnya",
            onPress: () => {
              generateNewProblem();
            },
          },
        ],
      );
    } else {
      setTotalCount(newTotal);
      Alert.alert(
        "✗ Salah",
        `Jawaban Anda salah.\n\nJawaban yang benar adalah: ${currentProblem.answer}\n\nSkor: ${correctCount}/${newTotal}`,
        [
          {
            text: "Lihat Penjelasan",
            onPress: () => setShowSolution(true),
          },
          {
            text: "Soal Berikutnya",
            onPress: () => {
              generateNewProblem();
            },
          },
        ],
      );
    }
  };

  const difficultyOptions = [
    { value: "easy", label: "Mudah" },
    { value: "medium", label: "Sedang" },
    { value: "hard", label: "Sulit" },
  ];

  return (
    <LinearGradient
      colors={["#1A2980", "#26D0CE"]}
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
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{categoryTitle}</Text>
          {totalCount > 0 && (
            <Text style={styles.scoreText}>
              Benar: {correctCount} / {totalCount}
            </Text>
          )}
        </View>
        <View style={{ width: 40 }} />
      </View>

      {/* Difficulty Selector */}
      <View style={styles.difficultyContainer}>
        <Text style={styles.difficultyLabel}>Tingkat Kesulitan:</Text>
        <SegmentedButtons
          value={difficulty}
          onValueChange={setDifficulty}
          buttons={difficultyOptions}
          style={styles.segmentedButtons}
        />
      </View>

      {/* Content */}
      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {currentProblem && (
          <>
            {/* Problem Card */}
            <Card style={styles.problemCard}>
              <Card.Content style={styles.problemContent}>
                <Text style={styles.problemQuestion}>
                  {currentProblem.question}
                </Text>
              </Card.Content>
            </Card>

            {/* Hint Card */}
            {currentProblem.hint && (
              <Card style={styles.hintCard}>
                <Card.Content style={styles.hintContent}>
                  <View style={styles.hintRow}>
                    <MaterialCommunityIcons
                      name="lightbulb-on"
                      size={20}
                      color="#FF9800"
                      style={styles.hintIcon}
                    />
                    <Text style={styles.hintText}>{currentProblem.hint}</Text>
                  </View>
                </Card.Content>
              </Card>
            )}

            {/* Answer Input */}
            <Card style={styles.answerCard}>
              <Card.Content style={styles.answerContent}>
                <Text style={styles.answerLabel}>Jawaban Anda:</Text>
                {["9", "10", "12"].includes(categoryId) ? (
                  // Text Input untuk soal string (Trigonometri, Kalkulus, Persamaan Kuadrat)
                  <TextInput
                    style={styles.textInput}
                    placeholder="Masukkan jawaban (contoh: 1/2, √3, x=5, dll)"
                    placeholderTextColor="#999"
                    value={userAnswer}
                    onChangeText={setUserAnswer}
                    multiline={true}
                  />
                ) : (
                  // Numeric Input untuk soal angka
                  <>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputPlaceholder}>= </Text>
                      <View style={styles.inputBox}>
                        <Text style={styles.inputText}>
                          {userAnswer || "0"}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.numberPad}>
                      {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map(
                        (num) => (
                          <TouchableOpacity
                            key={num}
                            style={styles.numButton}
                            onPress={() => setUserAnswer(userAnswer + num)}
                          >
                            <Text style={styles.numText}>{num}</Text>
                          </TouchableOpacity>
                        ),
                      )}
                      <TouchableOpacity
                        style={[styles.numButton, styles.zeroButton]}
                        onPress={() => setUserAnswer(userAnswer + "0")}
                      >
                        <Text style={styles.numText}>0</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.numButton, styles.dotButton]}
                        onPress={() => {
                          if (!userAnswer.includes(".")) {
                            setUserAnswer(userAnswer + ".");
                          }
                        }}
                      >
                        <Text style={styles.numText}>.</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.numButton, styles.deleteButton]}
                        onPress={() => setUserAnswer(userAnswer.slice(0, -1))}
                      >
                        <MaterialCommunityIcons
                          name="backspace"
                          size={20}
                          color="#FFF"
                        />
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </Card.Content>
            </Card>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleSubmitAnswer}
                style={styles.submitButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
              >
                Periksa Jawaban
              </Button>
              <Button
                mode="outlined"
                onPress={generateNewProblem}
                style={styles.skipButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.skipLabel}
              >
                Lewati
              </Button>
            </View>

            {/* Show Answer Button */}
            <Button
              mode="outlined"
              onPress={() => setShowCorrectAnswer(!showCorrectAnswer)}
              style={styles.showAnswerButton}
              contentStyle={styles.buttonContent}
              labelStyle={styles.showAnswerLabel}
              icon={showCorrectAnswer ? "chevron-up" : "chevron-down"}
            >
              {showCorrectAnswer ? "Sembunyikan Jawaban" : "Tampilkan Jawaban"}
            </Button>

            {/* Correct Answer Card */}
            {showCorrectAnswer && (
              <Card style={styles.correctAnswerCard}>
                <Card.Content style={styles.correctAnswerContent}>
                  <View style={styles.correctAnswerRow}>
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={24}
                      color="#4CAF50"
                      style={styles.correctIcon}
                    />
                    <View style={styles.correctAnswerText}>
                      <Text style={styles.correctAnswerLabel}>
                        Jawaban yang benar:
                      </Text>
                      <Text style={styles.correctAnswer}>
                        {currentProblem.answer}
                      </Text>
                    </View>
                  </View>
                </Card.Content>
              </Card>
            )}

            {/* Solution */}
            {showSolution && (
              <Card style={styles.solutionCard}>
                <Card.Content>
                  <Text style={styles.solutionTitle}>Cara Penyelesaian:</Text>
                  {currentProblem.steps.map((step, index) => (
                    <View key={index} style={styles.stepContainer}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>{index + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                </Card.Content>
              </Card>
            )}
          </>
        )}
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
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  headerInfo: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFF",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  scoreText: {
    fontSize: 12,
    color: "#FFD700",
    marginTop: 4,
    fontWeight: "bold",
  },
  difficultyContainer: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  difficultyLabel: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
  },
  segmentedButtons: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    paddingBottom: 30,
  },
  problemCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 15,
    elevation: 4,
    marginBottom: 15,
  },
  problemContent: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
  },
  problemQuestion: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1A2980",
    textAlign: "center",
  },
  answerCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 15,
    elevation: 4,
    marginBottom: 15,
  },
  answerContent: {
    paddingVertical: 15,
  },
  answerLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: "#F5F5F5",
    borderWidth: 2,
    borderColor: "#1A2980",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: "#333",
    marginBottom: 15,
    minHeight: 80,
    textAlignVertical: "top",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  inputPlaceholder: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginRight: 8,
  },
  inputBox: {
    flex: 1,
    borderBottomWidth: 3,
    borderBottomColor: "#1A2980",
    paddingVertical: 8,
  },
  inputText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A2980",
  },
  numberPad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  numButton: {
    width: "31%",
    paddingVertical: 12,
    backgroundColor: "#1A2980",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  zeroButton: {
    width: "31%",
  },
  dotButton: {
    backgroundColor: "#26D0CE",
  },
  deleteButton: {
    backgroundColor: "#FF6B6B",
  },
  numText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFF",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 15,
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#1A2980",
    borderRadius: 12,
    elevation: 3,
  },
  skipButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#FFF",
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 10,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: "bold",
  },
  skipLabel: {
    color: "#FFF",
  },
  solutionCard: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 15,
    elevation: 4,
    borderLeftWidth: 5,
    borderLeftColor: "#FFD93D",
  },
  solutionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1A2980",
    marginBottom: 12,
  },
  stepContainer: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "flex-start",
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFD93D",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    marginTop: 2,
  },
  stepNumberText: {
    fontWeight: "bold",
    color: "#1A2980",
    fontSize: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    color: "#333",
    lineHeight: 20,
  },
  hintCard: {
    backgroundColor: "rgba(255, 152, 0, 0.1)",
    borderRadius: 12,
    elevation: 2,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
  },
  hintContent: {
    paddingVertical: 12,
  },
  hintRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  hintIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  hintText: {
    flex: 1,
    fontSize: 13,
    color: "#E65100",
    lineHeight: 20,
    fontWeight: "500",
  },
  showAnswerButton: {
    borderRadius: 12,
    borderColor: "#26D0CE",
    borderWidth: 2,
    marginBottom: 15,
  },
  showAnswerLabel: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "600",
  },
  correctAnswerCard: {
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    borderRadius: 12,
    elevation: 3,
    marginBottom: 15,
    borderLeftWidth: 5,
    borderLeftColor: "#4CAF50",
  },
  correctAnswerContent: {
    paddingVertical: 15,
  },
  correctAnswerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  correctIcon: {
    marginRight: 12,
  },
  correctAnswerText: {
    flex: 1,
  },
  correctAnswerLabel: {
    fontSize: 12,
    color: "#2E7D32",
    fontWeight: "600",
    marginBottom: 4,
  },
  correctAnswer: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1B5E20",
  },
});
