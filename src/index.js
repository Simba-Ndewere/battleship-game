import "./index.css";
import dom from "./dom/dom.js";
import ship from './domain/ship.js';
import gameboard from "./domain/gameboard.js";
import player from "./domain/player.js";
import ai from './AI/ai.js';

const shuffleShips = document.getElementById('shuffle');
const newGame = document.getElementById('newGame');
const computerBoard = document.querySelector(".board2");

const playerGameBoard = gameboard();
const computerGameBoard = gameboard();

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
        changeTurn = computerGameBoard.receiveAttack(id);
        dom.hitOrMissImage('computerCell', id, !changeTurn);
        if (!changeTurn) {
            const ship = computerGameBoard.checkShipHit(id);
            if (ship.isSunk()) {
                ship.getCoordinates().forEach(coordinate => {
                    dom.shipSunk('computerCell', coordinate);
                });
                dom.crossOutShip(ship.shipName, 'Right');
            }

            for (let a = 0; a < computerGameBoard.ships.length; a++) {

                if (!computerGameBoard.ships[a].isSunk()) {
                    break;
                }

                if (a == computerGameBoard.ships.length - 1) {
                    dom.lockUnlockBoard(0);
                    computerGameBoard.gameOver = true;
                    dom.hitOrMissDisplay('Game Over! - You Won');
                    return;
                }
            }
        }
    }

    if (changeTurn) {
        dom.lockUnlockBoard(0);
        dom.hitOrMissDisplay("miss");
        dom.displayPlayerTurn(1);
        setTimeout(function () {
            if (ai.hitShips.length == 0) {
                let randomNumber = ai.computerPick(100);
                attackPlayerBoard(randomNumber);
            } else {
                attackPlayerBoard(ai.checkForAdjacentCells());
            }
        }, 4000);
    } else {
        dom.hitOrMissDisplay("hit");
        dom.displayPlayerTurn(0);
    }
});

const attackPlayerBoard = (id) => {
    let changeTurn = playerGameBoard.receiveAttack(id);
    dom.hitOrMissImage('playerCell', id, !changeTurn);
    ai.attackedCells.push(id);
    if (!changeTurn) {
        const ship = playerGameBoard.checkShipHit(id);
        if (ship.isSunk()) {
            ship.getCoordinates().forEach(coordinate => {
                dom.shipSunk('playerCell', coordinate);
            });
            dom.crossOutShip(ship.shipName, 'Left');
        }

        for (let a = 0; a < playerGameBoard.ships.length; a++) {

            if (!playerGameBoard.ships[a].isSunk()) {
                break;
            }

            if (a == playerGameBoard.ships.length - 1) {
                dom.lockUnlockBoard(0);
                playerGameBoard.gameOver = true;
                dom.hitOrMissDisplay('Game Over! - Computer Won');
                return;
            }
        }
    }

    let returnedValue = -1;

    if (!playerGameBoard.gameOver)
        if (changeTurn) {
            dom.hitOrMissDisplay("miss");
            dom.displayPlayerTurn(0);
            dom.lockUnlockBoard(1);
            ai.attackPlayerBoardMiss();
        } else {
            dom.hitOrMissDisplay("hit");
            if (!playerGameBoard.gameOver) dom.displayPlayerTurn(1);
            const shipHit = playerGameBoard.checkShipHit(id);
            returnedValue = ai.attackPlayerBoardHit(id, shipHit);
        }

    setTimeout(function () {
        if (!playerGameBoard.gameOver && returnedValue > 0) {
            attackPlayerBoard(returnedValue);
        }
    }, 2500);

}

window.onload = createDefaultPlayerShips();
