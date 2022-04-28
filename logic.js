const WIN_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2],
]

export const Players = {
  Human : 'O',
  Ai : 'X',
  None : '',
}

export const GameScore = {
  Human : -1,
  Ai : 1,
  Tie : 0,
  None : Infinity,
}

export const GameActionType = {
  RESET : 'RESET',
  TURN_HUMAN: 'TURN_HUMAN',
  TURN_AI: 'TURN_AI',
  TURN_UP: 'TURN_UP'
}

const writeOnBoard = (
  board,
  index,
  player,
) => {
  const newBoard = [...board]
  newBoard[index] = player
  return newBoard
}

const getBlankCells = (board) => {
  let blankCells = []
  board.filter((cell, index) => {
    if (cell === '') {
      blankCells.push(index)
    }
    return false
  })
  return blankCells
}

const getGameScore = (board, blankCells) => {
  let score = GameScore.None
  let wonCase = -1
  for (const [comboIndex, combo] of Array.from(WIN_COMBOS.entries())) {
    const equalityCondition = combo.every(
      (position, _, combo) =>
        board[position] === board[combo[0]] && board[position] !== Players.None,
    )

    if (equalityCondition) {
      score = board[combo[0]] === Players.Human ? GameScore.Human : GameScore.Ai
      wonCase = comboIndex
    }
  }
  if (score === GameScore.None && blankCells.length === 0) {
    score = GameScore.Tie
  }

  return {
    score,
    wonCase,
  }
}

const getOpponentFor = (player) =>
  player === Players.Ai ? Players.Human : Players.Ai

export const minimax = (
  board,
  player,
  depth = 0,
) => {
  const blankCells = getBlankCells(board)
  const game = getGameScore(board, blankCells)

  if (isFinite(game.score)) {
    const futureWonCase = game.wonCase
    return { ...game, futureWonCase }
  }

  let moves = []
  const newBoard = [...board]
  for (let index of blankCells) {
    newBoard[index] = player
    let resultScore = minimax(newBoard, getOpponentFor(player), depth++)
    newBoard[index] = Players.None

    moves.push({ ...resultScore, index, depth })
  }
  let bestSpot: BestSpot = {
    score: GameScore.None,
  }

  if (player === Players.Ai) {
    let bestScore = -Infinity
    for (let move of moves) {
      if (move.score > bestScore) {
        bestScore = move.score
        bestSpot = move
      }
    }
  } else {
    let bestScore = Infinity
    for (let move of moves) {
      if (move.score < bestScore) {
        bestScore = move.score
        bestSpot = move
      }
    }
  }

  return bestSpot
}

export const turn = (
  board,
  index,
  player,
  preScore = { score: 0 },
) => {
  if (
    !isFinite(getGameScore(board, getBlankCells(board)).score) &&
    board[index] === Players.None
  ) {
    const newBoard = writeOnBoard(board, index, player)
    let newScore = {
      ...preScore,
      ...getGameScore(newBoard, getBlankCells(newBoard)),
    }

    if (!isFinite(newScore.score) && player === Players.Human) {
      const bestSpot = minimax(newBoard, Players.Ai, 0)

      newScore = {
        ...newScore,
        ...bestSpot,
      }
      return turn(newBoard, bestSpot.index, Players.Ai, newScore)
    } else {
      return {
        ...newScore,
        board: newBoard,
      }
    }
  }
  return null
}
const DATA = ['X','X','O','O','X','O','X','O','O']

/* [
'X','X','O',
'O','X','O',
'X','O','O'
]*/

export const resetGame = (): Game => ({
  board: Array.from(Array(9).fill('')),
  score: GameScore.None,
  wonCase: -1,
  index: -1,
  depth: 0,
})

export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const reducer = (state, action) => {
  switch (action.type) {
    case GameActionType.TURN_UP:
      return {
        ...state,
        turns: state.turns+1,
      }
    case GameActionType.TURN_HUMAN:
      return {
        ...state,
        ...turn(state.board, action.payload.index, Players.Human),
      }
    case GameActionType.RESET:
      var nextState = { ...resetGame(), turns:0 }
      if (state.score === GameScore.Ai) {
        nextState = {
          ...nextState,
          ...turn(nextState.board, getRandomInt(0, 8), Players.Ai),
          turns: 1
        }
      }
      return nextState
    default:
      return state
  }
}

export const initialState = {
    score: GameScore.None,
    board: Array.from(Array(9).fill('')),
    index: -1,
    depth: 0,
    wonCase: -1,
    futureWonCase: -1,
    turns: 0,
  }
