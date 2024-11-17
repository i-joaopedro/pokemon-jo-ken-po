const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score_points"),
  },
  cardSprites: {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },

  fieldCards: {
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  playerSides: {
    player: "player-cards",
    playerBox: document.querySelector("#player-cards"),
    computer: "computer-cards",
    computerBox: document.querySelector("#computer-cards"),
  },
  actions: {
    button: document.getElementById("next-duel"),
  },
};

const pathImages = "./src/assets/icons/";

const cardData = [
  {
    id: 0,
    name: "Dragonite",
    type: "Paper",
    img: `${pathImages}dragonite.jpg`,
    WinOf: [1, 4, 7, 8],
    LoseOf: [2, 3, 10],
  },
  {
    id: 1,
    name: "Electabuzz",
    type: "Rock",
    img: `${pathImages}electabuzz.png`,
    WinOf: [2, 3, 10],
    LoseOf: [0, 5, 6, 9],
  },
  {
    id: 2,
    name: "Exeggutor",
    type: "Scissors",
    img: `${pathImages}exeggutor.png`,
    WinOf: [0, 5, 6, 9],
    LoseOf: [1, 4, 7, 8],
  },
  {
    id: 3,
    name: "Flareon",
    type: "Scissors",
    img: `${pathImages}flareon.png`,
    WinOf: [0, 5, 6, 9],
    LoseOf: [1, 4, 7, 8],
  },
  {
    id: 4,
    name: "Gengar",
    type: "Rock",
    img: `${pathImages}gengar.png`,
    WinOf: [2, 3, 10],
    LoseOf: [0, 5, 6, 9],
  },
  {
    id: 5,
    name: "Horsea",
    type: "Paper",
    img: `${pathImages}horsea.png`,
    WinOf: [1, 4, 7, 8],
    LoseOf: [2, 3, 10],
  },
  {
    id: 6,
    name: "Jigglypuff",
    type: "Paper",
    img: `${pathImages}jigglypuff.png`,
    WinOf: [1, 4, 7, 8],
    LoseOf: [2, 3, 10],
  },
  {
    id: 7,
    name: "Primeape",
    type: "Rock",
    img: `${pathImages}primeape.png`,
    WinOf: [2, 3, 10],
    LoseOf: [0, 5, 6, 9],
  },
  {
    id: 8,
    name: "Snorlax",
    type: "Rock",
    img: `${pathImages}snorlax.png`,
    WinOf: [2, 3, 10],
    LoseOf: [0, 5, 6, 9],
  },
  {
    id: 9,
    name: "Spearow",
    type: "Paper",
    img: `${pathImages}spearow.png`,
    WinOf: [1, 4, 7, 8],
    LoseOf: [2, 3, 10],
  },
  {
    id: 10,
    name: "Venasaur",
    type: "Scissors",
    img: `${pathImages}venusaur.png`,
    WinOf: [0, 5, 6, 9],
    LoseOf: [1, 4, 7, 8],
  },

];

async function getRandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", "./src/assets/icons/verso.jpg");
  cardImage.setAttribute("data-id", IdCard);
  cardImage.classList.add("card");

  if (fieldSide === state.playerSides.player) {
    cardImage.addEventListener("mouseover", () => {
      drawSelectCard(IdCard);
    });

    cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute("data-id"));
    });
  }

  return cardImage;
}

async function showOrHiddenCardFieldsImages(value) {
  if (value === true) {
    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";
  }

  if (value === false) {
    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";
  }
}

async function hiddenCardDetails() {
  state.cardSprites.avatar.src = "";
  state.cardSprites.name.innerText = "";
  state.cardSprites.type.innerText = "";
}

async function drawButton(text) {
  state.actions.button.innerText = text.toUpperCase();
  state.actions.button.style.display = "block";
}

async function updateScore() {
  state.score.scoreBox.innerText = `Win : ${state.score.playerScore} | Lose : ${state.score.computerScore}`;
}

async function checkDuelResults(playerCardId, computerCardId) {
  let duelResults = "draw";
  let playerCard = cardData[playerCardId];

  if (playerCard.WinOf.includes(computerCardId)) {
    duelResults = "win";
    state.score.playerScore++;
  }

  if (playerCard.LoseOf.includes(computerCardId)) {
    duelResults = "lose";
    state.score.computerScore++;
  }

  await playAudio(duelResults);
  return duelResults;
}

async function removeAllCardsImages() {
  let { computerBox, playerBox } = state.playerSides;
  let imgElements = computerBox.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());

  imgElements = playerBox.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());
}

async function setCardsField(cardId) {
  await removeAllCardsImages();
  let computerCardId = await getRandomCardId();
  await showOrHiddenCardFieldsImages(true);
  await hiddenCardDetails();
  await drawCardsInFields(cardId, computerCardId);
  let duelResults = await checkDuelResults(cardId, computerCardId);

  await updateScore();
  await drawButton(duelResults);
}

async function drawCardsInFields(cardId, computerCardId) {
  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;
}

async function drawSelectCard(index) {
  state.cardSprites.avatar.src = cardData[index].img;
  state.cardSprites.name.innerText = cardData[index].name;
  state.cardSprites.type.innerText = "Attribute : " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getRandomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);

    document.getElementById(fieldSide).appendChild(cardImage);
  }
}

async function resetDuel() {
  state.cardSprites.avatar.src = "";
  state.actions.button.style.display = "none";
  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";

  init();
}

async function playAudio(status) {
  const audio = new Audio(`./src/assets/audios/${status}.wav`);

  try {
    audio.play();
  } catch {}
}

function init() {
  showOrHiddenCardFieldsImages(false);

  drawCards(5, state.playerSides.player);
  drawCards(5, state.playerSides.computer);
}

init();