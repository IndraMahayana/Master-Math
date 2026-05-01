export const generateOptions = (correctAnswer, variance, isString = false) => {
  const options = new Set();
  options.add(isString ? String(correctAnswer) : String(correctAnswer));

  // Fungsi helper untuk generate opsi salah yang masuk akal
  let attempt = 0;
  while(options.size < 4 && attempt < 50) {
    attempt++;
    let wrongAnswer;
    
    if (isString) {
       // Coba cari angka dalam string dan ubah sedikit
       const match = String(correctAnswer).match(/[-+]?[0-9]*\.?[0-9]+/);
       if (match) {
         let num = parseFloat(match[0]);
         let newNum = num + Math.floor(Math.random() * variance * 2) - variance;
         if (newNum === num) newNum += (Math.random() > 0.5 ? 1 : -1);
         wrongAnswer = String(correctAnswer).replace(match[0], newNum.toString());
       } else {
         const fallbackStrings = ['Kuadran I', 'Kuadran II', 'Kuadran III', 'Kuadran IV', 'Sumbu X', 'Sumbu Y', 'Nol', 'Tak Terhingga', 'Persegi', 'Segitiga', 'Lingkaran', 'Kubus', 'Balok', 'Kerucut', 'Tabung'];
         wrongAnswer = fallbackStrings[Math.floor(Math.random() * fallbackStrings.length)];
       }
       options.add(wrongAnswer);
    } else {
       const numAnswer = Number(correctAnswer);
       if (isNaN(numAnswer)) {
           // Fallback if somehow it's NaN
           options.add(String(Math.floor(Math.random() * 100)));
           continue;
       }
       let offset = Math.floor(Math.random() * variance * 2) - variance;
       // Jika jawaban bentuk desimal, berikan offset desimal
       if (numAnswer % 1 !== 0) {
         offset = (Math.random() * variance * 2 - variance).toFixed(1);
         offset = parseFloat(offset);
       }
       if (offset === 0) offset = 1;
       
       wrongAnswer = numAnswer + offset;
       // Untuk desimal, hindari terlalu banyak angka di belakang koma
       if (wrongAnswer % 1 !== 0) {
           wrongAnswer = Number(wrongAnswer.toFixed(2));
       }
       options.add(String(wrongAnswer));
    }
  }

  // Jika masih belum 4 (karena mentok), tambahkan random number
  let fallbackCount = 1;
  while(options.size < 4) {
      options.add(String(fallbackCount++));
  }

  return Array.from(options).sort(() => Math.random() - 0.5);
};

