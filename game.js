import { WORD_PACKS } from "./words.js";

const playerList = document.getElementById("playerList");
const nameInput = document.getElementById("nameInput");
const addPlayerBtn = document.getElementById("addPlayerBtn");

const categoryList = document.getElementById("categoryList");
const startBtn = document.getElementById("startBtn");

const setupDiv = document.getElementById("setup");
const revealDiv = document.getElementById("reveal");

const playerLabel = document.getElementById("playerLabel");
const card = document.getElementById("card");
const cardWord = document.getElementById("cardWord");
const cardHint = document.getElementById("cardHint");
const nextBtn = document.getElementById("nextBtn");

let players = [];
let categories = [];
let currentIndex = 0;
let chosenWord = null;
let impostorIndex = null;

/* -------------------------
   PLAYER MANAGEMENT (PILLS)
-------------------------- */

function renderPlayers() {
  playerList.innerHTML = "";
  players.forEach((name, i) => {
    const pill = document.createElement("div");
    pill.className = "pill";
    pill.textContent = name;

    const x = document.createElement("button");
    x.textContent = "×";
    x.onclick = () => {
      players.splice(i, 1);
      renderPlayers();
    };

    pill.appendChild(x);
    playerList.appendChild(pill);
  });
}

addPlayerBtn.onclick = () => {
  const name = nameInput.value.trim();
  if (name.length > 0) {
    players.push(name);
    nameInput.value = "";
    renderPlayers();
  }
};

/* -------------------------
   CATEGORY TOGGLES (PILLS)
-------------------------- */

const uniqueCats = [...new Set(WORD_PACKS.map(w => w.category))];
categories = [...uniqueCats]; // all ON by default

function renderCategories() {
  categoryList.innerHTML = "";

  uniqueCats.forEach(cat => {
    const pill = document.createElement("div");
    pill.className = "pill";
    pill.textContent = cat;

    const x = document.createElement("button");
    x.textContent = categories.includes(cat) ? "✓" : "×";
    x.style.background = categories.includes(cat) ? "#090" : "#900";

    x.onclick = () => {
      if (categories.includes(cat)) {
        categories = categories.filter(c => c !== cat);
      } else {
        categories.push(cat);
      }
      renderCategories();
    };

    pill.appendChild(x);
    categoryList.appendChild(pill);
  });
}

renderCategories();

/* -------------------------
   START GAME
-------------------------- */

startBtn.onclick = () => {
  if (players.length < 3) {
    alert("Need at least 3 players");
    return;
  }

  if (categories.length === 0) {
    alert("Select at least one category");
    return;
  }

  const pool = WORD_PACKS.filter(w => categories.includes(w.category));

  chosenWord = pool[Math.floor(Math.random() * pool.length)];
  impostorIndex = Math.floor(Math.random() * players.length);

  currentIndex = 0;

  setupDiv.classList.add("hidden");
  revealDiv.classList.remove("hidden");

  showPlayer();
};

/* -------------------------
   SHOW PLAYER CARD
-------------------------- */

function showPlayer() {
  const name = players[currentIndex];
  playerLabel.textContent = `Player: ${name}`;

  cardWord.textContent = "Hold to reveal";
  cardHint.textContent = "";

  const isImpostor = currentIndex === impostorIndex;
  const word = isImpostor ? "IMPOSTOR" : chosenWord.word;
  const hint = isImpostor ? chosenWord.hint : "";

  const show = () => {
    card.classList.add("revealed");
    cardWord.textContent = word;
    cardHint.textContent = hint;
  };

  const hide = () => {
    card.classList.remove("revealed");
    cardWord.textContent = "Hold to reveal";
    cardHint.textContent = "";
  };

  card.onmousedown = show;
  card.onmouseup = hide;
  card.onmouseleave = hide;
  card.ontouchstart = show;
  card.ontouchend = hide;
}

/* -------------------------
   NEXT PLAYER / END GAME
-------------------------- */

nextBtn.onclick = () => {
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
        <button id="backBtn">Back to Menu</button>
      `;

      document.getElementById("backBtn").onclick = () => {
        revealDiv.classList.add("hidden");
        setupDiv.classList.remove("hidden");
      };
    };

    return;
  }

  showPlayer();
};
