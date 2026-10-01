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
  });
});

updateGameStats();
