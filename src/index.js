import "./index.css";
import dom from "./dom/dom.js";
import ship from './domain/ship.js';
import gameboard from "./domain/gameboard.js";
import player from "./domain/player.js";
import ai from './AI/ai.js';

const shuffleShips = document.getElementById('shuffle');
const newGame = document.getElementById('newGame');
const computerBoard = document.querySelector(".board2");

const playerGameBoard = gameboard('player');
const computerGameBoard = gameboard('computer');

const currentPlayer = player();
const computerPlayer = player();

dom.createBoardGrids();

const createDefaultPlayerShips = () => {

    const cruiser = ship(2, 'cruiser');
    const battleship = ship(4, 'battleship');
    const submarine = ship(3, 'submarine');
    const aircraft = ship(5, 'aircraft');
    const destroyer = ship(3, 'destroyer');

    const ships = [cruiser, battleship, submarine, aircraft, destroyer];

    const startingPositions = [12, 46, 40, 81, 89];

    for (let a = 0; a < ships.length; a++) {
        if (ships[a].length > 3) {
            dom.playerDefaultPlacement(ships[a], 'a', startingPositions[a], playerGameBoard);
        } else {
            dom.playerDefaultPlacement(ships[a], 'u', startingPositions[a], playerGameBoard);
        }
        playerGameBoard.ships.push(ships[a]);
    }
    currentPlayer.addGameBoard(playerGameBoard);
    dom.lockUnlockBoard(0);
}

shuffleShips.addEventListener('click', function () {
    dom.clearBoardCells();
    dom.placePlayerShipsOnBoard(playerGameBoard.shuffle());
});

newGame.addEventListener('click', (event) => {
    if (event.target.textContent === 'Start Game') {
        computerGameBoard.shuffle();
        dom.removeShuffleButton();
        computerPlayer.addGameBoard(computerGameBoard);
        dom.lockUnlockBoard(1);
    } else {
        location.reload();
    }
});

computerBoard.addEventListener("click", (event) => {
    let changeTurn = true;

    if (event.target.classList.contains("cell2")) {
        let id = Number(event.target.id.substring(12));
        changeTurn = computerGameBoard.receiveAttack(id, "computerCell");
    }

    if (computerGameBoard.gameOver) {
        return; 
    }
    
    if (!computerGameBoard.gameOver) {
        if (changeTurn) {
            dom.lockUnlockBoard(0);
            dom.hitOrMissDisplay("miss");
            dom.displayPlayerTurn(1);
            setTimeout(function () {
                if (ai.hitShips.length == 0) {
                    let randomNumber = ai.computerPick(100);
                    ai.attackPlayerBoard(randomNumber);
                } else {
                    ai.checkForAdjacentCells();
                }
            }, 4000);
        } else {
            dom.hitOrMissDisplay("hit");
            dom.displayPlayerTurn(0);
        }
    }
});

export default function getPlayerBoard() {
    return playerGameBoard;
}

window.onload = createDefaultPlayerShips();
