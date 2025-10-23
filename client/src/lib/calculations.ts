import moment from 'moment-hijri';

export function calculateAge(birthDate: string) {
  const birth = new Date(birthDate);
  const today = new Date();
  
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  const totalDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));

  return { years, months, days, totalDays };
}

export function convertDate(date: string, type: string) {
  const m = moment(date);
  
  if (type === 'gregorian-to-hijri') {
    const hijriDate = m.format('iYYYY/iM/iD');
    const hijriMonthName = m.format('iMMMM');
    const hijriYear = m.format('iYYYY');
    
    return {
      convertedDate: `التاريخ الهجري: ${hijriDate}`,
      monthName: hijriMonthName,
      year: hijriYear,
      fullDate: `${m.format('iD')} ${hijriMonthName} ${hijriYear} هـ`
    };
  } else {
    // Hijri to Gregorian
    const hijriMoment = moment(date, 'iYYYY/iM/iD');
    const gregorianDate = hijriMoment.format('YYYY/M/D');
    
    return {
      convertedDate: `التاريخ الميلادي: ${gregorianDate}`,
      fullDate: hijriMoment.format('D MMMM YYYY') + ' م'
    };
  }
}

export function calculateBMI(weight: number, height: number) {
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  
  let category = '';
  let colorClass = '';
  if (bmi < 18.5) {
    category = 'نقص في الوزن';
    colorClass = 'text-blue-600';
  } else if (bmi < 25) {
    category = 'وزن طبيعي';
    colorClass = 'text-green-600';
  } else if (bmi < 30) {
    category = 'زيادة في الوزن';
    colorClass = 'text-yellow-600';
  } else {
    category = 'سمنة';
    colorClass = 'text-red-600';
  }

  return {
    bmi: bmi.toFixed(1),
    category,
    colorClass
  };
}

export function calculatePercentage(number: number, total: number) {
  const percentage = (number / total) * 100;
  return {
    percentage: percentage.toFixed(2),
    calculation: `${number} من ${total} = ${percentage.toFixed(2)}%`
  };
}

export function generateRandomNumber(min: number, max: number) {
  const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
  return {
    number: randomNum,
    min,
    max
  };
}

export function calculateDateDifference(date1: string, date2: string) {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const timeDifference = Math.abs(d2.getTime() - d1.getTime());
  const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
  
  const weeks = Math.floor(daysDifference / 7);
  const remainingDays = daysDifference % 7;
  const months = Math.floor(daysDifference / 30);
  const years = Math.floor(daysDifference / 365);

  return {
    days: daysDifference,
    weeks,
    remainingDays,
    months,
    years
  };
}

export function calculateTax(basePrice: number, taxRate: number) {
  const taxAmount = (basePrice * taxRate) / 100;
  const totalPrice = basePrice + taxAmount;

  return {
    basePrice: basePrice.toFixed(2),
    taxRate: taxRate.toFixed(2),
    taxAmount: taxAmount.toFixed(2),
    totalPrice: totalPrice.toFixed(2)
  };
}

export function calculateSquareRoot(number: number) {
  const result = Math.sqrt(number);
  const isExact = number === Math.pow(Math.floor(result), 2);
  
  return {
    number,
    result: result.toFixed(6),
    note: isExact ? '✓ هذا الرقم له جذر تربيعي صحيح' : 'القيمة مقربة إلى 6 منازل عشرية'
  };
}

