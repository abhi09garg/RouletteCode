let wallet = 1000;
let currentBet = null;

const walletDisplay = document.getElementById("wallet");
const resultMessage = document.getElementById("result-message");


const wheel = document.getElementById("roulette-wheel");

// Numbers on the wheel
const numbers = [
  0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24,
  16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26,
];

const angleStep = 360 / numbers.length; // Angle for each slot
const radius = 100; // Radius for the ball's circular path

// Add number labels to the wheel
numbers.forEach((num, index) => {
  const angle = index * angleStep; // Angle for each number
  const radians = (angle * Math.PI) / 180;
  const x = Math.cos(radians) * radius;
  const y = Math.sin(radians) * radius;

  const label = document.createElement("div");
  label.classList.add("number-label");
  label.style.left = `calc(50% + ${x}px - 10px)`; // Align the number properly
  label.style.top = `calc(50% - ${y}px - 10px)`;
  label.style.transform = `rotate(${angle}deg)`;
  label.textContent = num;
  wheel.appendChild(label);
});

// Create the ball
const ball = document.createElement("div");
ball.classList.add("ball");
wheel.appendChild(ball);

// Function to spin the ball and land on a specific number
function spinBall(winningNumber) {
  const winningIndex = numbers.indexOf(winningNumber);
  const winningAngle = winningIndex * angleStep; // Calculate the angle for the winning number
  let currentAngle = 0; // Starting angle for spinning
  const totalSpins = 3; // Number of spins before stopping
  const totalRotation = 360 * totalSpins + winningAngle; // Final total angle

  // Spin the ball
  let rotation = 0;
  const spinInterval = setInterval(() => {
    rotation += 10; // Increment the rotation
    if (rotation >= totalRotation) {
      rotation = winningAngle; // Stop at the winning angle
      clearInterval(spinInterval);
    }

    // Position the ball on its path
    const radians = (rotation * Math.PI) / 180;
    const x = Math.cos(radians) * radius;
    const y = Math.sin(radians) * radius;

    ball.style.left = `calc(50% + ${x}px - 7.5px)`; // Center the ball properly
    ball.style.top = `calc(50% - ${y}px - 7.5px)`;
  }, 20);
}

// Test spin on a specific number (e.g., 7)
spinBall(7);





document.getElementById("place-bet").addEventListener("click", placeBet);

function placeBet() {
  const betType = document.getElementById("bet-type").value;
  const betNumber = parseInt(document.getElementById("bet-number").value);
  const betAmount = parseInt(document.getElementById("bet-amount").value);

  if (isNaN(betAmount) || betAmount < 10) {
    resultMessage.textContent = "Invalid bet amount! Minimum is $10.";
    return;
  }

  if (wallet < betAmount) {
    resultMessage.textContent = "Insufficient balance!";
    return;
  }

  if (betType === "number" && (isNaN(betNumber) || betNumber < 0 || betNumber > 36)) {
    resultMessage.textContent = "Invalid number! Choose between 0 and 36.";
    return;
  }

  currentBet = { betType, betNumber, betAmount };
  spinWheel();
}

function spinWheel() {
  const winningNumber = Math.floor(Math.random() * 37); // Random number 0-36
  const isRed = winningNumber % 2 !== 0 && winningNumber !== 0; // Determine red/black
  const winningType = isRed ? "red" : winningNumber === 0 ? "green" : "black";

  animateWheel(winningNumber);

  setTimeout(() => {
    calculateResult(winningNumber, winningType);
  }, 3000); // Wait for animation
}

function calculateResult(winningNumber, winningType) {
  const { betType, betNumber, betAmount } = currentBet;

  let win = false;
  if (betType === "number" && winningNumber === betNumber) win = true;
  else if (betType === winningType) win = true;

  if (win) {
    const winnings = betType === "number" ? betAmount * 35 : betAmount * 2;
    wallet += winnings;
    resultMessage.textContent = `You win! Winning number: ${winningNumber} (${winningType}). You won $${winnings}.`;
  } else {
    wallet -= betAmount;
    resultMessage.textContent = `You lose! Winning number: ${winningNumber} (${winningType}). You lost $${betAmount}.`;
  }

  walletDisplay.textContent = wallet;
}

function animateWheel(winningNumber) {
  const anglePerSlot = 360 / 37;
  const winningAngle = winningNumber * anglePerSlot;

  wheel.style.transition = "transform 3s ease-out";
  wheel.style.transform = `rotate(${360 * 5 - winningAngle}deg)`;

  ball.style.transition = "transform 3s ease-out";
  ball.style.transform = `rotate(${360 * 5 + winningAngle}deg)`;
}
