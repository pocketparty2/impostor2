import { WORD_PACKS } from "./words.js";

const categorySelect = document.getElementById("categorySelect");
const startBtn = document.getElementById("startBtn");
const playerNamesInput = document.getElementById("playerNames");

const setupDiv = document.getElementById("setup");
const revealDiv = document.getElementById("reveal");

const playerLabel = document.getElementById("playerLabel");
const secretInfo = document.getElementById("secretInfo");
const nextBtn = document.getElementById("nextBtn");

let players = [];
let currentIndex = 0;
let chosenWord = null;
let impostorIndex = null;

// Populate category dropdown
const categories = [...new Set(WORD_PACKS.map(w => w.category))];
categories.forEach(cat => {
  const opt = document.createElement("option");
  opt.value = cat;
  opt.textContent = cat;
  categorySelect.appendChild(opt);
});

startBtn.addEventListener("click", () => {
  players = playerNamesInput.value
    .split("\n")
    .map(n => n.trim())
    .filter(n => n.length > 0);

  if (players.length < 3) {
    alert("Need at least 3 players");
    return;
  }

  const selectedCategory = categorySelect.value;
  const wordsInCategory = WORD_PACKS.filter(w => w.category === selectedCategory);

  chosenWord = wordsInCategory[Math.floor(Math.random() * wordsInCategory.length)];

  impostorIndex = Math.floor(Math.random() * players.length);

  setupDiv.classList.add("hidden");
  revealDiv.classList.remove("hidden");

  showPlayer();
});

function showPlayer() {
  const name = players[currentIndex];
  playerLabel.textContent = `Player: ${name}`;

  if (currentIndex === impostorIndex) {
    secretInfo.textContent = `You are the IMPOSTOR. Hint: ${chosenWord.hint}`;
  } else {
    secretInfo.textContent = `Your word: ${chosenWord.word}`;
  }
}

nextBtn.addEventListener("click", () => {
  currentIndex++;

  if (currentIndex >= players.length) {
    revealDiv.innerHTML = "<h2>All players have seen their roles!</h2>";
    return;
  }

  showPlayer();
});
