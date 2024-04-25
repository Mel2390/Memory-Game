document.addEventListener('DOMContentLoaded', function () {
  const colors = ['aquamarine', 'blue','yellow' ,'green','orange'];
  const game = document.getElementById('game');
  const startBtn = document.getElementById('startBtn');
  const restartBtn = document.getElementById('restartBtn');
  const scoreDisplay = document.getElementById('score');
  const bestScoreDisplay = document.getElementById('bestScore');
  let cards = [];
  let turnedCards = [];
  let lockBoard = false;
  let matches = 0;
  let score = 0;
  let bestScore = localStorage.getItem('bestScore') || '-';

  startBtn.addEventListener('click', startGame);
  restartBtn.addEventListener('click', restartGame);

  function startGame() {
    startBtn.disabled = true;
    restartBtn.disabled = false;
    game.innerHTML = '';
    cards = createCards();
    turnedCards = [];
    lockBoard = false;
    matches = 0;
    score = 0;
    scoreDisplay.textContent = 'Score: 0';
    updateBestScore();
    shuffleCards(cards);
    displayCards(cards);
  }

  function restartGame() {
    startGame();
  }

  function createCards() {
    const pairs = colors.concat(colors);
    return pairs.map(color => createCard(color));
  }

  function createCard(color) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.color = color;
    card.addEventListener('click', flipCard);
    return card;
  }

  function flipCard() {
    if (lockBoard || this === turnedCards[0]) return;

    this.classList.add('flipped');
    this.style.backgroundColor = this.dataset.color;

    if (turnedCards.length === 0) {
      turnedCards.push(this);
    } else if (turnedCards.length === 1) {
      turnedCards.push(this);
      checkMatch();
      
    }
  }

  function checkMatch() {
    const card1 = turnedCards[0];
    const card2 = turnedCards[1];

    if (card1.dataset.color === card2.dataset.color) {
      cardMatch(card1, card2);
      incrementScore();
    } else {
      noMatch(card1, card2);
    }
  }

  function cardMatch(card1, card2) {
    card1.removeEventListener('click', flipCard);
    card2.removeEventListener('click', flipCard);
    card1.classList.add('matched');
    card2.classList.add('matched');
    turnedCards = [];
    matches++;

    if (matches === colors.length) {
      gameOver();
    }
  }

  function noMatch(card1, card2) {
    lockBoard = true;
    setTimeout(() => {
      card1.style.backgroundColor = '#af4c82';
      card2.style.backgroundColor = '';

      

      turnedCards = [];
      lockBoard = false;
    }, 1000);
  }

  function incrementScore() {
     score++;
     
    scoreDisplay.textContent = `Score: ${score}`;
  
  }

  function updateBestScore() {
    if (bestScore === '-' || score < bestScore) {
      bestScore = score;
      bestScoreDisplay.textContent = `Best Score: ${bestScore}`;
      localStorage.setItem('bestScore', bestScore);
    }
  }

  function gameOver() {
    startBtn.disabled = false;
    restartBtn.disabled = false;
    updateBestScore();
  }

  function shuffleCards(cards) {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
  }

  function displayCards(cards) {
    cards.forEach(card => game.appendChild(card));
  }
});

