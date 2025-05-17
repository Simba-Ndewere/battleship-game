class AI {
    static hitShips = [];
    static firstShipCoordinates = [];
    static directionArray = [];
    static attackedCells = [];
    static hitCells = [];

    static attackPlayerBoardMiss() {
        if (this.hitCells.length == 1) this.changeDirection();

        if (this.hitCells.length > 1) {
            this.hitCells.push(this.firstShipCoordinates[0]);
            this.oppositeDirection();
        }
    }

    static attackPlayerBoardHit(id, shipHit) {

        const ship = shipHit;

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
        return this.checkForAdjacentCells();
    }

    static checkForAdjacentCells() {
        let newShip = this.checkShipSunk();
        if (newShip) {
            return this.adjacentCellsNewShip();
        } else {
            return this.adjacentCellsCurrentShip();
        }
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
            return this.adjacentCellsCurrentShip();
        } else {
            let randomNumber = this.computerPick(100);
            return randomNumber;
        }
    }

    static adjacentCellsCurrentShip() {
        switch (this.directionArray[this.directionArray.length - 1]) {
            case 'left':
                if (this.checkAttackedCells(this.hitCells[this.hitCells.length - 1] - 1)) {
                    return this.adjacentCellsChangeDirection();
                } else {
                    return this.hitCells[this.hitCells.length - 1] - 1;
                }
            case 'right':
                if (this.checkAttackedCells(this.hitCells[this.hitCells.length - 1] + 1)) {
                    return this.adjacentCellsChangeDirection();
                } else {
                    return this.hitCells[this.hitCells.length - 1] + 1;
                }
            case 'up':
                if (this.checkAttackedCells(this.hitCells[this.hitCells.length - 1] - 10)) {
                    return this.adjacentCellsChangeDirection();
                } else if (this.hitCells[this.hitCells.length - 1] - 10 < 0) {
                    return this.adjacentCellsChangeDirection();
                } else {
                    return this.hitCells[this.hitCells.length - 1] - 10;
                }
            case 'down':
                if (this.checkAttackedCells(this.hitCells[this.hitCells.length - 1] + 10)) {
                    return this.adjacentCellsChangeDirection();
                } else if (this.hitCells[this.hitCells.length - 1] + 10 > 99) {
                    return this.adjacentCellsChangeDirection();
                } else {
                    return this.hitCells[this.hitCells.length - 1] + 10;
                }
        }
    }

    static adjacentCellsChangeDirection() {
        this.hitCells.length > 1 ? (this.hitCells.push(this.firstShipCoordinates[0]), this.oppositeDirection()) : this.changeDirection();
        return this.checkForAdjacentCells();
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