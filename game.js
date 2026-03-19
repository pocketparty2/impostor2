import { WORD_PACKS } from "./words.js";

const categoryToggles = document.getElementById("categoryToggles");
const startBtn = document.getElementById("startBtn");
const playerNamesInput = document.getElementById("playerNames");

const setupDiv = document.getElementById("setup");
const revealDiv = document.getElementById("reveal");

const playerLabel = document.getElementById("playerLabel");
const card = document.getElementById("card");
const cardText = document.getElementById("cardText");
const nextBtn = document.getElementById("nextBtn");

let players = [];
let currentIndex = 0;
let chosenWord = null;
let impostorIndex = null;

// Build category toggles
const categories = [...new Set(WORD_PACKS.map(w => w.category))];
categories.forEach(cat => {
  const wrapper = document.createElement("label");
  wrapper.style.display = "block";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.value = cat;

  wrapper.appendChild(checkbox);
  wrapper.append(" " + cat);
  categoryToggles.appendChild(wrapper);
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

  const selectedCategories = [...categoryToggles.querySelectorAll("input:checked")]
    .map(c => c.value);

  if (selectedCategories.length === 0) {
    alert("Select at least one category");
    return;
  }

  const pool = WORD_PACKS.filter(w => selectedCategories.includes(w.category));

  chosenWord = pool[Math.floor(Math.random() * pool.length)];
  impostorIndex = Math.floor(Math.random() * players.length);

  setupDiv.classList.add("hidden");
  revealDiv.classList.remove("hidden");

  showPlayer();
});

function showPlayer() {
  const name = players[currentIndex];
  playerLabel.textContent = `Player: ${name}`;

  cardText.textContent = "Hold to reveal";

  const isImpostor = currentIndex === impostorIndex;
  const secret = isImpostor
    ? `IMPOSTOR\nHint: ${chosenWord.hint}`
    : chosenWord.word;

  // Hold-to-reveal behavior
  const show = () => {
    card.classList.add("revealed");
    cardText.textContent = secret;
  };

  const hide = () => {
    card.classList.remove("revealed");
    cardText.textContent = "Hold to reveal";
  };

  card.onmousedown = show;
  card.onmouseup = hide;
  card.onmouseleave = hide;
  card.ontouchstart = show;
  card.ontouchend = hide;
}

nextBtn.addEventListener("click", () => {
  currentIndex++;

  if (currentIndex >= players.length) {
    const starter = players[Math.floor(Math.random() * players.length)];

    revealDiv.innerHTML = `
      <h2>${starter} starts the conversation!</h2>
      <button id="endGameBtn">End Game</button>
    `;

    document.getElementById("endGameBtn").onclick = () => {
      revealDiv.innerHTML = `
        <h2>Game Over</h2>
        <p><strong>Word:</strong> ${chosenWord.word}</p>
        <p><strong>Impostor:</strong> ${players[impostorIndex]}</p>
      `;
    };

    return;
  }

  showPlayer();
});

