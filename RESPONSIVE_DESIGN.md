# Responsive UI/UX Implementation - Master Math

## 📱 Ringkasan Perubahan

Aplikasi Master Math telah diupdate dengan sistem responsive design yang komprehensif untuk mendukung pengalaman pengguna yang optimal di berbagai ukuran perangkat: **Mobile**, **Tablet**, dan **Desktop**.

---

## 🎯 Device Breakpoints

Sistem responsive dirancang dengan tiga kategori utama:

| Device Type | Screen Width   | Use Cases                           |
| ----------- | -------------- | ----------------------------------- |
| **Mobile**  | < 600dp        | Smartphone (iPhone, Android phones) |
| **Tablet**  | 600dp - 1024dp | iPad, Android tablets               |
| **Desktop** | > 1024dp       | Web browser, large screens          |

---

## 🛠️ Utility Functions (responsiveUtils.js)

File `src/utils/responsiveUtils.js` menyediakan fungsi-fungsi helper untuk responsive design:

### Core Functions:

1. **getDeviceType()** - Menentukan tipe device berdasarkan lebar layar
2. **getResponsiveFontSize(baseSize)** - Menyesuaikan ukuran font
3. **getResponsiveSpacing(baseSpacing)** - Menyesuaikan padding/margin
4. **getResponsiveWidth(percentage, maxWidth)** - Menghitung lebar responsif
5. **getCardWidth()** - Menghitung lebar card untuk layout grid
6. **getNumColumns()** - Menentukan jumlah kolom untuk grid layout
7. **getContentPadding()** - Padding standar untuk konten
8. **getMaxContentWidth()** - Lebar maksimal untuk konten
9. **getButtonHeight()** - Tinggi button responsif
10. **getHorizontalInset()** - Inset horizontal yang konsisten

### Contoh Penggunaan:

```javascript
import {
  getDeviceType,
  getResponsiveFontSize,
  getResponsiveSpacing,
} from "../utils/responsiveUtils";

// Dalam component
const deviceType = getDeviceType(); // "mobile" | "tablet" | "desktop"
const titleSize = getResponsiveFontSize(32); // Ukuran font yang menyesuaikan
const padding = getResponsiveSpacing(15); // Padding yang menyesuaikan
```

---

## 🎨 Updated Screens

### 1. **LoginScreen** ✅

- **KeyboardAvoidingView** untuk menangani keyboard di mobile
- **ScrollView** dengan responsive styling
- Card width yang menyesuaikan (max 500dp)
- Font sizes yang scalable
- Optimal untuk: Mobile (portrait), Tablet (both), Desktop

**Key Changes:**

- Wrapping dengan `KeyboardAvoidingView` dan `ScrollView`
- Responsive card sizing dengan `getResponsiveWidth(90, 500)`
- Dynamic font sizing untuk title dan subtitle
- Better spacing dan elevation

### 2. **RegisterScreen** ✅

- Sama dengan LoginScreen - responsive layout dengan form
- Keyboard-aware implementation
- Scalable input fields dan buttons

**Key Changes:**

- Implementasi yang identik dengan LoginScreen
- Form inputs dengan responsive padding
- Dynamic button sizing

### 3. **MainMenuScreen** ✅

- **Profile Card** dengan responsive sizing
- **Level List** yang menyesuaikan dengan ukuran layar
- **Dialog Modal** untuk game mode selection
- Optimal untuk semua ukuran layar

**Key Changes:**

- Content container dengan `maxWidth` dan `width: 90%`
- Responsive padding dan font sizing
- Level items dengan responsive text sizes
- Dialog dengan better mobile experience

### 4. **GameplayScreen** ✅

- **Question Card** dengan responsive font sizes
- **Options Grid** dengan 2-column layout
- Responsive scoring display
- Optimal untuk gameplay di semua devices

**Key Changes:**

- Reduced padding untuk mobile: `paddingHorizontal: 15`
- Responsive font sizes untuk soal (26px) dan opsi (18px)
- 2-column option grid yang scalable
- Better spacing untuk all devices

### 5. **ProfileScreen** ✅

- **User Info Card** dengan responsive layout
- **Settings Form** dengan scalable inputs
- **Game History** dengan responsive item sizing
- Optimal untuk profile management

**Key Changes:**

- ScrollView dengan responsive padding
- Scalable avatar sizing
- Responsive input fields dan buttons
- Better text sizing untuk all devices

---

## 📐 Responsive Design Patterns

### Pattern 1: Scalable Container

```javascript
const responsiveStyles = useMemo(
  () => ({
    cardWidth: getResponsiveWidth(90, 500),
    padding: getResponsiveSpacing(30),
  }),
  [deviceType],
);

// Usage
<View style={[styles.card, { width: responsiveStyles.cardWidth }]} />;
```

### Pattern 2: Dynamic Font Sizing

