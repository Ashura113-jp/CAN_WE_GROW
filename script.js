const prompts = [
  "Step outside and find one thing that’s a really lovely shade of green.",
  "Put on a song you loved when you were younger. Sing if the moment feels right.",
  "Make yourself a drink and give it a fancy little name.",
  "Send someone a message that starts with “I was just thinking about you…”",
  "Stretch your arms up high like you’re the world’s tallest houseplant.",
  "Find a cloud and decide what it looks like. There are no wrong answers.",
  "Take three slow breaths and let your shoulders drop a little.",
  "Draw a tiny star on a scrap of paper. Keep it somewhere you’ll find it later.",
  "Give your pet, plant, or favorite object a sincere little compliment.",
  "Put on your coziest socks. This is an excellent use of socks.",
  "Look out a window and notice something you’ve never noticed before.",
  "Make up a new, very silly name for the day of the week.",
  "Dance for the length of one chorus. Your audience is lucky to have you.",
  "Eat a snack slowly enough to really enjoy every bite.",
  "Write down one small thing you did well today. It counts.",
  "Find something round nearby. Congratulations, you found a circle.",
  "Hum a tune while you do your next little task.",
  "Put a favorite photo somewhere you can see it.",
  "Wave hello to a neighbor, a bird, or a passing dog.",
  "Make a tiny paper airplane and give it an important mission.",
  "Take the scenic route to the next room. Behold: the grand tour.",
  "Let yourself daydream about a place you’d love to visit.",
  "Try drawing a flower without lifting your pen from the paper.",
  "Notice one kind thing somebody did for you recently.",
  "Give your hands a little stretch and thank them for all their hard work.",
  "Pick a color and see how many things nearby are wearing it.",
  "Tell yourself “I’m doing okay” — because you are.",
  "Make up a two-line poem about whatever is nearest to you.",
  "Open a book to a random page and read one sentence.",
  "Look for the moon tonight, even if it’s just a little sliver.",
  "Put one small thing back where it belongs. Future-you says thanks.",
  "Invent a flavor of ice cream that absolutely should exist.",
  "Take a moment to enjoy the light where you are right now.",
  "Do a tiny wiggle in your chair. There. Improved.",
  "Remember a time you laughed really hard. Let the smile come back.",
  "Pick a nearby object and imagine its adventurous backstory.",
  "Make a wish on the next star, eyelash, or dandelion you see.",
  "Give yourself five minutes to do absolutely nothing useful.",
  "Say something nice about yourself out loud. You deserve to hear it.",
  "Find something soft and give it a little squeeze.",
  "Make a list of three things you’re looking forward to, however small.",
  "Stand up, stretch, and give yourself a tiny round of applause.",
  "Choose a favorite emoji that sums up your mood right now.",
  "Take a slow sip of water like it’s the most refreshing water in the world.",
  "Do one little thing that makes your space feel more like yours.",
  "Look for something beautiful in an ordinary, everyday thing.",
  "Think of a person who makes you feel safe and warm. Send them a little love.",
  "Give the next person you see your best friendly smile."
];

const promptElement = document.querySelector("#joy-prompt");
const promptCount = document.querySelector("#prompt-count");
const generateButton = document.querySelector("#generate-button");
let previousPrompt = -1;
let promptsShown = 0;

generateButton.addEventListener("click", () => {
  let index = Math.floor(Math.random() * prompts.length);
  if (prompts.length > 1 && index === previousPrompt) {
    index = (index + 1 + Math.floor(Math.random() * (prompts.length - 1))) % prompts.length;
  }
  previousPrompt = index;
  promptsShown += 1;
  promptElement.textContent = prompts[index];
  promptCount.textContent = `Little joy #${promptsShown}`;
});

const gameButton = document.querySelector("#game-toggle");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time-left");
const gameMessage = document.querySelector("#game-message");
const gameState = document.querySelector("#game-state");
const gameOverlay = document.querySelector("#game-overlay");
const bubbleField = document.querySelector("#bubble-field");
const bubbles = [...bubbleField.querySelectorAll(".bubble")];
const popFeedback = document.querySelector("#pop-feedback");
const gameLength = 30;
let score = 0;
let timeLeft = gameLength;
let gameTimer = null;
let feedbackTimer = null;
let active = false;

function updateGameStats() {
  scoreElement.textContent = String(score).padStart(2, "0");
  timeElement.innerHTML = `${timeLeft}<span class="stat-unit">s</span>`;
}

