// Constants for API endpoints
var randomWordEndpoint = "https://www.wordgamedb.com/api/v1/words/random";

// Game state variables
var currentWord;
var guessedLetters;
var remainingAttempts;
var maxAttempts = 6;
var incorrectGuesses = 0; // Track incorrect guesses
var hintUsed = false; // Track if hint is used

// DOM elements
var wordDisplay = document.getElementById("word-display");
var hintDisplay = document.getElementById("hint-display");
var hintIcon = document.getElementById("hint-icon");
var hintTip = document.createElement("div");
hintTip.id = "hint-tip";
hintTip.textContent = "Press the hint button to get a hint!";
hintIcon.parentElement.appendChild(hintTip);

var attemptsDisplay = document.getElementById("attempts-display");
var lettersDisplay = document.getElementById("letters-display");
var messageDisplay = document.getElementById("message-display");
var playAgainButton = document.getElementById("play-again-button");
var modalPlayAgainButton = document.getElementById("modal-play-again-button");
var gameContainer = document.getElementById("game-container");
var animationContainer = document.getElementById("animation-container");
var modal = document.getElementById("modal");
var winningAnimation = document.getElementById("winning-animation");
var guessedWordDisplay = document.getElementById("guessed-word-display");
var backgroundMusic = document.getElementById("background-music");
var muteButton = document.getElementById("mute-button");
var correctSound = document.getElementById("correct-sound");
var wrongSound = document.getElementById("wrong-sound");
var roundWinSound = new Audio("../sounds/roundWon.wav"); // Add round win sound
var roundLostSound = new Audio("../sounds/roundLost.mp3"); // Add round lost sound

// Function to fetch a random word
function fetchRandomWord() {
  fetch(randomWordEndpoint)
    .then(function (response) {
      return response.json();
    })
    .then(function (word) {
      currentWord = word.word.toLowerCase();
      var hint = word.hint;
      startGame(currentWord, hint);
    })
    .catch(function (error) {
      console.error("Error fetching random word:", error);
      messageDisplay.textContent =
        "Error fetching random word. Please try again.";
    });
}

// Function to start a new game with a specific word and hint
function startGame(word, hint) {
  guessedLetters = [];
  remainingAttempts = maxAttempts;
  incorrectGuesses = 0; // Reset incorrect guesses
  hintUsed = false; // Reset hint usage
  hintDisplay.textContent = hint;
  updateWordDisplay();
  updateAttemptsDisplay();
  updateLettersDisplay();
  messageDisplay.textContent = "";
  enableLetterButtons();
  playAgainButton.style.display = "none"; // Hide play again button at the start
  modal.style.display = "none"; // Ensure modal is hidden
  hintDisplay.style.display = "none"; // Ensure hint is hidden
  attemptsDisplay.style.display = "block"; // Show attempts remaining
  muteButton.style.display = "block"; // Show mute/unmute button
}

// Function to handle letter guesses
function handleLetterGuess(letter) {
  if (guessedLetters.includes(letter)) return;

  guessedLetters.push(letter);

  if (currentWord.includes(letter)) {
    correctSound.play();
    updateWordDisplay();
    if (checkWin()) {
      messageDisplay.textContent = "You won!";
      disableAllButtons();
      guessedWordDisplay.textContent =
        "You guessed: " + currentWord.toUpperCase();
      playWinningAnimation();
    }
  } else {
    wrongSound.play();
    remainingAttempts--;
    incorrectGuesses++; // Increment incorrect guesses
    updateHangmanGraphic(); // Update hangman graphic
    updateAttemptsDisplay();
    if (incorrectGuesses === 3 && !hintUsed) {
      showHintTip();
    }
    if (remainingAttempts === 0) {
      messageDisplay.textContent =
        "You lost! The word was: " + currentWord.toUpperCase();
      disableAllButtons();
      guessedWordDisplay.textContent =
        "The word was: " + currentWord.toUpperCase();
      playLosingAnimation();
    }
  }

  // Disable the guessed letter button and change its style
  var letterButton = document.getElementById("letter-" + letter);
  letterButton.disabled = true;
  letterButton.classList.add("letter-disabled");
}

// Function to update the hangman graphic
function updateHangmanGraphic() {
  var errorImage = document.getElementById("error" + incorrectGuesses);
  if (errorImage) {
    errorImage.classList.add("show");
    setTimeout(function () {
      errorImage.classList.remove("show");
      errorImage.classList.add("hide");
      setTimeout(function () {
        errorImage.classList.remove("hide");
        errorImage.style.display = "none";
      }, 1000);
    }, 3000);
  }
}

// Function to update the displayed word
function updateWordDisplay() {
  var display = currentWord
    .split("")
    .map(function (letter) {
      return guessedLetters.includes(letter) ? letter : "_";
    })
    .join(" ");
  wordDisplay.textContent = display;
}