```javascript
<Text style={[styles.title, { fontSize: getResponsiveFontSize(32) }]}>
  Master Math
</Text>
```

### Pattern 3: Flexible Layout

```javascript
<View
  style={{
    maxWidth: 800,
    width: "90%",
    alignSelf: "center",
  }}
>
  {/* Content will scale with parent */}
</View>
```

---

## 📊 Scaling Rules

### Font Sizes

| Mobile         | Tablet     | Desktop    |
| -------------- | ---------- | ---------- |
| Base (14px)    | Base × 1.1 | Base × 1.2 |
| Title (32px)   | 35px       | 38px       |
| Heading (24px) | 26px       | 29px       |

### Spacing

| Mobile         | Tablet      | Desktop    |
| -------------- | ----------- | ---------- |
| Base (15px)    | Base × 1.15 | Base × 1.3 |
| Padding (30px) | 34px        | 39px       |
| Margin (10px)  | 11px        | 13px       |

### Container Widths

| Device  | Card Width | Max Width |
| ------- | ---------- | --------- |
| Mobile  | 90%        | 500dp     |
| Tablet  | 90%        | 900dp     |
| Desktop | 90%        | 1200dp    |

---

## ✨ Key Features Implemented

### ✅ Mobile-First Approach

- Dimulai dengan design untuk mobile
- Scalable ke tablet dan desktop

### ✅ Safe Area Handling

- Menggunakan `useSafeAreaInsets()` dari `react-native-safe-area-context`
- Padding otomatis untuk notch dan home indicator
- Kompatibel dengan berbagai device model

### ✅ Flexible Grid Layout

- Options dalam GameplayScreen scalable
- Levels dalam MainMenuScreen responsif
- Dialog modals dengan optimal sizing

### ✅ Keyboard Awareness

- LoginScreen dan RegisterScreen handle keyboard
- `KeyboardAvoidingView` mencegah content hidden
- Better mobile form experience

### ✅ Touch Targets

- Minimum 44-48dp untuk button heights
- Spacious padding untuk usability
- Larger icons untuk mobile (18-32dp)

### ✅ Image & Typography Scaling

- Font sizes adjust berdasarkan device
- Line heights yang optimal
- Better readability di semua sizes

---

## 🚀 Usage Guidelines

### Untuk Menambah Responsive Design ke Screen Baru:

```javascript
import {
  getResponsiveFontSize,
  getResponsiveSpacing,
  getDeviceType,
} from "../utils/responsiveUtils";

export default function MyScreen() {
  const deviceType = getDeviceType();

  const responsiveStyles = useMemo(
    () => ({
      titleSize: getResponsiveFontSize(28),
      padding: getResponsiveSpacing(15),
    }),
    [deviceType],
  );

  return (
    <View>
      <Text style={{ fontSize: responsiveStyles.titleSize }}>My Title</Text>
    </View>
  );
}
```

---

## 🧪 Testing Responsive Design

### Mobile Testing (< 600dp)

- Test di iPhone/Android emulator
- Portrait dan landscape orientation
- Keyboard interaction

### Tablet Testing (600-1024dp)

- Test di iPad emulator
- Multi-column layouts
- Split-view compatibility

### Desktop Testing (> 1024dp)

- Test di web browser
- Maximize window ke different sizes
- Verify max-width constraints

---

## 📝 Component Updates Summary

| Component          | Status | Changes                                           |
| ------------------ | ------ | ------------------------------------------------- |
| LoginScreen        | ✅     | KeyboardAvoidingView, ScrollView, responsive card |
| RegisterScreen     | ✅     | KeyboardAvoidingView, ScrollView, responsive form |
| MainMenuScreen     | ✅     | Responsive content container, scalable lists      |
| GameplayScreen     | ✅     | Responsive question card, options grid            |
| ProfileScreen      | ✅     | Responsive layout, scalable form                  |
| responsiveUtils.js | ✅     | Complete utility function library                 |

---

## 🎯 Next Steps (Optional Enhancements)

1. **More Screens to Update:**
   - LeaderboardScreen
   - QuestionWarehouseScreen
   - PracticeProblemsScreen
   - ChallengeMenuScreen
   - ChallengeLeaderboardScreen

2. **Additional Features:**
   - Landscape orientation support
   - Dark mode responsiveness
   - Tablet-specific optimizations
   - Tablet split-view UI

3. **Testing:**
   - Cross-device testing
   - Orientation change testing
   - Performance optimization
   - Accessibility improvements

---

## 📚 Resources

- React Native Dimensions: https://reactnative.dev/docs/dimensions
- React Native Paper: https://reactnativepaper.com/
- Safe Area Context: https://github.com/th3rdwave/react-native-safe-area-context
- Responsive Design Best Practices: https://reactnative.dev/docs/dimensions

---

**Last Updated:** May 2, 2026
**Status:** Core screens fully responsive ✅
