import ship from './ship'
import dom from '../dom/dom';

function gameboard(player) {
    return {
        shipCoordinates: [],
        duplicateCells: [],
        ships: [],
        typeOfPlayer: player,
        gameOver: false,

        receiveAttack: function (coordinate, cellType) {

            let shipHit = this.checkInShipCoordinate(coordinate);
            //dom.hitOrMissImage(cellType, coordinate, shipHit);

            if (shipHit) {
                const ship = this.checkShipHit(coordinate);
                ship.hit();

                if (ship.hitSum == ship.length) {
                    ship.sunk = true;
                }

                if (ship.isSunk()) {
                    ship.getCoordinates().forEach(coordinate => {
                        //dom.shipSunk(cellType, coordinate);
                    });

                    //this.typeOfPlayer === 'computer' ? dom.crossOutShip(ship.shipName, 'Right') : dom.crossOutShip(ship.shipName, 'Left');

                    for (let a = 0; a < this.ships.length; a++) {

                        if (!this.ships[a].isSunk()) {
                            break;
                        }

                        if (a == this.ships.length - 1) {
                           //om.lockUnlockBoard(0);
                            this.gameOver = true;
                            //is.typeOfPlayer === 'computer' ? dom.hitOrMissDisplay('Game Over! - You Won') : dom.hitOrMissDisplay('Game Over! - Computer Won');
                        }
                    }
                }
            }

            if (shipHit) {
                return false;
            } else {
                return true;
            }
        },

        checkInShipCoordinate: function (coordinate) {
            for (let a = 0; a < this.shipCoordinates.length; a++) {
                for (let b = 0; b < this.shipCoordinates[a].length; b++) {
                    if (coordinate == this.shipCoordinates[a][b]) {
                        return true;
                    }
                }
            }
            return false;
        },

        checkShipHit: function (coordinate) {
            for (let a = 0; a < this.ships.length; a++) {
                const coordinatesShipArray = this.ships[a].getCoordinates();
                for (let b = 0; b < coordinatesShipArray.length; b++) {
                    if (coordinatesShipArray[b] == coordinate) {
                        const ship = this.ships[a];
                        return ship;
                    }
                }
            }
        },

        addCoordinates: function (coordinates) {
            this.shipCoordinates.push(coordinates);
        },

        shuffle: function () {
            this.shipCoordinates.length = 0;
            this.duplicateCells.length = 0;
            this.ships.length = 0;

            const cruiser = ship(2, 'cruiser');
            const battleship = ship(4, 'battleship');
            const submarine = ship(3, 'submarine');
            const aircraft = ship(5, 'aircraft');
            const destroyer = ship(3, 'destroyer');

            const ships = [cruiser, battleship, submarine, aircraft, destroyer];

            for (let a = 0; a < ships.length; a++) {
                let axes = this.direction(2);
                let coordinates = this.generateCoordinates(ships[a], axes);
                ships[a].addCoordinates(coordinates);
                this.shipCoordinates.push(coordinates);
                this.ships.push(ships[a]);
            }
            return this.shipCoordinates;
        },

        generateCoordinates: function (ship, axes) {
            let complete = false;
            let exit = false;
            let shipLength = ship.length;
            let shipCoordinates = [];
            let duplicateCell = [];

            while (!exit) {
                let startingPosition = this.direction(100);

                duplicateCell.push(startingPosition);
                shipCoordinates.push(startingPosition);

                let direction = axes == 1 ? this.verticalDirection(startingPosition) : this.horizontalDirection(startingPosition);

                for (let a = 1; a < shipLength; a++) {
                    let overboard = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 9, 19, 29, 39, 49, 59, 69, 79, 89, 99];

                    if (axes == 1)
                        direction === 'up' ? startingPosition = startingPosition - 10 : startingPosition = startingPosition + 10;
                    else
                        direction === 'left' ? startingPosition = startingPosition - 1 : startingPosition = startingPosition + 1;

                    if (!this.checkNewPositionDuplicate(startingPosition, duplicateCell, shipCoordinates)) break;

                    if (a != shipLength - 1 && overboard.includes(startingPosition)) {
                        this.resetArrays(shipCoordinates, duplicateCell);
                        break;
                    }

                    if (!this.checkOutOfBounds(startingPosition, shipCoordinates, duplicateCell)) break;

                    if (a == shipLength - 1) {
                        complete = true;
                    }
                }

                if (complete) {
                    this.duplicateCells.push(duplicateCell);
                    exit = true;
                }
            }
            return shipCoordinates;
        },

        checkNewPositionDuplicate: function (startingPosition, duplicateCell, shipCoordinates) {
            if (this.duplicateCells.flat().includes(startingPosition)) {
                this.resetArrays(shipCoordinates, duplicateCell);
                return false;
            } else {
                shipCoordinates.push(startingPosition);
                duplicateCell.push(startingPosition);
                return true;
            }
        },

        checkOutOfBounds: function (startingPosition, shipCoordinates, duplicateCell) {
            if (startingPosition < 0 || startingPosition > 99) {
                this.resetArrays(shipCoordinates, duplicateCell);
                return false;
            } else {
                return true;
            }
        },

        resetArrays: function (shipCoordinates, duplicateCell) {
            shipCoordinates.length = 0;
            duplicateCell.length = 0;
        },

        direction: function (max) {
            if (max == 100) {
                let exit = false;
                let startingPosition = 0;
                while (!exit) {
                    startingPosition = Math.floor(Math.random() * max);
                    if (!this.duplicateCells.flat().includes(startingPosition)) {
                        exit = true;
                    }
                }
                return startingPosition;
            } else {
                return Math.floor(Math.random() * max);
            }
        },

        verticalDirection: function (sp) {
            let direction = '';

            let topEdge = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            let bottomEdge = [91, 92, 93, 94, 95, 96, 97, 98, 99];

            direction = this.direction(2) == 0 ? 'up' : 'down'

            if (topEdge.includes(sp))
                direction = 'down';

            if (bottomEdge.includes(sp))
                direction = 'up';

            return direction;
        },

        horizontalDirection: function (sp) {
            let direction = '';

            let leftEdge = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
            let rightEdge = [9, 19, 29, 39, 49, 59, 69, 79, 89, 99];

            direction = this.direction(2) == 0 ? 'right' : 'left'

            if (leftEdge.includes(sp))
                direction = 'right';

            if (rightEdge.includes(sp))
                direction = 'left';

            return direction;
        },
    }
}

export default gameboard;