function finishGame() {
  active = false;
  window.clearInterval(gameTimer);
  gameTimer = null;
  bubbles.forEach((bubble) => { bubble.disabled = true; });
  bubbleField.classList.remove("is-active");
  gameOverlay.hidden = false;
  gameOverlay.querySelector("span:last-child").textContent = "Time’s up! Lovely popping.";
  gameState.textContent = "ALL DONE";
  gameButton.innerHTML = '<span aria-hidden="true">↻</span> Play again';
  gameMessage.textContent = `You popped ${score} ${score === 1 ? "bubble" : "bubbles"}. That was a pretty good little break!`;
}

function startGame() {
  window.clearInterval(gameTimer);
  window.clearTimeout(feedbackTimer);
  score = 0;
  timeLeft = gameLength;
  active = true;
  updateGameStats();
  bubbles.forEach((bubble) => {
    bubble.disabled = false;
    bubble.classList.remove("popped");
  });
  gameOverlay.hidden = true;
  bubbleField.classList.add("is-active");
  gameState.textContent = "IN PLAY";
  gameButton.innerHTML = '<span aria-hidden="true">↻</span> Restart game';
  gameMessage.textContent = "You’ve got this! Pop away.";
  gameTimer = window.setInterval(() => {
    timeLeft -= 1;
    updateGameStats();
    if (timeLeft <= 0) finishGame();
  }, 1000);
}

