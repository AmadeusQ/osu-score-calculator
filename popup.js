document.addEventListener("DOMContentLoaded", () => {
  const calculateButton = document.getElementById("button");
  const resultDiv = document.getElementById("result");
  const scoreInput = document.getElementById("score");
  const userId = document.getElementById("user-id");

  async function calculatePP(newScore) {
    try {
      const response = await fetch(
        `https://osu.ppy.sh/users/${userId.value}/scores/best?mode=osu&limit=100`
      );
      if (!response.ok) {
        resultDiv.textContent = "Player not found.";
        return;
      }

      const data = await response.json();

      const topScores = data || [];

      const scores = topScores.map((score) => score.pp);
      scores.sort((a, b) => b - a);

      const percentages = [
        100, 95, 90, 86, 81, 77, 74, 70, 66, 63, 60, 57, 54, 51, 49, 46, 44, 42,
        40, 38, 36, 34, 32, 31, 29, 28, 26, 25, 24, 23, 21, 20, 19, 18, 17, 17,
        16, 15, 14, 14, 13, 12, 12, 11, 10, 10, 9, 9, 9, 8, 8, 7, 7, 7, 6, 6, 6,
        5, 5, 5, 5, 4, 4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2,
        2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
      ];

      let totalPP = 0;
      scores.forEach((score, index) => {
        const percentage = percentages[index] || 0;
        totalPP += score * (percentage / 100);
      });

      scores.push(newScore);
      scores.sort((a, b) => b - a);
      const top100Scores = scores.slice(0, 100);

      let newTotalPP = 0;
      top100Scores.forEach((score, index) => {
        const percentage = percentages[index] || 0;
        newTotalPP += score * (percentage / 100);
      });

      const calculatedPP = newTotalPP - totalPP;
      console.log(newTotalPP, totalPP);
      console.log(calculatedPP);

      resultDiv.textContent = `For ${newScore}pp score, you will get ${calculatedPP.toFixed(
        2
      )}pp.`;
    } catch (error) {}
  }

  calculateButton.addEventListener("click", (event) => {
    event.preventDefault();
    const newScore = parseFloat(scoreInput.value);
    if (isNaN(newScore) || newScore <= 0) {
      resultDiv.textContent = "Please enter a valid score.";
      return;
    }
    calculatePP(newScore);
  });
});
