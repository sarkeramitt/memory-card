document.addEventListener("DOMContentLoaded", () => {
  // Card types with emojis
  const cardTypes = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"]

  // Game state
  let cards = []
  let flippedCards = []
  let matchedPairs = 0
  let moves = 0
  let timer = 0
  let gameStarted = false
  let gameCompleted = false
  let interval = null

  // DOM elements
  const gameBoard = document.getElementById("game-board")
  const movesElement = document.getElementById("moves")
  const matchesElement = document.getElementById("matches")
  const timeElement = document.getElementById("time")
  const restartButton = document.getElementById("restart-btn")
  const gameCompleteElement = document.getElementById("game-complete")
  const finalMovesElement = document.getElementById("final-moves")
  const finalTimeElement = document.getElementById("final-time")
  const totalPairsElement = document.getElementById("total-pairs")

  // Set total pairs
  totalPairsElement.textContent = cardTypes.length

  // Initialize game
  initializeGame()

  // Event listeners
  restartButton.addEventListener("click", initializeGame)

  function initializeGame() {
    // Clear game board
    gameBoard.innerHTML = ""

    // Reset game state
    cards = []
    flippedCards = []
    matchedPairs = 0
    moves = 0
    timer = 0
    gameStarted = false
    gameCompleted = false

    // Clear timer
    if (interval) {
      clearInterval(interval)
      interval = null
    }

    // Update UI
    movesElement.textContent = moves
    matchesElement.textContent = matchedPairs
    timeElement.textContent = formatTime(timer)
    gameCompleteElement.classList.add("hidden")

    // Create card pairs
    const cardPairs = [...cardTypes, ...cardTypes].map((type, index) => ({
      id: index,
      type,
      flipped: false,
      matched: false,
    }))

    // Shuffle cards
    cards = shuffleArray(cardPairs)

    // Create card elements
    cards.forEach((card) => {
      const cardElement = document.createElement("div")
      cardElement.className = "card"
      cardElement.dataset.id = card.id

      cardElement.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">
                        <span>${card.type}</span>
                    </div>
                    <div class="card-back">
                        <span>?</span>
                    </div>
                </div>
            `

      cardElement.addEventListener("click", () => handleCardClick(card.id))
      gameBoard.appendChild(cardElement)
    })

    // Show all cards briefly at the beginning
    cards.forEach((card) => {
      card.flipped = true
      updateCardUI(card.id)
    })

    // Hide cards after 3 seconds
    setTimeout(() => {
      cards.forEach((card) => {
        card.flipped = false
        updateCardUI(card.id)
      })
    }, 3000)
  }

  function handleCardClick(id) {
    // Start game on first card click
    if (!gameStarted && !gameCompleted) {
      gameStarted = true
      startTimer()
    }

    // Get card
    const card = cards.find((card) => card.id === id)

    // Ignore clicks if two cards are already flipped or card is already flipped/matched
    if (flippedCards.length === 2 || card.flipped || card.matched || gameCompleted) {
      return
    }

    // Flip card
    card.flipped = true
    flippedCards.push(id)

    // Update UI
    updateCardUI(id)

    // Check for match if two cards are flipped
    if (flippedCards.length === 2) {
      checkForMatch()
    }
  }

  function checkForMatch() {
    moves++
    movesElement.textContent = moves

    const [firstCardId, secondCardId] = flippedCards
    const firstCard = cards.find((card) => card.id === firstCardId)
    const secondCard = cards.find((card) => card.id === secondCardId)

    if (firstCard.type === secondCard.type) {
      // Match found
      firstCard.matched = true
      secondCard.matched = true
      matchedPairs++
      matchesElement.textContent = matchedPairs

      // Update UI
      document.querySelector(`.card[data-id="${firstCardId}"]`).classList.add("matched")
      document.querySelector(`.card[data-id="${secondCardId}"]`).classList.add("matched")

      // Reset flipped cards
      flippedCards = []

      // Check if game is complete
      if (matchedPairs === cardTypes.length) {
        endGame()
      }
    } else {
      // No match, flip cards back after a delay
      setTimeout(() => {
        firstCard.flipped = false
        secondCard.flipped = false

        // Update UI
        updateCardUI(firstCardId)
        updateCardUI(secondCardId)

        // Reset flipped cards
        flippedCards = []
      }, 1000)
    }
  }

  function updateCardUI(id) {
    const card = cards.find((card) => card.id === id)
    const cardElement = document.querySelector(`.card[data-id="${id}"]`)

    if (card.flipped) {
      cardElement.classList.add("flipped")
    } else {
      cardElement.classList.remove("flipped")
    }
  }

  function startTimer() {
    interval = setInterval(() => {
      timer++
      timeElement.textContent = formatTime(timer)
    }, 1000)
  }

  function endGame() {
    gameCompleted = true
    gameStarted = false

    if (interval) {
      clearInterval(interval)
      interval = null
    }

    finalMovesElement.textContent = moves
    finalTimeElement.textContent = formatTime(timer)
    gameCompleteElement.classList.remove("hidden")
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  function shuffleArray(array) {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }
})

