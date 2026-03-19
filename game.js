import { WORD_PACKS } from "./words.js";

let playerList = document.getElementById("playerList");
let nameInput = document.getElementById("nameInput");
let addPlayerBtn = document.getElementById("addPlayerBtn");

let categoryList = document.getElementById("categoryList");
let startBtn = document.getElementById("startBtn");

let setupDiv = document.getElementById("setup");
let revealDiv = document.getElementById("reveal");

let playerLabel = document.getElementById("playerLabel");
let card = document.getElementById("card");
let cardWord = document.getElementById("cardWord");
let cardHint = document.getElementById("cardHint");
let nextBtn = document.getElementById("nextBtn");

let players = [];
let categories = [];
let currentIndex = 0;
let chosenWord = null;
let impostorIndex = null;

/* MULTIPLE CARD COLOURS */
const neonColors = ["#0ff", "#ff00ff", "#39ff14", "#ff0080", "#ffea00"];

/* CATEGORY EMOJIS */
const categoryEmojis = {
  "Animals": "🐾",
  "Food": "🍽️",
  "Places": "📍",
  "Objects": "🎒"
};

/* -------------------------
   PLAYER MANAGEMENT
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
   CATEGORY TOGGLES
-------------------------- */

const uniqueCats = [...new Set(WORD_PACKS.map(w => w.category))];
categories = [...uniqueCats];

function renderCategories() {
  categoryList.innerHTML = "";

  uniqueCats.forEach(cat => {
    const pill = document.createElement("div");
    pill.className = "pill";

    const emoji = categoryEmojis[cat] || "✨";
    pill.textContent = emoji + " " + cat;

    const btn = document.createElement("button");
    const isOn = categories.includes(cat);

    btn.textContent = isOn ? "✓" : "×";
    btn.style.background = isOn ? "#00cc66" : "#ff0080";

    btn.onclick = () => {
      if (isOn) {
        categories = categories.filter(c => c !== cat);
      } else {
        categories.push(cat);
      }
      renderCategories();
    };

    pill.appendChild(btn);
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

  const random = neonColors[Math.floor(Math.random() * neonColors.length)];
  card.style.background = random;

  cardWord.textContent = "Hold to reveal";
  cardHint.textContent = "";

  const isImpostor = currentIndex === impostorIndex;
  const word = isImpostor ? "IMPOSTOR" : chosenWord.word;
  const hint = isImpostor ? chosenWord.hint : "";

  const show = () => {
    cardWord.textContent = word;
    cardHint.textContent = hint;
  };

  const hide = () => {
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

function nextPlayerHandler() {
  card.classList.add("slide-out");

  setTimeout(() => {
    currentIndex++;

    if (currentIndex >= players.length) {
      revealDiv.innerHTML = `
        <h2>${players[Math.floor(Math.random() * players.length)]} starts the conversation!</h2>
        <button id="endGameBtn">End Game</button>
      `;

      document.getElementById("endGameBtn").onclick = () => {
        revealDiv.innerHTML = `
          <h2>Game Over</h2>
          <p><strong>Word:</strong> ${chosenWord.word}</p>
          <p><strong>Impostor:</strong> ${players[impostorIndex]}</p>
          <button id="backBtn">Back to Menu</button>
        `;

        document.getElementById("backBtn").onclick = resetToMenu;
      };

      return;
    }

    card.classList.remove("slide-out");
    card.classList.add("slide-in");

    showPlayer();

    setTimeout(() => {
      card.classList.remove("slide-in");
    }, 300);

  }, 300);
}

nextBtn.onclick = nextPlayerHandler;

/* -------------------------
   RESET TO MENU
-------------------------- */

function resetToMenu() {
  revealDiv.classList.add("hidden");
  setupDiv.classList.remove("hidden");

  revealDiv.innerHTML = `
    <h2 id="playerLabel"></h2>
    <div id="card" class="card">
      <p id="cardWord">Hold to reveal</p>
      <p id="cardHint" class="hint"></p>
    </div>
    <button id="nextBtn">Next Player</button>
  `;

  playerLabel = document.getElementById("playerLabel");
  card = document.getElementById("card");
  cardWord = document.getElementById("cardWord");
  cardHint = document.getElementById("cardHint");
  nextBtn = document.getElementById("nextBtn");

  nextBtn.onclick = nextPlayerHandler;
}