export const generateMathProblem = (levelId, questionNumber = null) => {
  let q = '';
  let answer = 0;
  let options = [];
  let isStringOption = false;
  let variance = 10;
  let difficulty = 'Easy';
  let isTrap = false;

  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const randChoice = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  const lcm = (a, b) => (a * b) / gcd(a, b);

  let level = parseInt(levelId, 10);

  // Mode 20 Soal Logic
  if (questionNumber !== null) {
    if (questionNumber === 20) {
      // Final Boss Narrative Question
      let nQ = ''; let nAns = 0; let varc = 10;
      if (level <= 15) { // Fase 1
        let a = randInt(15, 40); let c = randInt(3, 6); let b = randInt(5, 12);
        nQ = `Budi memiliki ${a} buah apel. Ia membagikannya sama rata kepada ${c} temannya. Jika Budi memakan sisa apel yang tidak terbagi ditambah ${b} apel baru yang baru dibeli, berapa apel yang dimakan Budi?`;
        nAns = (a % c) + b; varc = 5;
      } else if (level <= 30) { // Fase 2
        let x = randInt(2, 5); let y = randInt(4, 8); let hargaBuku = randInt(3, 8) * 1000; let hargaPensil = 2000;
        nQ = `Sebuah toko menjual buku dan pensil. Harga ${x} buku dan 1 pensil adalah ${x * hargaBuku + hargaPensil}. Jika harga 1 pensil tetap 2000, berapa total uang yang harus dibayar untuk ${y} buku?`;
        nAns = y * hargaBuku; varc = 2000;
      } else { // Fase 3
        let s = randInt(5, 12);
        nQ = `Paman memiliki kebun berbentuk persegi panjang dengan panjang ${s+4} meter dan lebar ${s} meter. Dia ingin memagari kebun tersebut dengan kawat sebanyak 3 putaran. Berapa meter total kawat yang dibutuhkan?`;
        nAns = 2 * ((s+4) + s) * 3; varc = 15;
      }
      return { q: nQ, options: generateOptions(nAns, varc, false), answer: String(nAns), difficulty: 'Hard', isTrap: false };
    }
    
    // Scaling Difficulty for 1-19
    if (questionNumber <= 7) difficulty = 'Easy';
    else if (questionNumber <= 14) difficulty = 'Medium';
    else difficulty = 'Hard';
    
  } else {
    // Anti-Boredom System (Sudden Death / Lives mode)
    isTrap = Math.random() < 0.1;
    if (isTrap) {
      level = Math.min(45, level + randInt(2, 5));
      difficulty = 'Hard';
    } else if (Math.random() < 0.3) {
      difficulty = 'Medium';
    }
  }

  switch(level) {
    // ==========================================
    // FASE 1: ARITMATIKA & DASAR (Level 1 - 15)
    // ==========================================
    case 1: // Penjumlahan
      {
        let a = randInt(1, 100);
        let b = randInt(1, 100);
        answer = a + b;
        q = `${a} + ${b} = ?`;
        variance = 15;
        break;
      }
    case 2: // Pengurangan
      {
        let a = randInt(20, 150);
        let b = randInt(1, a);
        answer = a - b;
        q = `${a} - ${b} = ?`;
        variance = 15;
        break;
      }
    case 3: // Perkalian
      {
        let a = randInt(2, 20);
        let b = randInt(2, 20);
        answer = a * b;
        q = `${a} × ${b} = ?`;
        variance = 20;
        break;
      }
    case 4: // Pembagian
      {
        let b = randInt(2, 15);
        let ans = randInt(2, 20);
        let a = b * ans;
        answer = ans;
        q = `${a} ÷ ${b} = ?`;
        variance = 5;
        break;
      }
    case 5: // Operasi campuran
      {
        let a = randInt(2, 10);
        let b = randInt(2, 10);
        let c = randInt(2, 10);
        answer = a + (b * c);
        q = `${a} + ${b} × ${c} = ?`;
        variance = 10;
        break;
      }
    case 6: // Pecahan (Penjumlahan penyebut sama/beda gampang)
      {
        isStringOption = true;
        let denom = randChoice([2, 3, 4, 5]);
        let num1 = randInt(1, 5);
        let num2 = randInt(1, 5);
        answer = `${num1 + num2}/${denom}`;
        q = `${num1}/${denom} + ${num2}/${denom} = ?`;
        variance = 3;
        break;
      }
    case 7: // Desimal
      {
        let a = (randInt(10, 99) / 10);
        let b = (randInt(10, 99) / 10);
        answer = Number((a + b).toFixed(1));
        q = `${a} + ${b} = ?`;
        variance = 2;
        break;
      }
    case 8: // Persen
      {
        let p = randChoice([10, 20, 25, 50, 75]);
        let val = randInt(2, 20) * 10;
        answer = (p / 100) * val;
        q = `${p}% dari ${val} = ?`;
        variance = 10;
        break;
      }
    case 9: // Rasio & Proporsi
      {
        let a = randInt(2, 5);
        let b = randInt(6, 10);
        let multiplier = randInt(2, 5);
        let c = a * multiplier;
        answer = b * multiplier;
        q = `Jika ${a}:${b} = ${c}:x, nilai x?`;
        variance = 5;
        break;
      }
    case 10: // Perbandingan
      {
        isStringOption = true;
        let a = randInt(1, 10);
        let b = randInt(11, 20);
        q = `Mana yang lebih besar, ${a} atau ${b}?`;
        answer = String(b);
        options = [String(a), String(b), "Sama", "Tidak tahu"];
        break;
      }
    case 11: // Pembulatan
      {
        let a = (randInt(11, 99) / 10);
        answer = Math.round(a);
        q = `Bulatkan ${a} ke satuan terdekat!`;
        variance = 2;
        break;
      }
    case 12: // Estimasi cepat
      {
        let a = randChoice([98, 99, 101, 102]);
        let b = randChoice([9, 11, 19, 21]);
        answer = Math.round(a / 10) * 10 * Math.round(b / 10) * 10;
        if (answer === 0) answer = 1000; // fallback
        q = `Estimasi terdekat dari ${a} × ${b}?`;
        options = [String(answer), String(answer + 1000), String(answer - 500), String(answer + 500)];
        isStringOption = true; // since we fully define options
        break;
      }
    case 13: // Faktor & kelipatan
      {
        isStringOption = true;
        let a = randChoice([12, 15, 18, 20]);
        let ansObj = { 12: "1,2,3,4,6,12", 15: "1,3,5,15", 18: "1,2,3,6,9,18", 20: "1,2,4,5,10,20" };
        answer = ansObj[a];
        q = `Sebutkan faktor dari ${a}!`;
        options = [answer, "1,2,4,8", "1,3,9", "1,5,10,20"].sort(() => Math.random() - 0.5);
        break;
      }
    case 14: // FPB & KPK
      {
        let type = randChoice(['FPB', 'KPK']);
        let a = randChoice([4, 6, 8, 12]);
        let b = randChoice([6, 9, 10, 15]);
        if (type === 'FPB') {
            answer = gcd(a, b);
        } else {
            answer = lcm(a, b);
        }
        q = `${type} dari ${a} dan ${b}?`;
        variance = 5;
        break;
      }
    case 15: // BOSS Aritmatika (Campuran + Multi-step)
      {
        let a = randInt(2, 10);
        let b = randInt(2, 10);
        let c = randInt(2, 5);
        let d = randInt(10, 50);
        answer = (a + b) * c - d;
        q = `BOSS: Hasil dari (${a} + ${b}) × ${c} - ${d} = ?`;
        variance = 15;
        difficulty = 'Hard';
        break;
      }

    // ==========================================
    // FASE 2: ALJABAR (Level 16 - 30)
    // ==========================================
    case 16: // Variabel
      {
        let a = randInt(2, 5);
        let ans = randInt(2, 10);
        let c = a * ans;
        answer = ans;
        q = `Jika ${a}x = ${c}, berapakah x?`;
        variance = 4;
        break;
      }
    case 17: // Persamaan linear
      {
        let a = randInt(2, 5);
        let b = randInt(1, 10);
        let ans = randInt(1, 10);
        let c = (a * ans) + b;
        answer = ans;
        q = `Selesaikan: ${a}x + ${b} = ${c}`;
        variance = 4;
        break;
      }
    case 18: // Pertidaksamaan
      {
        isStringOption = true;
        let a = randInt(2, 5);
        let c = a * randInt(2, 6);
        answer = `x > ${c/a}`;
        q = `Selesaikan: ${a}x > ${c}`;
        options = [`x > ${c/a}`, `x < ${c/a}`, `x > ${c/a + 1}`, `x < ${c/a - 1}`];
        break;
      }
    case 19: // Sistem persamaan
      {
        isStringOption = true;
        let x = randInt(1, 5);
        let y = randInt(1, 5);
        let c1 = x + y;
        let c2 = x - y;
        answer = `x=${x}, y=${y}`;
        q = `x+y=${c1} dan x-y=${c2}. Nilai x,y?`;
        options = [answer, `x=${y}, y=${x}`, `x=${x+1}, y=${y-1}`, `x=${x-1}, y=${y+1}`];
        break;
      }
    case 20: // Aljabar ekspresi
      {
        isStringOption = true;
        let a = randInt(2, 5);
        let b = randInt(2, 5);
        answer = `${a+b}x`;
        q = `Sederhanakan: ${a}x + ${b}x`;
        options = [`${a+b}x`, `${a+b}x^2`, `${a*b}x`, `${a}x+${b}`];
        break;
      }
    case 21: // Faktorisasi
      {
        isStringOption = true;
        let a = randInt(2, 5);
        answer = `(x-${a})(x+${a})`;
        q = `Faktorisasi dari x² - ${a*a}?`;
        options = [answer, `(x-${a})(x-${a})`, `(x+${a})(x+${a})`, `x(x-${a})`];
        break;
      }
    case 22: // Kuadrat
      {
        let a = randInt(2, 9);
        answer = a;
        q = `Akar kuadrat positif dari ${a*a} adalah?`;
        variance = 3;
        break;
      }
    case 23: // Fungsi
      {
        let a = randInt(2, 4);
        let b = randInt(1, 5);
        let x = randInt(2, 5);
        answer = a*x + b;
        q = `Jika f(x) = ${a}x + ${b}, maka f(${x}) = ?`;
        variance = 5;
        break;
      }
    case 24: // Fungsi linear (Gradien)
      {
        let m = randInt(2, 6);
        let c = randInt(1, 10);
        answer = m;
        q = `Berapa gradien garis y = ${m}x + ${c}?`;
        variance = 3;
        break;
      }
    case 25: // Fungsi kuadrat (Sumbu simetri)
      {
        let a = 1;
        let b = randChoice([2, 4, 6, 8]);
        let c = randInt(1, 10);
        answer = -b / (2*a);
        q = `Sumbu simetri y = x² + ${b}x + ${c}?`;
        variance = 3;
        break;
      }
    case 26: // Polinomial (Derajat)
      {
        let d = randInt(3, 6);
        answer = d;
        q = `Derajat tertinggi dari x^${d} + 2x² - 5?`;
        variance = 2;
        break;
      }
    case 27: // Substitusi
      {
        let val = randInt(2, 5);
        let a = randInt(2, 4);
        answer = a * val;
        q = `Jika y = ${a}x dan x = ${val}, y = ?`;
        variance = 5;
        break;
      }
    case 28: // Eliminasi (Mirip SPLDV)
      {
        let y = randInt(1, 4);
        answer = y;
        q = `Jika x+y=5 dan x-y=1, nilai y?`; // fixed question, y=2
        if (answer !== 2) { // just to make it dynamic
             let newX = randInt(2,5);
             let newY = randInt(1,newX-1);
             q = `Jika x+y=${newX+newY} dan x-y=${newX-newY}, nilai y?`;
             answer = newY;
        }
        variance = 3;
        break;
      }
    case 29: // Grafik fungsi
      {
        let c = randInt(3, 10);
        answer = c;
        q = `Titik potong sumbu-y dari y = 2x + ${c}?`;
        variance = 4;
        break;
      }
    case 30: // BOSS Aljabar (Campuran + Multi-step)
      {
        let x = randInt(2, 6);
        let y = randInt(1, x - 1);
        let c1 = 2 * x + y;
        let c2 = x - y;
        answer = x * y;
        q = `BOSS: Jika 2x+y=${c1} & x-y=${c2}, nilai x × y?`;
        variance = 10;
        difficulty = 'Hard';
        break;
      }

    // ==========================================
    // FASE 3: GEOMETRI (Level 31 - 45)
    // ==========================================
    case 31: // Bangun datar
      {
        isStringOption = true;
        answer = "Segitiga";
        q = `Bangun datar yang memiliki 3 sisi?`;
        options = ["Segitiga", "Persegi", "Lingkaran", "Trapesium"];
        break;
      }
    case 32: // Keliling & Luas
      {
        let s = randInt(4, 10);
        answer = s * s;
        q = `Luas persegi dengan sisi ${s}?`;
        variance = 10;
        break;
      }
    case 33: // Bangun ruang
      {
        isStringOption = true;
        answer = "Kubus";
        q = `Bangun ruang dengan 6 sisi persegi yang sama?`;
        options = ["Kubus", "Balok", "Tabung", "Kerucut"];
        break;
      }
    case 34: // Volume
      {
        let s = randInt(2, 6);
        answer = s * s * s;
        q = `Volume kubus dengan rusuk ${s}?`;
        variance = 15;
        break;
      }
    case 35: // Sudut
      {
        let a = randChoice([30, 45, 60, 90, 120]);
        answer = 180 - a;
        q = `Pelurus dari sudut ${a}° adalah?`;
        variance = 20;
        break;
      }
    case 36: // Segitiga
      {
        let a = randChoice([4, 6, 8, 10]);
        let t = randChoice([3, 5, 7, 9]);
        answer = 0.5 * a * t;
        q = `Luas segitiga alas ${a} & tinggi ${t}?`;
        variance = 10;
        break;
      }
    case 37: // Lingkaran (Hanya koefisien pi)
      {
        isStringOption = true;
        let r = randInt(2, 7);
        answer = `${r*r}π`;
        q = `Luas lingkaran berjari-jari ${r}?`;
        options = [answer, `${2*r}π`, `${r*r*2}π`, `${r}π`];
        break;
      }
    case 38: // Teorema Pythagoras
      {
        let trips = [[3,4,5], [6,8,10], [5,12,13], [9,12,15]];
        let trip = randChoice(trips);
        answer = trip[2];
        q = `Sisi miring segitiga siku-siku alas ${trip[0]}, tinggi ${trip[1]}?`;
        variance = 3;
        break;
      }
    case 39: // Transformasi geometri (Pencerminan sumbu X)
      {
        isStringOption = true;
        let x = randInt(2, 5);
        let y = randInt(2, 5);
        answer = `(${x}, ${-y})`;
        q = `Pencerminan titik (${x}, ${y}) thd Sumbu X?`;
        options = [answer, `(${-x}, ${y})`, `(${-x}, ${-y})`, `(${y}, ${x})`];
        break;
      }
    case 40: // Simetri
      {
        answer = 4;
        q = `Berapa banyak sumbu simetri lipat pada persegi?`;
        variance = 2;
        break;
      }
    case 41: // Koordinat kartesius
      {
        isStringOption = true;
        let x = randInt(1, 5);
        let y = randInt(1, 5);
        answer = "Kuadran I";
        q = `Titik (${x}, ${y}) berada di kuadran?`;
        options = ["Kuadran I", "Kuadran II", "Kuadran III", "Kuadran IV"];
        break;
      }
    case 42: // Jarak titik
      {
        let trips = [[3,4,5], [6,8,10]];
        let trip = randChoice(trips);
        answer = trip[2];
        q = `Jarak titik (0,0) ke (${trip[0]}, ${trip[1]})?`;
        variance = 3;
        break;
      }
    case 43: // Garis & gradien
      {
        let y2 = randInt(5, 10);
        let y1 = randInt(1, 4);
        let x2 = randInt(3, 6);
        let x1 = 1;
        // make sure (x2-x1) divides (y2-y1) for simplicity
        let m = randInt(1, 3);
        x2 = x1 + randInt(1, 3);
        y2 = y1 + (m * (x2 - x1));
        
        answer = m;
        q = `Gradien garis lurus dari (${x1},${y1}) ke (${x2},${y2})?`;
        variance = 3;
        break;
      }
    case 44: // Vektor dasar
      {
        let trips = [[3,4,5], [6,8,10]];
        let trip = randChoice(trips);
        answer = trip[2];
        q = `Panjang vektor v = (${trip[0]}, ${trip[1]})?`;
        variance = 4;
        break;
      }
    case 45: // BOSS Geometri (Campuran + Multi-step)
      {
        isStringOption = true;
        let s = randChoice([4, 6, 8, 10]);
        let luas = s * s;
        // Jari-jari lingkaran = sisi persegi. Luas lingkaran = pi * r^2
        answer = `${s*s}π`;
        q = `BOSS: Luas persegi=${luas}. Luas lingkaran jika r=sisi persegi?`;
        options = [answer, `${2*s}π`, `${(s/2)*(s/2)}π`, `${s}π`];
        difficulty = 'Hard';
        break;
      }

    default: // Fallback if level is missing or out of bounds
      {
        let a = randInt(1, 10);
        let b = randInt(1, 10);
        answer = a + b;
        q = `${a} + ${b} = ?`;
        variance = 5;
      }
  }

  // Jika opsi belum ditentukan secara kustom (isStringOption dengan custom options)
  if (!options || options.length === 0) {
      options = generateOptions(answer, variance, isStringOption);
  }

  return { q, options, answer: isStringOption ? String(answer) : String(answer), difficulty, isTrap };
};
