export const generateOptions = (correctAnswer, variance, isString = false) => {
  const options = new Set();
  options.add(isString ? correctAnswer : correctAnswer.toString());

  while(options.size < 4) {
    let wrongAnswer;
    
    if (isString) {
       // specific for special fractions or strings like trigs
       const fallbackTrigs = ['0', '1', '-1', '1/2', '1/2 √2', '1/2 √3', '√3', 'Tak Terhingga'];
       wrongAnswer = fallbackTrigs[Math.floor(Math.random() * fallbackTrigs.length)];
       options.add(wrongAnswer);
    } else {
       const offset = Math.floor(Math.random() * variance * 2) - variance;
       if (offset === 0) continue;
       wrongAnswer = correctAnswer + offset;
       options.add(wrongAnswer.toString());
    }
  }

  // Shuffle options
  return Array.from(options).sort(() => Math.random() - 0.5);
};

export const generateMathProblem = (levelId) => {
  let q = '';
  let answer = 0;
  let options = [];
  let isStringOption = false;

  const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  switch(levelId.toString()) {
    case '1': // Arithmetic (Addition, Subtraction)
    {
      const isAdd = Math.random() > 0.5;
      let a = randInt(1, 100);
      let b = randInt(1, 100);
      if (isAdd) {
        answer = a + b;
        q = `${a} + ${b} = ?`;
      } else {
        if (b > a) [a, b] = [b, a]; // keep positive
        answer = a - b;
        q = `${a} - ${b} = ?`;
      }
      options = generateOptions(answer, 15);
      break;
    }

    case '2': // Multiplication & Division
    {
      const isMult = Math.random() > 0.5;
      if (isMult) {
        let a = randInt(2, 15);
        let b = randInt(2, 15);
        answer = a * b;
        q = `${a} × ${b} = ?`;
      } else {
        let b = randInt(2, 12);
        let ans = randInt(2, 15);
        let a = b * ans;
        answer = ans;
        q = `${a} ÷ ${b} = ?`;
      }
      options = generateOptions(answer, 10);
      break;
    }

    case '3': // Pangkat & Akar
    {
      const type = randInt(1, 3);
      if (type === 1) { // square
         let a = randInt(2, 20);
         answer = a * a;
         q = `${a}² = ?`;
         options = generateOptions(answer, 20);
      } else if (type === 2) { // sqrt
         let ans = randInt(2, 20);
         let a = ans * ans;
         answer = ans;
         q = `√${a} = ?`;
         options = generateOptions(answer, 5);
      } else { // cube
         let a = randInt(2, 10);
         answer = a * a * a;
         q = `${a}³ = ?`;
         options = generateOptions(answer, 50);
      }
      break;
    }

    case '4': // Aljabar Level 1 (ax + b = c)
    {
      let isAdd = Math.random() > 0.5;
      let x = randInt(1, 20);
      let a = randInt(2, 10);
      let b = randInt(1, 30);
      let c;
      if (isAdd) {
        c = (a * x) + b;
        q = `Jika ${a}x + ${b} = ${c}, maka x = ?`;
      } else {
        c = (a * x) - b;
        q = `Jika ${a}x - ${b} = ${c}, maka x = ?`;
      }
      answer = x;
      options = generateOptions(answer, 5);
      break;
    }

    case '5': // Deret Angka
    {
      let isArithmetic = Math.random() > 0.5;
      if (isArithmetic) {
         let start = randInt(1, 20);
         let step = randInt(2, 10);
         let seq = [start, start + step, start + 2*step, start + 3*step];
         answer = start + 4*step;
         q = `Angka selanjutnya: ${seq.join(', ')}, ...?`;
         options = generateOptions(answer, step * 2);
      } else {
         let start = randInt(1, 5);
         let mult = randInt(2, 4);
         let seq = [start, start * mult, start * mult * mult, start * Math.pow(mult, 3)];
         answer = start * Math.pow(mult, 4);
         q = `Angka selanjutnya: ${seq.join(', ')}, ...?`;
         options = generateOptions(answer, answer * 0.5);
      }
      break;
    }

    case '6': // Aljabar Level 2 (ax + b = cx + d)
    {
      // ax - cx = d - b => x(a-c) = d-b
      let x = randInt(1, 15);
      let a = randInt(5, 15);
      let c = randInt(1, a - 1);
      let isBPositive = Math.random() > 0.5;
      let b = randInt(1, 20) * (isBPositive ? 1 : -1);
      
      // ax + b = cx + d => d = ax + b - cx
      let d = (a * x) + b - (c * x);
      
      let signB = b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`;
      let signD = d >= 0 ? `+ ${d}` : `- ${Math.abs(d)}`;
      
      q = `Jika ${a}x ${signB} = ${c}x ${signD}, berapakah x?`;
      answer = x;
      options = generateOptions(answer, 6);
      break;
    }

    case '7': // Modulo
    {
      let b = randInt(3, 15);
      let multiplier = randInt(2, 10);
      let rem = randInt(1, b - 1);
      let a = (b * multiplier) + rem;
      answer = rem;
      q = `Berapa sisa bagi (modulus) dari ${a} mod ${b}?`;
      options = generateOptions(answer, 3);
      break;
    }

    case '8': // Aritmatika Pecahan (A/B * C)
    {
      // Ensures integer result
      let denom = randInt(2, 10);
      let num = randInt(1, denom - 1);
      let multiplier = randInt(2, 12);
      let C = denom * multiplier;
      answer = num * multiplier; // (num/denom) * C
      q = `Berapa hasil dari (${num}/${denom}) × ${C}?`;
      options = generateOptions(answer, 10);
      break;
    }

    case '9': // Trigonometri Dasar
    {
      isStringOption = true;
      const trigs = [
        { func: 'sin', angle: '0°', val: '0' },
        { func: 'sin', angle: '30°', val: '1/2' },
        { func: 'sin', angle: '45°', val: '1/2 √2' },
        { func: 'sin', angle: '60°', val: '1/2 √3' },
        { func: 'sin', angle: '90°', val: '1' },
        { func: 'cos', angle: '0°', val: '1' },
        { func: 'cos', angle: '30°', val: '1/2 √3' },
        { func: 'cos', angle: '45°', val: '1/2 √2' },
        { func: 'cos', angle: '60°', val: '1/2' },
        { func: 'cos', angle: '90°', val: '0' }
      ];
      const selected = trigs[Math.floor(Math.random() * trigs.length)];
      q = `Nilai dari ${selected.func}(${selected.angle}) adalah?`;
      options = generateOptions(selected.val, 0, true);
      answer = selected.val;
      break;
    }

    case '10': // Limit & Turunan
    {
       const type = Math.random() > 0.5 ? 'derivative' : 'limit';
      
       if (type === 'derivative') {
         // f(x) = ax^n + bx. f'(val) = ?
         let coeffA = randInt(2, 6);
         let power = randInt(2, 4);
         let coeffB = randInt(1, 10);
         let val = randInt(1, 3);
         
         // f'(x) = a*n x^(n-1) + b
         answer = (coeffA * power * Math.pow(val, power - 1)) + coeffB;
         q = `f(x) = ${coeffA}x^${power} + ${coeffB}x. f'(${val}) = ?`;
         options = generateOptions(answer, 15);
       } else {
         // limit x->inf (ax^n + ..) / (bx^n + ..)
         let a = randInt(2, 10);
         let b = randInt(2, 10);
         // if numerator and denominator degree is same, limit is a/b
         // Let's make it so a/b is integer
         let ans = randInt(2, 8);
         a = b * ans;
         
         q = `Limit x->∞ dari (${a}x² - 5x) / (${b}x² + 2) = ?`;
         answer = ans;
         options = generateOptions(answer, 5);
       }
       break;
    }
      
    default:
      q = '1 + 1 = ?';
      answer = 2;
      options = ['1', '2', '3', '4'];
  }

  return { q, options, answer: isStringOption ? answer : answer.toString() };
};