// Function to update the attempts display
function updateAttemptsDisplay() {
  attemptsDisplay.textContent = "Attempts remaining: " + remainingAttempts;
}

// Function to update the letters display
function updateLettersDisplay() {
  var alphabet = "abcdefghijklmnopqrstuvwxyz";
  lettersDisplay.innerHTML = "";
  alphabet.split("").forEach(function (letter) {
    var button = document.createElement("button");
    button.textContent = letter;
    button.id = "letter-" + letter;
    button.classList.add("letter-button");
    button.addEventListener("click", function () {
      handleLetterGuess(letter);
    });
    lettersDisplay.appendChild(button);
  });
}

// Function to check if the game is won
function checkWin() {
  return currentWord.split("").every(function (letter) {
    return guessedLetters.includes(letter);
  });
}

// Function to disable all letter buttons
function disableAllButtons() {
  var letterButtons = document.querySelectorAll(".letter-button");
  letterButtons.forEach(function (button) {
    button.disabled = true;
  });
}

// Function to enable all letter buttons
function enableLetterButtons() {
  var letterButtons = document.querySelectorAll(".letter-button");
  letterButtons.forEach(function (button) {
    button.disabled = false;
    button.classList.remove("letter-disabled");
  });
}

// Event listener for the play again button
playAgainButton.addEventListener("click", function () {
  location.reload(); // Reload the page to start the game again
});

// Event listener for the modal play again button
modalPlayAgainButton.addEventListener("click", function () {
  hideModal();
  location.reload(); // Reload the page to start the game again
});

// Function to play the winning animation
function playWinningAnimation() {
  showModal();
  backgroundMusic.pause(); // Stop the background music
  roundWinSound.play(); // Play the round win sound
  var astronautAnim = lottie.loadAnimation({
    container: winningAnimation,
    renderer: "svg",
    loop: true, // Make the animation loop
    autoplay: true,
    path: "../animations/dancingAstronaut.json",
  });

  astronautAnim.addEventListener("complete", function () {
    animationContainer.classList.add("fade-out");
    setTimeout(function () {
      animationContainer.style.display = "none";
      animationContainer.classList.remove("fade-out");
    }, 1000);
  });
}

// Function to play the losing animation
function playLosingAnimation() {
  showModal();
  backgroundMusic.pause(); // Stop the background music
  roundLostSound.play(); // Play the round lost sound
  var anim = lottie.loadAnimation({
    container: winningAnimation,
    renderer: "svg",
    loop: true, // Make the animation loop
    autoplay: true,
    path: "../animations/cryingAstronaut.json",
  });

  anim.addEventListener("complete", function () {
    animationContainer.classList.add("fade-out");
    setTimeout(function () {
      animationContainer.style.display = "none";
      animationContainer.classList.remove("fade-out");
    }, 1000);
  });
}

// Function to show the hint tip
function showHintTip() {
  hintTip.classList.add("show");
  setTimeout(function () {
    hintTip.classList.remove("show");
    hintTip.classList.add("hide");
    setTimeout(function () {
      hintTip.classList.remove("hide");
      hintTip.style.display = "none";
    }, 1000);
  }, 4000);
}

// Function to show the modal
function showModal() {
  modal.style.display = "flex";
  // Add a backdrop to prevent clicks outside the modal
  var backdrop = document.createElement("div");
  backdrop.className = "modal-backdrop";
  document.body.appendChild(backdrop);
}

// Function to hide the modal
function hideModal() {
  modal.style.display = "none";
  var backdrop = document.querySelector(".modal-backdrop");
  if (backdrop) {
    backdrop.remove();
  }
}

// Event listener for hint icon
hintIcon.addEventListener("click", function () {
  hintDisplay.style.display = "block";
  hintUsed = true; // Mark that hint is used
  setTimeout(function () {
    hintDisplay.style.display = "none";
  }, 3000);
});

// Initialize the game with a random word when the page loads
document.addEventListener("DOMContentLoaded", function () {
  backgroundMusic.volume = 0.1; // Set background music volume to 10%
  backgroundMusic.play().catch(function (error) {
    console.error("Error playing background music:", error);
  }); // Play background music
  correctSound.load(); // Preload correct sound
  wrongSound.load(); // Preload wrong sound
  attemptsDisplay.style.display = "none"; // Hide attempts remaining
  muteButton.style.display = "none"; // Hide mute/unmute button
  fetchRandomWord(); // Fetch a random word initially
});

// Event listener for mute button
muteButton.addEventListener("click", function () {
  if (backgroundMusic.muted) {
    backgroundMusic.muted = false;
    muteButton.textContent = "Mute 🔈";
  } else {
    backgroundMusic.muted = true;
    muteButton.textContent = "Unmute 🔊";
  }
});
