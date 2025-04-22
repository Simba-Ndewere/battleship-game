import getPlayerBoard from "../index.js";
import dom from "../dom/dom.js";

class AI {
    static hitShips = [];
    static firstShipCoordinates = [];
    static directionArray = [];
    static attackedCells = [];
    static hitCells = [];

    static attackPlayerBoard(id) {
        let changeTurn = getPlayerBoard().receiveAttack(id, "playerCell");
        this.attackedCells.push(id);

        if(!getPlayerBoard().gameOver){
            if (changeTurn) {
                this.attackPlayerBoardMiss();
            } else {
                this.attackPlayerBoardHit(id);
            }
        }
    }

    static attackPlayerBoardMiss() {
        dom.hitOrMissDisplay("miss");
        dom.displayPlayerTurn(0);
        dom.lockUnlockBoard(1);

        if (this.hitCells.length == 1) this.changeDirection();

        if (this.hitCells.length > 1) {
            this.hitCells.push(this.firstShipCoordinates[0]);
            this.oppositeDirection();
        }
    }

    static attackPlayerBoardHit(id) {
        dom.hitOrMissDisplay("hit");
        dom.displayPlayerTurn(1);
        const ship = this.checkShipHit(id);

        if (this.hitCells.length == 0) {
            const direction = this.initialDirection(id);
            this.directionArray.push(direction);
            if (direction.includes('no')) this.changeDirection();
        }

        if (!this.hitShips.includes(ship)) {
            this.hitShips.push(ship);
            this.firstShipCoordinates.push(id);
        }

        if (this.hitShips[0].coordinates.includes(id)) this.hitCells.push(id);

        if (this.hitShips.length > 1) {

            if (!this.hitShips[0].coordinates.includes(id) && this.hitCells.length == 1) this.changeDirection();

            if (!this.hitShips[0].coordinates.includes(id) && this.hitCells.length > 1) {
                this.hitCells.push(this.firstShipCoordinates[0]);
                this.oppositeDirection();
            }
        }
        setTimeout(() => {
            this.checkForAdjacentCells();
        }, 4000);
    }

    static checkForAdjacentCells() {
        let newShip = this.checkShipSunk();
        newShip ? this.adjacentCellsNewShip() : this.adjacentCellsCurrentShip();
    }

    static adjacentCellsNewShip() {
        this.firstShipCoordinates.shift();
        this.hitCells.length = 0;
        this.hitShips.shift();
        this.directionArray.length = 0;

        if (this.firstShipCoordinates.length != 0) {
            this.hitCells.push(this.firstShipCoordinates[0]);
            const direction = this.initialDirection(this.firstShipCoordinates[0]);
            this.directionArray.push(direction);
            if (direction.includes("no")) this.changeDirection();
            this.checkForAdjacentCells();
        } else {
            let randomNumber = this.computerPick(100);
            this.attackPlayerBoard(randomNumber);
        }
    }

    static adjacentCellsCurrentShip() {
        switch (this.directionArray[this.directionArray.length - 1]) {
            case 'left':
                if (this.checkAttackedCells(this.hitCells[this.hitCells.length - 1] - 1)) {
                    this.adjacentCellsChangeDirection();
                } else {
                    this.attackPlayerBoard(this.hitCells[this.hitCells.length - 1] - 1);
                }
                break;
            case 'right':
                if (this.checkAttackedCells(this.hitCells[this.hitCells.length - 1] + 1)) {
                    this.adjacentCellsChangeDirection();
                } else {
                    this.attackPlayerBoard(this.hitCells[this.hitCells.length - 1] + 1);
                }
                break;
            case 'up':
                if (this.checkAttackedCells(this.hitCells[this.hitCells.length - 1] - 10)) {
                    this.adjacentCellsChangeDirection();
                } else if (this.hitCells[this.hitCells.length - 1] - 10 < 0) {
                    this.adjacentCellsChangeDirection();
                } else {
                    this.attackPlayerBoard(this.hitCells[this.hitCells.length - 1] - 10);
                }
                break;
            case 'down':
                if (this.checkAttackedCells(this.hitCells[this.hitCells.length - 1] + 10)) {
                    this.adjacentCellsChangeDirection();
                } else if (this.hitCells[this.hitCells.length - 1] + 10 > 99) {
                    this.adjacentCellsChangeDirection();
                } else {
                    this.attackPlayerBoard(this.hitCells[this.hitCells.length - 1] + 10);
                }
                break;
        }
    }

    static adjacentCellsChangeDirection() {
        this.hitCells.length > 1 ? (this.hitCells.push(this.firstShipCoordinates[0]), this.oppositeDirection()) : this.changeDirection();
        this.checkForAdjacentCells();
    }

    static checkAttackedCells(newCoordinate) {
        return this.attackedCells.includes(newCoordinate);
    }

    static checkShipSunk() {
        return this.hitShips[0].isSunk();
    }

    static computerPick(max) {
        let exit = false;
        let generatedNumber = 0;
        while (!exit) {
            generatedNumber = Math.floor(Math.random() * max);
            if (!this.attackedCells.includes(generatedNumber)) {
                this.attackedCells.push(generatedNumber);
                exit = true;
            }
        }
        return generatedNumber
    }

    static oppositeDirection() {
        switch (this.directionArray[this.directionArray.length - 1]) {
            case 'left':
                this.directionArray.push('right');
                break;
            case 'right':
                this.directionArray.push('left');
                break;
            case 'down':
                this.directionArray.push('up');
                break;
            case 'up':
                this.directionArray.push('down');
                break;
        }
    }

    static checkShipHit = (coordinate) => {
        const ship = getPlayerBoard().checkShipHit(coordinate);
        return ship;
    }

    static random = (max) => {
        return Math.floor(Math.random() * max);
    }

    static changeDirection = () => {
        const directions = ["left", "right", "up", "down"];
        let exit = true;
        while (exit) {
            const newDirection = directions[this.random(4)];

            if (this.directionArray[0].includes('no' + newDirection)) {
                continue;
            }

            if (this.directionArray.includes('no' + newDirection)) {
                continue;
            }

            if (!this.directionArray.includes(newDirection)) {
                this.directionArray.push(newDirection);
                exit = false;
            }
        }
    }

    static initialDirection = (coordinate) => {
        let direction = '';
        let numDirection = this.random(4);

        switch (numDirection) {
            case 0: direction = 'up'
                break;
            case 1: direction = 'down'
                break;
            case 2: direction = 'right'
                break;
            case 3: direction = 'left'
                break;
        }
        direction = this.checkEdges(coordinate, direction);
        return direction;
    }

    static checkEdges(coordinate, direction) {

        let topEdge = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        let bottomEdge = [90, 91, 92, 93, 94, 95, 96, 97, 98, 99];

        let leftEdge = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
        let rightEdge = [9, 19, 29, 39, 49, 59, 69, 79, 89, 99];

        if (topEdge.includes(coordinate)) direction = 'noup';

        if (bottomEdge.includes(coordinate)) direction = 'nodown';

        if (leftEdge.includes(coordinate)) direction = 'noleft';

        if (rightEdge.includes(coordinate)) direction = 'noright';

        switch (coordinate) {
            case 0:
            case 9:
                this.directionArray.push('noup');
                break;
            case 90:
            case 99:
                this.directionArray.push('nodown');
                break;
        }
        return direction;
    }
}

export default AI;