export function calculateGPA(courses: Array<{ grade: number; hours: number }>) {
  let totalPoints = 0;
  let totalHours = 0;
  let validCourses = 0;

  // Convert percentage grade (0-100) to GPA scale (0-5)
  const convertToGradePoint = (percentage: number): number => {
    if (percentage >= 95) return 5.0;  // A+
    if (percentage >= 90) return 4.75; // A
    if (percentage >= 85) return 4.5;  // B+
    if (percentage >= 80) return 4.0;  // B
    if (percentage >= 75) return 3.5;  // C+
    if (percentage >= 70) return 3.0;  // C
    if (percentage >= 65) return 2.5;  // D+
    if (percentage >= 60) return 2.0;  // D
    return 1.0; // F
  };

  courses.forEach(course => {
    if (course.grade >= 0 && course.hours > 0) {
      const gradePoint = convertToGradePoint(course.grade);
      totalPoints += gradePoint * course.hours;
      totalHours += course.hours;
      validCourses++;
    }
  });

  if (totalHours === 0) {
    return {
      gpa: '0.00',
      totalHours: 0,
      validCourses: 0,
      grade: 'لا يوجد'
    };
  }

  const gpa = totalPoints / totalHours;
  let grade = '';

  if (gpa >= 4.75) grade = 'A+';
  else if (gpa >= 4.25) grade = 'A';
  else if (gpa >= 3.75) grade = 'B+';
  else if (gpa >= 3.25) grade = 'B';
  else if (gpa >= 2.75) grade = 'C+';
  else if (gpa >= 2.25) grade = 'C';
  else if (gpa >= 1.75) grade = 'D+';
  else if (gpa >= 1.25) grade = 'D';
  else grade = 'F';

  return {
    gpa: gpa.toFixed(2),
    totalHours,
    validCourses,
    grade
  };
}

// Unit Converter
export function convertUnits(value: number, fromUnit: string, toUnit: string, category: string) {
  const conversions: { [key: string]: { [key: string]: number } } = {
    length: {
      meter: 1,
      kilometer: 0.001,
      centimeter: 100,
      millimeter: 1000,
      foot: 3.28084,
      inch: 39.3701,
      yard: 1.09361,
      mile: 0.000621371,
      nauticalMile: 0.000539957
    },
    weight: {
      kilogram: 1,
      gram: 1000,
      pound: 2.20462,
      ounce: 35.274,
      ton: 0.001,
      stone: 0.157473
    },
    volume: {
      liter: 1,
      milliliter: 1000,
      gallon: 0.264172,
      quart: 1.05669,
      pint: 2.11338,
      cup: 4.22675,
      fluidOunce: 33.814,
      cubicMeter: 0.001,
      cubicCentimeter: 1000
    },
    area: {
      squareMeter: 1,
      squareKilometer: 0.000001,
      squareCentimeter: 10000,
      squareFoot: 10.7639,
      squareInch: 1550,
      squareYard: 1.19599,
      acre: 0.000247105,
      hectare: 0.0001
    },
    temperature: {
      celsius: 1,
      fahrenheit: 1,
      kelvin: 1
    }
  };

  if (category === 'temperature') {
    if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
      return (value * 9/5) + 32;
    } else if (fromUnit === 'celsius' && toUnit === 'kelvin') {
      return value + 273.15;
    } else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
      return (value - 32) * 5/9;
    } else if (fromUnit === 'fahrenheit' && toUnit === 'kelvin') {
      return ((value - 32) * 5/9) + 273.15;
    } else if (fromUnit === 'kelvin' && toUnit === 'celsius') {
      return value - 273.15;
    } else if (fromUnit === 'kelvin' && toUnit === 'fahrenheit') {
      return ((value - 273.15) * 9/5) + 32;
    }
    return value;
  }

  const categoryConversions = conversions[category];
  if (!categoryConversions) return value;

  const baseValue = value / categoryConversions[fromUnit];
  return baseValue * categoryConversions[toUnit];
}

// Password Generator
export function generatePassword(length: number, options: {
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}) {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  let chars = '';
  if (options.uppercase) chars += uppercase;
  if (options.lowercase) chars += lowercase;
  if (options.numbers) chars += numbers;
  if (options.symbols) chars += symbols;

  if (chars === '') chars = lowercase;

  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  let strength = 'ضعيف';
  let strengthColor = 'text-red-600';
  if (length >= 12 && options.uppercase && options.lowercase && options.numbers && options.symbols) {
    strength = 'قوي جداً';
    strengthColor = 'text-green-600';
  } else if (length >= 8 && ((options.uppercase && options.lowercase) || (options.numbers && options.symbols))) {
    strength = 'قوي';
    strengthColor = 'text-blue-600';
  } else if (length >= 6) {
    strength = 'متوسط';
    strengthColor = 'text-yellow-600';
  }

  return {
    password,
    strength,
    strengthColor,
    length
  };
}