function initializeMiniGames() {
  const moodFilters = [...document.querySelectorAll(".mood-filter")];
  const miniGameCards = [...document.querySelectorAll("[data-game-card]")];
  const miniGameGrid = document.querySelector("#mini-game-grid");
  const miniGameStage = document.querySelector("#mini-game-stage");
  const activeGameTitle = document.querySelector("#active-game-title");
  const activeGameInstructions = document.querySelector("#active-game-instructions");
  const activeGame = document.querySelector("#active-game");
  const activeGameStatus = document.querySelector("#active-game-status");
  const moodResults = document.querySelector("#mood-results");
  const closeMiniGame = document.querySelector("#close-mini-game");
  let currentMiniGame = null;
  let gameStateData = {};
  let lastLaunchButton = null;
  let memoryFlipTimer = null;
  let echoTimers = [];

  const gardenColors = [
    { name: "rose", value: "#dc7c83" },
    { name: "sunshine", value: "#e7ba4e" },
    { name: "sky", value: "#6da8ba" },
    { name: "lavender", value: "#a787bd" },
    { name: "leaf", value: "#83a16e" },
    { name: "peach", value: "#dc9561" }
  ];

  const wordRounds = [
    { word: "cloud", hint: "It might drift across the sky." },
    { word: "plant", hint: "A leafy friend that likes a little light." },
    { word: "smile", hint: "A small expression that can say a lot." },
    { word: "dream", hint: "A story your mind might tell while you sleep." },
    { word: "chair", hint: "A place to sit and take a pause." }
  ];

  const cloudRounds = [
    { name: "moon", icon: "☾" },
    { name: "flower", icon: "✿" },
    { name: "star", icon: "✦" },
    { name: "heart", icon: "♡" },
    { name: "leaf", icon: "❧" }
  ];

  const patternRounds = [
    { line: ["✿", "☾", "✦", "✿", "☾"], answer: "✦", choices: ["✦", "☀", "♡"] },
    { line: ["●", "▲", "●", "▲", "●"], answer: "▲", choices: ["■", "▲", "●"] },
    { line: ["☼", "☼", "☾", "☼", "☼"], answer: "☾", choices: ["☀", "☾", "✧"] },
    { line: ["◆", "◇", "◇", "◆", "◇"], answer: "◇", choices: ["◆", "◇", "○"] },
    { line: ["♧", "♤", "♡", "♧", "♤"], answer: "♡", choices: ["♢", "♡", "♤"] }
  ];

  function randomItem(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function shuffled(items) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [result[index], result[swap]] = [result[swap], result[index]];
    }
    return result;
  }

  function setGameStatus(message) {
    activeGameStatus.textContent = message;
  }

  function focusGameControl(selector = "button, input") {
    activeGame.querySelector(selector)?.focus();
  }

  function updateMoodFilter(mood) {
    moodFilters.forEach((filter) => {
      const selected = filter.dataset.mood === mood;
      filter.classList.toggle("is-selected", selected);
      filter.setAttribute("aria-pressed", String(selected));
    });
    let visibleCount = 0;
    miniGameCards.forEach((card) => {
      const visible = mood === "all" || card.dataset.moods.split(" ").includes(mood);
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    moodResults.textContent = `${visibleCount} ${visibleCount === 1 ? "small game" : "small games"} to explore`;
  }

  moodFilters.forEach((filter) => {
    filter.addEventListener("click", () => updateMoodFilter(filter.dataset.mood));
  });

  function launchMiniGame(id, button) {
    window.clearTimeout(memoryFlipTimer);
    echoTimers.forEach((timer) => window.clearTimeout(timer));
    echoTimers = [];
    currentMiniGame = id;
    lastLaunchButton = button;
    miniGameStage.hidden = false;
    miniGameGrid.hidden = true;
    const card = button.closest("[data-game-card]");
    activeGameTitle.textContent = card.querySelector("h3").textContent;
    activeGameInstructions.textContent = card.querySelector("p").textContent;
    activeGameStatus.textContent = "";
    gameStateData = {};
    renderMiniGame();
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    miniGameStage.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    activeGameTitle.focus({ preventScroll: true });
  }

  function closeMiniGamePanel() {
    window.clearTimeout(memoryFlipTimer);
    echoTimers.forEach((timer) => window.clearTimeout(timer));
    echoTimers = [];
    currentMiniGame = null;
    miniGameStage.hidden = true;
    miniGameGrid.hidden = false;
    if (lastLaunchButton?.closest("[data-game-card]").hidden) {
      moodFilters.find((filter) => filter.getAttribute("aria-pressed") === "true")?.focus();
    } else {
      lastLaunchButton?.focus();
    }
  }

  document.querySelectorAll("[data-launch-game]").forEach((button) => {
    button.addEventListener("click", () => launchMiniGame(button.dataset.launchGame, button));
  });
  closeMiniGame.addEventListener("click", closeMiniGamePanel);

  function renderMiniGame() {
    const renderers = {
      breath: renderBreathGame,
      color: renderColorGame,
      memory: renderMemoryGame,
      words: renderWordGame,
      echo: renderEchoGame,
      maze: renderMazeGame,
      cloud: renderCloudGame,
      story: renderStoryGame,
      odd: renderOddGame,
      pattern: renderPatternGame
    };
    renderers[currentMiniGame]?.();
  }

  function renderBreathGame() {
    if (gameStateData.done) {
      activeGame.innerHTML = '<div class="game-finish"><span aria-hidden="true">✿</span><p>You made space for five breaths. You can stay here, or head back whenever you like.</p><button class="mini-action" type="button" data-action="restart">Take another little pause</button></div>';
      setGameStatus("Breath Garden complete. Take all the time you need.");
      return;
    }
    const count = gameStateData.count || 0;
    activeGame.innerHTML = `<div class="breath-game"><div class="breath-orbit" aria-hidden="true"><span></span></div><p class="game-round">Breath ${count + 1} of 5 · at your own pace</p><button class="mini-action" type="button" data-action="breath-step">${count === 0 ? "Begin when ready" : "Ready for the next one"}</button></div>`;
    setGameStatus("Follow the circle if that feels comfortable. There is no need to change your breathing.");
  }

  function renderColorGame() {
    if (gameStateData.round >= 5) {
      activeGame.innerHTML = `<div class="game-finish"><span aria-hidden="true">●</span><p>You matched ${gameStateData.score} of 5 colors. That was enough time with the tide.</p><button class="mini-action" type="button" data-action="restart">Ride the current again</button></div>`;
      setGameStatus(`Color Current complete. ${gameStateData.score} of 5 matches.`);
      return;
    }
    if (!gameStateData.target) {
      gameStateData.round = 0;
      gameStateData.score = 0;
      gameStateData.target = randomItem(gardenColors);
    }
    activeGame.innerHTML = `<div class="color-game"><p class="game-round">Round ${gameStateData.round + 1} of 5</p><p class="color-prompt">Find the <strong>${gameStateData.target.name}</strong> tide</p><div class="color-target" style="--swatch:${gameStateData.target.value}" aria-hidden="true"></div><div class="color-choices" role="group" aria-label="Choose the matching color">${shuffled(gardenColors).map((color) => `<button class="color-choice" type="button" data-action="color-choice" data-color="${color.name}" aria-label="Choose ${color.name}" style="--swatch:${color.value}"></button>`).join("")}</div></div>`;
    setGameStatus(`Round ${gameStateData.round + 1} of 5. Find the ${gameStateData.target.name} color.`);
  }

  const memorySymbols = ["✿", "☾", "✦", "☼"];

  function renderMemoryGame() {
    if (gameStateData.pairs?.size === memorySymbols.length) {
      activeGame.innerHTML = `<div class="game-finish"><span aria-hidden="true">▦</span><p>You found all four pairs in ${gameStateData.turns} turns. Nice noticing.</p><button class="mini-action" type="button" data-action="restart">Play another round</button></div>`;
      setGameStatus(`Pocket Pairs complete in ${gameStateData.turns} turns.`);
      return;
    }
    if (!gameStateData.tiles) {
      gameStateData.tiles = shuffled([...memorySymbols, ...memorySymbols]);
      gameStateData.open = [];
      gameStateData.pairs = new Set();
      gameStateData.turns = 0;
      gameStateData.locked = false;
    }
    const open = gameStateData.open;
    activeGame.innerHTML = `<div class="memory-game"><p class="game-round">Pairs found: ${gameStateData.pairs.size} of 4 · turns: ${gameStateData.turns}</p><div class="memory-grid" role="group" aria-label="Memory tiles">${gameStateData.tiles.map((symbol, index) => {
      const revealed = open.includes(index) || gameStateData.pairs.has(symbol);
      return `<button class="memory-tile${revealed ? " is-revealed" : ""}" type="button" data-action="memory-tile" data-index="${index}" aria-label="${revealed ? `Tile ${index + 1}: ${symbol}` : `Hidden tile ${index + 1}`}" aria-pressed="${revealed}" ${revealed || gameStateData.locked ? "disabled" : ""}>${revealed ? symbol : "?"}</button>`;
    }).join("")}</div><button class="mini-action mini-action-secondary" type="button" data-action="restart">Start over</button></div>`;
    setGameStatus(`Pocket Pairs. ${gameStateData.pairs.size} pairs found; ${gameStateData.turns} turns taken.`);
  }

  function scramble(word) {
    let letters = shuffled([...word]);
    if (letters.join("") === word) letters = [...letters.slice(1), letters[0]];
    return letters.join(" · ");
  }

  function renderWordGame() {
    const round = gameStateData.round || 0;
    if (round >= wordRounds.length) {
      activeGame.innerHTML = '<div class="game-finish"><span aria-hidden="true">Aa</span><p>You untangled all five words. Let your mind wander wherever it wants next.</p><button class="mini-action" type="button" data-action="restart">Tangle some words again</button></div>';
      setGameStatus("Word Tangle complete. Five words unscrambled.");
      return;
    }
    const item = wordRounds[round];
    if (!gameStateData.scramble) gameStateData.scramble = scramble(item.word);
    activeGame.innerHTML = `<form class="word-game" data-action="word-submit"><p class="game-round">Word ${round + 1} of ${wordRounds.length}</p><p class="scrambled-word" aria-label="Scrambled letters">${gameStateData.scramble}</p><label for="word-answer">Your guess</label><div class="word-entry"><input id="word-answer" name="answer" autocomplete="off" autocapitalize="none" spellcheck="false"><button class="mini-action" type="submit">Check</button></div><button class="word-hint" type="button" data-action="word-hint">Give me a hint</button></form>`;
    setGameStatus(`Word ${round + 1} of ${wordRounds.length}. Unscramble the letters.`);
  }

  const echoNotes = [
    { symbol: "✿", name: "flower", color: "#e5a5a2" },
    { symbol: "☾", name: "moon", color: "#b7a4d3" },
    { symbol: "✦", name: "star", color: "#e9c36f" },
    { symbol: "☼", name: "sun", color: "#91b2a0" }
  ];

  function playEchoSequence() {
    const pads = [...activeGame.querySelectorAll("[data-action=echo-note]")];
    pads.forEach((pad) => { pad.disabled = true; });
    setGameStatus(`Round ${gameStateData.sequence.length}. Watch the ${gameStateData.sequence.length} garden ${gameStateData.sequence.length === 1 ? "note" : "notes"}.`);
    gameStateData.sequence.forEach((note, index) => {
      const onTimer = window.setTimeout(() => pads[note]?.classList.add("is-lit"), 500 + index * 850);
      const offTimer = window.setTimeout(() => pads[note]?.classList.remove("is-lit"), 1050 + index * 850);
      echoTimers.push(onTimer, offTimer);
    });
    const enableTimer = window.setTimeout(() => {
      pads.forEach((pad) => { pad.disabled = false; });
      gameStateData.echoIndex = 0;
      setGameStatus(`Your turn: repeat ${gameStateData.sequence.length} garden ${gameStateData.sequence.length === 1 ? "note" : "notes"}.`);
    }, 500 + gameStateData.sequence.length * 850);
    echoTimers.push(enableTimer);
  }

  function renderEchoGame(shouldPlay = true) {
    if (gameStateData.done) {
      activeGame.innerHTML = `<div class="game-finish"><span aria-hidden="true">♫</span><p>You echoed ${gameStateData.sequence.length} notes. The garden can keep growing another time.</p><button class="mini-action" type="button" data-action="restart">Grow another echo</button></div>`;
      setGameStatus("Echo Garden complete. Sequence repeated.");
      return;
    }
    if (!gameStateData.sequence) gameStateData.sequence = [Math.floor(Math.random() * echoNotes.length)];
    activeGame.innerHTML = `<div class="echo-game"><p class="game-round">Echo ${gameStateData.sequence.length} of 5</p><div class="echo-pads" role="group" aria-label="Garden notes">${echoNotes.map((note, index) => `<button class="echo-pad" type="button" data-action="echo-note" data-note="${index}" aria-label="${note.name}" style="--pad-color:${note.color}" ${shouldPlay || gameStateData.echoIndex === undefined ? "disabled" : ""}><span aria-hidden="true">${note.symbol}</span></button>`).join("")}</div><button class="mini-action mini-action-secondary" type="button" data-action="restart">Start over</button></div>`;
    if (shouldPlay) playEchoSequence();
  }

  const mazeWalls = new Set(["1,1", "1,2", "2,3", "3,0", "3,1"]);
  const directions = {
    up: [-1, 0],
    down: [1, 0],
    left: [0, -1],
    right: [0, 1]
  };

  function renderMazeGame() {
    if (!gameStateData.position) gameStateData.position = [0, 0];
    const [row, column] = gameStateData.position;
    const won = row === 4 && column === 4;
    if (won) {
      activeGame.innerHTML = '<div class="game-finish"><span aria-hidden="true">★</span><p>You found the garden gate. Take the route you need from here.</p><button class="mini-action" type="button" data-action="restart">Wander the maze again</button></div>';
      setGameStatus("Little Maze complete. You reached the garden gate.");
      return;
    }
    activeGame.innerHTML = `<div class="maze-game"><p class="game-round">Use the arrows to find the flower gate</p><div class="maze-grid" role="group" aria-label="Five by five garden maze">${Array.from({ length: 5 }, (_, r) => Array.from({ length: 5 }, (_, c) => {
      const wall = mazeWalls.has(`${r},${c}`);
      const here = r === row && c === column;
      const goal = r === 4 && c === 4;
      return `<button type="button" class="maze-cell${wall ? " is-wall" : ""}${here ? " is-player" : ""}" data-action="maze-cell" data-row="${r}" data-column="${c}" aria-label="${here ? "Your position" : goal ? "Flower gate" : wall ? "Garden wall" : `Path, row ${r + 1}, column ${c + 1}`}" ${wall ? "disabled" : ""}>${here ? "★" : goal ? "✿" : ""}</button>`;
    }).join("")).join("")}</div><div class="maze-controls" role="group" aria-label="Maze movement"><button type="button" data-action="maze-move" data-direction="up" aria-label="Move up">↑</button><span><button type="button" data-action="maze-move" data-direction="left" aria-label="Move left">←</button><button type="button" data-action="maze-move" data-direction="down" aria-label="Move down">↓</button><button type="button" data-action="maze-move" data-direction="right" aria-label="Move right">→</button></span></div><button class="mini-action mini-action-secondary" type="button" data-action="restart">Start over</button></div>`;
    setGameStatus(`Your position is row ${row + 1}, column ${column + 1}.`);
  }

  function moveMaze(direction) {
    const [deltaRow, deltaColumn] = directions[direction] || [0, 0];
    const [row, column] = gameStateData.position;
    const nextRow = row + deltaRow;
    const nextColumn = column + deltaColumn;
    if (nextRow < 0 || nextRow > 4 || nextColumn < 0 || nextColumn > 4 || mazeWalls.has(`${nextRow},${nextColumn}`)) {
      setGameStatus("A garden wall is in the way. Try another direction.");
      return;
    }
    gameStateData.position = [nextRow, nextColumn];
    renderMazeGame();
    activeGame.querySelector(`[data-action="maze-move"][data-direction="${direction}"]`)?.focus();
  }

  function renderCloudGame() {
    if (!gameStateData.target) {
      gameStateData.round = 0;
      gameStateData.score = 0;
      gameStateData.target = cloudRounds[0];
    }
    if (gameStateData.round >= 5) {
      activeGame.innerHTML = `<div class="game-finish"><span aria-hidden="true">☁</span><p>You matched ${gameStateData.score} of 5 clouds. Thanks for taking a soft minute.</p><button class="mini-action" type="button" data-action="restart">Watch the clouds again</button></div>`;
      setGameStatus(`Cloud Match complete. ${gameStateData.score} of 5 matches.`);
      return;
    }
    const choices = shuffled([gameStateData.target, ...shuffled(cloudRounds.filter((item) => item !== gameStateData.target)).slice(0, 2)]);
    gameStateData.choices = choices;
    activeGame.innerHTML = `<div class="cloud-game"><p class="game-round">Cloud ${gameStateData.round + 1} of 5</p><p class="cloud-prompt">Find the <strong>${gameStateData.target.name}</strong> in the clouds</p><div class="cloud-choices" role="group" aria-label="Choose the matching cloud">${choices.map((cloud, index) => `<button class="cloud-choice" type="button" data-action="cloud-choice" data-choice="${index}" aria-label="${cloud.name} cloud">${cloud.icon}</button>`).join("")}</div></div>`;
    setGameStatus(`Cloud ${gameStateData.round + 1} of 5. Find the ${gameStateData.target.name}.`);
  }

  const storyBeats = [
    { prompt: "On a quiet afternoon, a small", options: ["fox", "robot", "cloud"] },
    { prompt: "wandered into a", options: ["secret garden", "tiny boat", "sleepy library"] },
    { prompt: "and", options: ["paused for tea", "followed the stars", "found a sunny spot to rest"] }
  ];

  function renderStoryGame() {
    const picks = gameStateData.picks || [];
    if (picks.length === storyBeats.length) {
      activeGame.innerHTML = `<div class="game-finish story-finish"><span aria-hidden="true">✎</span><p class="story-result"></p><p>This little story belongs to you. Keep it, share it, or leave it unfinished.</p><button class="mini-action" type="button" data-action="restart">Grow another story</button></div>`;
      activeGame.querySelector(".story-result").textContent = `On a quiet afternoon, a small ${picks[0]} wandered into a ${picks[1]} and ${picks[2]}.`;
      setGameStatus("Your tiny story is ready. It does not need to be shared.");
      return;
    }
    const beat = storyBeats[picks.length];
    activeGame.innerHTML = `<div class="story-game"><p class="game-round">Story seed ${picks.length + 1} of 3</p><p class="story-prompt">${beat.prompt}…</p><div class="story-options" role="group" aria-label="Choose a story word">${beat.options.map((option, index) => `<button class="mini-action mini-action-secondary" type="button" data-action="story-pick" data-option="${index}">${option}</button>`).join("")}</div></div>`;
    setGameStatus(`Story seed ${picks.length + 1} of 3. Choose any word that appeals.`);
  }

  const oddSymbols = [
    { name: "flower", icon: "✿" },
    { name: "star", icon: "✦" },
    { name: "moon", icon: "☾" },
    { name: "sun", icon: "☼" }
  ];

  function renderOddGame() {
    if (gameStateData.round >= 5) {
      activeGame.innerHTML = `<div class="game-finish"><span aria-hidden="true">⌕</span><p>You found the different symbol ${gameStateData.score} out of 5 times. Good looking.</p><button class="mini-action" type="button" data-action="restart">Look again</button></div>`;
      setGameStatus(`Find the Odd One complete. ${gameStateData.score} of 5 found.`);
      return;
    }
    if (gameStateData.answer === undefined) {
      gameStateData.round = 0;
      gameStateData.score = 0;
      gameStateData.answer = Math.floor(Math.random() * 9);
      gameStateData.base = randomItem(oddSymbols);
      gameStateData.different = randomItem(oddSymbols.filter((symbol) => symbol !== gameStateData.base));
    }
    const tiles = Array.from({ length: 9 }, (_, index) => index === gameStateData.answer ? gameStateData.different : gameStateData.base);
    activeGame.innerHTML = `<div class="odd-game"><p class="game-round">Look ${gameStateData.round + 1} of 5</p><p class="odd-prompt">Find the one that isn’t a <strong>${gameStateData.base.name}</strong>.</p><div class="odd-grid" role="group" aria-label="Find the different symbol">${tiles.map((symbol, index) => `<button class="odd-tile" type="button" data-action="odd-tile" data-index="${index}" aria-label="Tile ${index + 1}: ${symbol.name}">${symbol.icon}</button>`).join("")}</div></div>`;
    setGameStatus(`Look ${gameStateData.round + 1} of 5. Find the one that is not a ${gameStateData.base.name}.`);
  }

  function renderPatternGame() {
    if (gameStateData.score === undefined) gameStateData.score = 0;
    const round = gameStateData.round || 0;
    if (round >= patternRounds.length) {
      activeGame.innerHTML = `<div class="game-finish"><span aria-hidden="true">✧</span><p>You lit ${gameStateData.score} of 5 lanterns. Every pattern is a little practice in noticing.</p><button class="mini-action" type="button" data-action="restart">Light the lanterns again</button></div>`;
      setGameStatus(`Pattern Lanterns complete. ${gameStateData.score} of 5 solved.`);
      return;
    }
    const pattern = patternRounds[round];
    activeGame.innerHTML = `<div class="pattern-game"><p class="game-round">Lantern ${round + 1} of ${patternRounds.length}</p><p class="game-round">What comes next?</p><div class="pattern-line" aria-label="Pattern">${pattern.line.map((icon) => `<span aria-hidden="true">${icon}</span>`).join("")}<span class="pattern-gap" aria-label="missing">?</span></div><div class="pattern-choices" role="group" aria-label="Choose the next lantern">${shuffled(pattern.choices).map((choice) => `<button class="pattern-choice" type="button" data-action="pattern-choice" data-choice="${choice}" aria-label="Choose ${choice}">${choice}</button>`).join("")}</div></div>`;
    setGameStatus(`Lantern ${round + 1} of 5. Choose what completes the pattern.`);
  }

  function renderNewRoundAndFocus() {
    renderMiniGame();
    focusGameControl();
  }

  function handleMiniGameAction(event) {
    const control = event.target.closest("[data-action]");
    if (!control || !activeGame.contains(control)) return;
    const action = control.dataset.action;
    if (action === "word-submit" && event.type !== "submit") return;

    if (action === "restart") {
      window.clearTimeout(memoryFlipTimer);
      echoTimers.forEach((timer) => window.clearTimeout(timer));
      echoTimers = [];
      gameStateData = {};
      renderMiniGame();
      focusGameControl();
      return;
    }
    if (action === "breath-step") {
      gameStateData.count = (gameStateData.count || 0) + 1;
      gameStateData.done = gameStateData.count >= 5;
      renderNewRoundAndFocus();
    } else if (action === "color-choice") {
      if (control.dataset.color === gameStateData.target.name) {
        gameStateData.score += 1;
        setGameStatus("That’s the one. The next color is ready.");
      } else {
        setGameStatus(`That was ${control.dataset.color}; the tide was ${gameStateData.target.name}. No worries.`);
      }
      gameStateData.round += 1;
      gameStateData.target = gameStateData.round < 5 ? randomItem(gardenColors.filter((color) => color !== gameStateData.target)) : null;
      renderNewRoundAndFocus();
    } else if (action === "memory-tile") {
      if (gameStateData.locked) return;
      const index = Number(control.dataset.index);
      if (gameStateData.open.includes(index) || gameStateData.pairs.has(gameStateData.tiles[index])) return;
      gameStateData.open.push(index);
      if (gameStateData.open.length === 2) {
        gameStateData.turns += 1;
        const [first, second] = gameStateData.open;
        if (gameStateData.tiles[first] === gameStateData.tiles[second]) {
          gameStateData.pairs.add(gameStateData.tiles[first]);
          gameStateData.open = [];
          setGameStatus(`A match. ${gameStateData.pairs.size} of 4 pairs found.`);
        } else {
          gameStateData.locked = true;
          setGameStatus("Not a pair this time. The tiles will turn back over.");
          renderMemoryGame();
          memoryFlipTimer = window.setTimeout(() => {
            gameStateData.open = [];
            gameStateData.locked = false;
            renderMemoryGame();
            focusGameControl(".memory-tile:not(:disabled)");
          }, 800);
          return;
        }
      }
      renderMemoryGame();
      focusGameControl(".memory-tile:not(:disabled)");
    } else if (action === "word-submit") {
      event.preventDefault();
      const answer = new FormData(control).get("answer").trim().toLowerCase();
      const item = wordRounds[gameStateData.round || 0];
      if (answer === item.word) {
        gameStateData.round = (gameStateData.round || 0) + 1;
        gameStateData.scramble = null;
        renderNewRoundAndFocus();
      } else {
        setGameStatus("Not quite. Try another arrangement, or ask for a hint.");
        control.querySelector("input").focus();
      }
    } else if (action === "word-hint") {
      setGameStatus(wordRounds[gameStateData.round || 0].hint);
    } else if (action === "echo-note") {
      if (gameStateData.echoIndex === undefined) return;
      const note = Number(control.dataset.note);
      if (note !== gameStateData.sequence[gameStateData.echoIndex]) {
        echoTimers.forEach((timer) => window.clearTimeout(timer));
        echoTimers = [];
        gameStateData.echoIndex = undefined;
        renderEchoGame(false);
        const replay = document.createElement("button");
        replay.className = "mini-action";
        replay.type = "button";
        replay.dataset.action = "echo-replay";
        replay.textContent = "Try that sequence again";
        activeGame.querySelector(".echo-game").append(replay);
        setGameStatus("That was a different note. You can listen again whenever you're ready.");
        replay.focus();
        return;
      }
      gameStateData.echoIndex += 1;
      if (gameStateData.echoIndex === gameStateData.sequence.length) {
        if (gameStateData.sequence.length >= 5) {
          gameStateData.done = true;
          renderMiniGame();
        } else {
          gameStateData.sequence.push(Math.floor(Math.random() * echoNotes.length));
          renderMiniGame();
          activeGameStatus.focus();
        }
      } else {
        setGameStatus(`${gameStateData.echoIndex} of ${gameStateData.sequence.length} notes repeated.`);
      }
    } else if (action === "echo-replay") {
      renderEchoGame();
    } else if (action === "maze-move") {
      moveMaze(control.dataset.direction);
    } else if (action === "maze-cell") {
      const row = Number(control.dataset.row);
      const column = Number(control.dataset.column);
      const [currentRow, currentColumn] = gameStateData.position || [0, 0];
      const deltaRow = row - currentRow;
      const deltaColumn = column - currentColumn;
      const direction = Object.entries(directions).find(([, delta]) => delta[0] === deltaRow && delta[1] === deltaColumn)?.[0];
      if (direction) moveMaze(direction);
    } else if (action === "cloud-choice") {
      const chosen = gameStateData.choices[Number(control.dataset.choice)];
      if (chosen === gameStateData.target) {
        gameStateData.score += 1;
        setGameStatus("You found the matching cloud.");
      } else {
        setGameStatus(`That was a ${chosen.name}; this round was looking for a ${gameStateData.target.name}.`);
      }
      gameStateData.round += 1;
      gameStateData.target = cloudRounds[gameStateData.round % cloudRounds.length];
      renderNewRoundAndFocus();
    } else if (action === "story-pick") {
      const beat = storyBeats[gameStateData.picks?.length || 0];
      const picks = gameStateData.picks || [];
      picks.push(beat.options[Number(control.dataset.option)]);
      gameStateData.picks = picks;
      renderNewRoundAndFocus();
    } else if (action === "odd-tile") {
      if (Number(control.dataset.index) === gameStateData.answer) {
        gameStateData.score += 1;
        setGameStatus("You spotted it. Here’s another one.");
      } else {
        setGameStatus("Not that one. Take another look.");
      }
      gameStateData.round += 1;
      gameStateData.answer = gameStateData.round < 5 ? Math.floor(Math.random() * 9) : null;
      gameStateData.base = gameStateData.round < 5 ? randomItem(oddSymbols) : null;
      gameStateData.different = gameStateData.round < 5 ? randomItem(oddSymbols.filter((symbol) => symbol !== gameStateData.base)) : null;
      renderNewRoundAndFocus();
    } else if (action === "pattern-choice") {
      if (control.dataset.choice === patternRounds[gameStateData.round || 0].answer) {
        gameStateData.score = (gameStateData.score || 0) + 1;
        setGameStatus("That completes it. On to the next pattern.");
      } else {
        setGameStatus("Not this time. Here’s a fresh pattern to try.");
      }
      gameStateData.round = (gameStateData.round || 0) + 1;
      renderNewRoundAndFocus();
    }
  }

  activeGame.addEventListener("click", handleMiniGameAction);
  activeGame.addEventListener("submit", handleMiniGameAction);
  activeGame.addEventListener("keydown", (event) => {
    if (currentMiniGame !== "maze") return;
    const direction = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", w: "up", s: "down", a: "left", d: "right" }[event.key];
    if (direction) {
      event.preventDefault();
      moveMaze(direction);
    }
  });
}

initializeMiniGames();
gameButton.addEventListener("click", startGame);

bubbles.forEach((bubble) => {
  bubble.addEventListener("click", () => {
    if (!active || bubble.disabled) return;
    bubble.disabled = true;
    bubble.classList.add("popped");
    score += 1;
    updateGameStats();
    popFeedback.classList.remove("show");
    void popFeedback.offsetWidth;
    popFeedback.classList.add("show");
    window.clearTimeout(feedbackTimer);
    feedbackTimer = window.setTimeout(() => popFeedback.classList.remove("show"), 700);
    if (bubbles.every((item) => item.disabled)) {
      gameMessage.textContent = "Lovely! You popped every bubble. Let’s refill the playground!";
      bubbles.forEach((item) => {
        item.disabled = false;
        item.classList.remove("popped");
      });
    }
    bubbles.find((item) => !item.disabled)?.focus();
  });
});

updateGameStats();
