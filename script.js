const symbols = [
  { icon: "🍒", multiplier: 2, weight: 4 },
  { icon: "⭐", multiplier: 5, weight: 2 },
  { icon: "💎", multiplier: 10, weight: 1 },
  { icon: "7️⃣", multiplier: 20, weight: 1 },
  { icon: "💣", multiplier: -1, weight: 10 },
  { icon: "💀", multiplier: -3, weight: 6 }
];

let wallet = 0;
let bet = 0;

const walletDisplay = document.getElementById("wallet");
const betDisplay = document.getElementById("bet");
const reels = [document.getElementById("reel1"), document.getElementById("reel2"), document.getElementById("reel3")];
const lever = document.getElementById("lever");
const startOverlay = document.getElementById("start-screen");
const gameOverOverlay = document.getElementById("game-over-screen");
const bigWinBanner = document.getElementById("big-win-banner");
const bgMusic = document.getElementById("bg-music");
const toggleMusic = document.getElementById("toggle-music");

function getWeightedSymbol() {
  const pool = symbols.flatMap(s => Array(s.weight).fill(s));
  return pool[Math.floor(Math.random() * pool.length)];
}

function spinReels() {
  if (wallet < bet) return;

  wallet -= bet;
  updateUI();

  let results = [];

  reels.forEach((reel, i) => {
    reel.style.animation = "spinReel 1s linear";
    setTimeout(() => {
      const sym = getWeightedSymbol();
      reel.textContent = sym.icon;
      results[i] = sym;
      reel.style.animation = "none";
      if (i === 2) evaluateWin(results);
    }, 1000 + i * 700);
  });
}

function evaluateWin([s1, s2, s3]) {
  let total = s1.multiplier + s2.multiplier + s3.multiplier;

  if (s1.icon === s2.icon && s2.icon === s3.icon) {
    total += s1.multiplier;
    if (s1.icon === "7️⃣" || s1.icon === "💎") showBigWin();
  }

  wallet += bet * total;
  updateUI();

  if (wallet < bet) {
    gameOverOverlay.classList.remove("hidden");
  }
}

function updateUI() {
  walletDisplay.textContent = `Wallet: $${wallet}`;
  betDisplay.textContent = `Current Bet: $${bet}`;
}

function showBigWin() {
  bigWinBanner.classList.remove("hidden");
  setTimeout(() => bigWinBanner.classList.add("hidden"), 3000);
}

document.getElementById("start-button").onclick = () => {
  wallet = parseInt(document.getElementById("initial-wallet").value);
  bet = parseInt(document.getElementById("bet-size").value);
  updateUI();
  startOverlay.classList.add("hidden");
};

lever.onclick = spinReels;

document.getElementById("restart-button").onclick = () => {
  gameOverOverlay.classList.add("hidden");
  startOverlay.classList.remove("hidden");
};

toggleMusic.onclick = () => {
  if (bgMusic.paused) {
    bgMusic.play();
    toggleMusic.textContent = "🔊";
  } else {
    bgMusic.pause();
    toggleMusic.textContent = "🔇";
  }
  localStorage.setItem("musicMuted", bgMusic.paused);
};

window.onload = () => {
  if (localStorage.getItem("musicMuted") === "false") {
    bgMusic.play();
    toggleMusic.textContent = "🔊";
  } else {
    toggleMusic.textContent = "🔇";
  }
};