// Text Encoder/Decoder
export function encodeText(text: string, method: string) {
  switch (method) {
    case 'base64':
      return btoa(unescape(encodeURIComponent(text)));
    case 'caesar':
      return text.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {
          return String.fromCharCode(((code - 65 + 3) % 26) + 65);
        } else if (code >= 97 && code <= 122) {
          return String.fromCharCode(((code - 97 + 3) % 26) + 97);
        }
        return char;
      }).join('');
    case 'reverse':
      return text.split('').reverse().join('');
    case 'bmo':
      return generateBMOEncryption(text);
    default:
      return text;
  }
}

export function decodeText(text: string, method: string) {
  switch (method) {
    case 'base64':
      try {
        return decodeURIComponent(escape(atob(text)));
      } catch {
        return 'خطأ في فك التشفير';
      }
    case 'caesar':
      return text.split('').map(char => {
        const code = char.charCodeAt(0);
        if (code >= 65 && code <= 90) {
          return String.fromCharCode(((code - 65 - 3 + 26) % 26) + 65);
        } else if (code >= 97 && code <= 122) {
          return String.fromCharCode(((code - 97 - 3 + 26) % 26) + 97);
        }
        return char;
      }).join('');
    case 'reverse':
      return text.split('').reverse().join('');
    case 'bmo':
      return decodeBMOEncryption(text);
    default:
      return text;
  }
}

// BMO Encryption
function generateBMOEncryption(text: string): string {
  const bmoMap: { [key: string]: string } = {
    'a': '🌙', 'b': '⭐', 'c': '🌟', 'd': '✨', 'e': '💫',
    'f': '🌠', 'g': '🌌', 'h': '🌈', 'i': '🌸', 'j': '🌺',
    'k': '🌻', 'l': '🌷', 'm': '🌹', 'n': '🍀', 'o': '🌲',
    'p': '🌳', 'q': '🍁', 'r': '🍂', 's': '🍃', 't': '🌾',
    'u': '🌿', 'v': '🍄', 'w': '🌵', 'x': '🌴', 'y': '🌱',
    'z': '🌰', ' ': '🔷', '0': '0️⃣', '1': '1️⃣', '2': '2️⃣',
    '3': '3️⃣', '4': '4️⃣', '5': '5️⃣', '6': '6️⃣', '7': '7️⃣',
    '8': '8️⃣', '9': '9️⃣'
  };

  return text.toLowerCase().split('').map(char => bmoMap[char] || char).join('');
}

function decodeBMOEncryption(text: string): string {
  const bmoReverseMap: { [key: string]: string } = {
    '🌙': 'a', '⭐': 'b', '🌟': 'c', '✨': 'd', '💫': 'e',
    '🌠': 'f', '🌌': 'g', '🌈': 'h', '🌸': 'i', '🌺': 'j',
    '🌻': 'k', '🌷': 'l', '🌹': 'm', '🍀': 'n', '🌲': 'o',
    '🌳': 'p', '🍁': 'q', '🍂': 'r', '🍃': 's', '🌾': 't',
    '🌿': 'u', '🍄': 'v', '🌵': 'w', '🌴': 'x', '🌱': 'y',
    '🌰': 'z', '🔷': ' ', '0️⃣': '0', '1️⃣': '1', '2️⃣': '2',
    '3️⃣': '3', '4️⃣': '4', '5️⃣': '5', '6️⃣': '6', '7️⃣': '7',
    '8️⃣': '8', '9️⃣': '9'
  };

  return text.split('').map(char => bmoReverseMap[char] || char).join('');
}

export function generateDetectorCode(text: string) {
  return encodeText(text, 'bmo');
}

export function validateDetectorCode(code: string) {
  return decodeText(code, 'bmo');
}

// Color Converter
export function convertColor(color: string, fromFormat: string, toFormat: string) {
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  if (fromFormat === 'hex' && toFormat === 'rgb') {
    const rgb = hexToRgb(color);
    return rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : 'خطأ في التحويل';
  }

  return 'تحويل غير مدعوم حالياً';
}
