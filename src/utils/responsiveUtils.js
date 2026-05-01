import { Dimensions, Platform } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

/**
 * Determine device type based on screen width
 * Mobile: < 600dp
 * Tablet: 600dp - 1024dp
 * Desktop: > 1024dp
 */
export const getDeviceType = () => {
  if (windowWidth < 600) {
    return "mobile";
  } else if (windowWidth < 1024) {
    return "tablet";
  } else {
    return "desktop";
  }
};

/**
 * Get responsive font size based on screen width
 */
export const getResponsiveFontSize = (baseSize) => {
  const deviceType = getDeviceType();

  if (deviceType === "mobile") {
    return baseSize;
  } else if (deviceType === "tablet") {
    return baseSize * 1.1;
  } else {
    return baseSize * 1.2;
  }
};

/**
 * Get responsive padding/margin based on screen width
 */
export const getResponsiveSpacing = (baseSpacing) => {
  const deviceType = getDeviceType();

  if (deviceType === "mobile") {
    return baseSpacing;
  } else if (deviceType === "tablet") {
    return baseSpacing * 1.15;
  } else {
    return baseSpacing * 1.3;
  }
};

/**
 * Get responsive width percentage or max width
 */
export const getResponsiveWidth = (basePercentage = 90, maxWidth = null) => {
  const width = windowWidth * (basePercentage / 100);

  if (maxWidth && width > maxWidth) {
    return maxWidth;
  }

  return width;
};

/**
 * Get card width for different layouts
 * Useful for grid-like layouts on tablets/desktops
 */
export const getCardWidth = () => {
  const deviceType = getDeviceType();

  if (deviceType === "mobile") {
    return windowWidth * 0.9;
  } else if (deviceType === "tablet") {
    return (windowWidth - 50) / 2; // 2 columns with small gap
  } else {
    return (windowWidth - 80) / 3; // 3 columns with gaps
  }
};

/**
 * Get number of columns for FlatList/SectionList
 */
export const getNumColumns = () => {
  const deviceType = getDeviceType();

  if (deviceType === "mobile") {
    return 1;
  } else if (deviceType === "tablet") {
    return 2;
  } else {
    return 3;
  }
};

/**
 * Get padding based on device type
 */
export const getContentPadding = () => {
  const deviceType = getDeviceType();

  if (deviceType === "mobile") {
    return 15;
  } else if (deviceType === "tablet") {
    return 20;
  } else {
    return 30;
  }
};

/**
 * Get max content width (useful for desktop)
 */
export const getMaxContentWidth = () => {
  const deviceType = getDeviceType();

  if (deviceType === "mobile") {
    return windowWidth;
  } else if (deviceType === "tablet") {
    return Math.min(windowWidth - 40, 900);
  } else {
    return Math.min(windowWidth - 60, 1200);
  }
};

/**
 * Get header title size based on device
 */
export const getHeaderTitleSize = () => {
  return getResponsiveFontSize(32);
};

/**
 * Get button height based on device
 */
export const getButtonHeight = () => {
  const deviceType = getDeviceType();

  if (deviceType === "mobile") {
    return 48;
  } else if (deviceType === "tablet") {
    return 52;
  } else {
    return 56;
  }
};

/**
 * Get consistent horizontal inset (safe area consideration)
 */
export const getHorizontalInset = () => {
  const deviceType = getDeviceType();

  if (deviceType === "mobile") {
    return 15;
  } else if (deviceType === "tablet") {
    return 25;
  } else {
    return 40;
  }
};

/**
 * Check if is landscape
 */
export const isLandscape = () => {
  return windowWidth > windowHeight;
};

/**
 * Get responsive box shadow elevation
 */
export const getResponsiveElevation = (baseElevation = 4) => {
  const deviceType = getDeviceType();

  if (deviceType === "mobile") {
    return baseElevation;
  } else if (deviceType === "tablet") {
    return baseElevation + 2;
  } else {
    return baseElevation + 4;
  }
};

/**
 * Combine responsive values for common patterns
 */
export const getResponsiveStyles = () => {
  const deviceType = getDeviceType();

  return {
    deviceType,
    isTablet: deviceType === "tablet",
    isMobile: deviceType === "mobile",
    isDesktop: deviceType === "desktop",
    windowWidth,
    windowHeight,
    containerPadding: getContentPadding(),
    horizontalInset: getHorizontalInset(),
    maxWidth: getMaxContentWidth(),
    buttonHeight: getButtonHeight(),
    elevation: getResponsiveElevation(),
  };
};
