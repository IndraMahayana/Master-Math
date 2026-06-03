/**
 * progressionSystem.js
 * Handles progressive scores, level gating, and boss level checks.
 */

/**
 * Progressive Score Formula: Score_n = 100 * n^1.5
 * Level 1 starts at 0.
 * @param {number} level - The level number (1 to 45)
 * @returns {number} The required score to unlock the level.
 */
export const getRequiredScore = (level) => {
  if (level <= 1) return 0;
  const rawScore = 100 * Math.pow(level, 1.5);
  // Bulatkan ke puluhan terdekat agar rapi
  return Math.round(rawScore / 10) * 10;
};

/**
 * Checks if a specific level is a Boss Level.
 * Every 15 levels is a boss level (15, 30, 45).
 * @param {number|string} level 
 * @returns {boolean}
 */
export const isBossLevel = (level) => {
  const lvlNum = parseInt(level, 10);
  return lvlNum > 0 && lvlNum % 15 === 0;
};

/**
 * Checks phase unlock status based on completed levels.
 * Phase 2 needs >= 70% of Phase 1 (15 levels * 0.7 = 11 levels).
 * Phase 3 needs >= 60% of Phase 2 (15 levels * 0.6 = 9 levels).
 * @param {Object} playerProgress - Expects { completedLevels: number[] }
 * @returns {Object} { phase1: true, phase2: boolean, phase3: boolean }
 */
export const checkPhaseUnlock = (playerProgress) => {
  const completed = playerProgress?.completedLevels || [];
  const score = playerProgress?.score || 0;

  // Hitung jumlah level selesai di tiap Fase
  let phase1Complete = 0; // level 1-15
  let phase2Complete = 0; // level 16-30

  completed.forEach(lvl => {
    const l = parseInt(lvl, 10);
    if (l >= 1 && l <= 15) phase1Complete++;
    if (l >= 16 && l <= 30) phase2Complete++;
  });

  // Fase 2 terbuka jika menyelesaikan 70% Fase 1 ATAU skor mencukupi untuk Level 16
  const phase2Unlocked = (phase1Complete >= 11) || (score >= getRequiredScore(16));
  
  // Fase 3 terbuka jika Fase 2 terbuka DAN (menyelesaikan 60% Fase 2 ATAU skor mencukupi untuk Level 31)
  const phase3Unlocked = phase2Unlocked && ((phase2Complete >= 9) || (score >= getRequiredScore(31)));

  return {
    phase1: true, // Always unlocked
    phase2: phase2Unlocked,
    phase3: phase3Unlocked,
  };
};
