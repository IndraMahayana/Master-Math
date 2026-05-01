/**
 * scoreSystem.js
 * Handles dynamic in-game score calculation based on difficulty, time, streaks, and perfect runs.
 */

/**
 * Calculate score for a single answered question.
 * @param {Object} params
 * @param {string} params.difficulty - 'Easy', 'Medium', 'Hard'
 * @param {number} params.streak - Current consecutive correct answers
 * @param {number} params.timeTaken - Seconds taken to answer the question
 * @param {boolean} params.isBoss - Is it a boss level?
 * @returns {number} The calculated score points
 */
export const calculateScore = ({ difficulty, streak, timeTaken, isBoss = false }) => {
  // 1. Base Score
  let baseScore = 10;
  if (difficulty === 'Medium') baseScore = 20;
  if (difficulty === 'Hard') baseScore = 40;

  // 2. Speed Bonus Multiplier
  let speedMultiplier = 1;
  if (timeTaken < 5) {
    speedMultiplier = 1.5; // +50%
  } else if (timeTaken < 10) {
    speedMultiplier = 1.2; // +20%
  }

  // 3. Streak Multiplier
  let streakMultiplier = 1;
  if (streak >= 10) {
    streakMultiplier = 2; // x2
  } else if (streak >= 5) {
    streakMultiplier = 1.5; // x1.5
  } else if (streak >= 3) {
    streakMultiplier = 1.2; // x1.2
  }

  // Final score per question
  let finalScore = baseScore * speedMultiplier * streakMultiplier;
  
  if (isBoss) {
     finalScore *= 2; // Reward besar untuk Boss Level
  }
  
  return Math.round(finalScore);
};

/**
 * Calculates final run bonuses upon level completion / game over.
 * @param {number} currentScore - The accumulated score during the run
 * @param {boolean} isPerfect - True if no mistakes were made
 * @returns {number} The final score with bonus applied
 */
export const applyEndGameBonuses = (currentScore, isPerfect) => {
  let finalScore = currentScore;
  if (isPerfect) {
    finalScore += (currentScore * 0.5); // +50% total score for perfect run
  }
  return Math.round(finalScore);
};

/**
 * Calculate penalty for wrong answer
 */
export const getPenaltyScore = (currentScore) => {
  // Optional: -10% score penalty on wrong answer
  const penalty = currentScore * 0.1;
  return Math.round(Math.max(0, currentScore - penalty));
};
