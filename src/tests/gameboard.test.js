import gameboard from '../domain/gameboard';
import ship from '../domain/ship';

test('', () => {
    const gameboardObject = gameboard();
    expect(gameboardObject).toHaveProperty("receiveAttack");
    expect(gameboardObject).toHaveProperty("shuffle");
});

test('check ship hit is true when gameboard receive a hit attack. Returned value to be falsy due to switch player turn', () => {
    const gameboardObject = gameboard();
    const shipArray1 = [3, 13, 23, 33];
    const shipArray2 = [33, 34, 35];

    const ship1 = ship(4, 'destroyer');
    ship1.addCoordinates(shipArray1);
    const ship2 = ship(3, 'undertaker');
    ship2.addCoordinates(shipArray2);

    gameboardObject.ships.push(ship1);
    gameboardObject.ships.push(ship2);

    gameboardObject.shipCoordinates.push(shipArray1);
    gameboardObject.shipCoordinates.push(shipArray2);
    const returnedValue = gameboardObject.receiveAttack(35);
    expect(returnedValue).toBeFalsy();
});

test('check if a coordinate is in a ship', () => {
    const gameboardObject = gameboard();
    const shipArray1 = [3, 13, 23, 33];
    gameboardObject.shipCoordinates.push(shipArray1);
    const shipHit = gameboardObject.checkInShipCoordinate(13);
    expect(shipHit).toBeTruthy();
});

test('check which ship is hit after a received attack', () => {
    const gameboardObject = gameboard();
    const shipArray1 = [3, 13, 23, 33];
    const shipArray2 = [34, 35, 36];

    const ship1 = ship(4, 'destroyer');
    ship1.addCoordinates(shipArray1);
    const ship2 = ship(3, 'undertaker');
    ship2.addCoordinates(shipArray2);

    gameboardObject.ships.push(ship1);
    gameboardObject.ships.push(ship2);

    gameboardObject.shipCoordinates.push(shipArray1);
    gameboardObject.shipCoordinates.push(shipArray2);
    const shipReturned = gameboardObject.checkShipHit(33);
    expect(shipReturned).toEqual(ship1);
});

test('test random generator is within range', () => {
    const gameboardObject = gameboard();
    let generatedNumber = gameboardObject.direction(10);
    expect(generatedNumber).toBeGreaterThanOrEqual(0);
    expect(generatedNumber).toBeLessThan(10);
});

test('test vertical direction non edge', () => {
    const gameboardObject = gameboard();
    const startingPosition = 10;
    const direction = gameboardObject.verticalDirection(startingPosition);
    expect(direction).toMatch(/(up|down)/i);
});

test('test vertical direction top edge', () => {
    const gameboardObject = gameboard();
    const startingPosition = 0;
    const direction = gameboardObject.verticalDirection(startingPosition);
    expect(direction).toBe('down');
});

test('test vertical direction bottom edge', () => {
    const gameboardObject = gameboard();
    const startingPosition = 91;
    const direction = gameboardObject.verticalDirection(startingPosition);
    expect(direction).toBe('up');
});

test('test if generated coordinate is already on the gameboard', () => {
    const gameboardObject = gameboard();
    const duplicateCell = [26, 16];
    const shipCoordinates = [26, 16];
    gameboardObject.duplicateCells.push([3, 4, 5, 6]);
    const duplicate = gameboardObject.checkNewPositionDuplicate(6, duplicateCell, shipCoordinates);
    expect(duplicate).toBeTruthy();
});

test('test if generated coordinate is not on the gameboard', () => {
    const gameboardObject = gameboard();
    const duplicateCell = [26, 16];
    const shipCoordinates = [26, 16];
    gameboardObject.duplicateCells.push([7, 8]);
    const duplicate = gameboardObject.checkNewPositionDuplicate(6, duplicateCell, shipCoordinates);
    expect(duplicate).toBeFalsy();
});

test('test a coordinate is out of bounds', () => {
    const gameboardObject = gameboard();
    const duplicateCell = [98, 99];
    const shipCoordinates = [98, 99];
    const startingPosition = 100;
    const outOfBouunds = gameboardObject.checkOutOfBounds(startingPosition, shipCoordinates, duplicateCell);
    expect(outOfBouunds).toBeTruthy();
});

test('test a coordinate not out of bounds', () => {
    const gameboardObject = gameboard();
    const duplicateCell = [97, 98];
    const shipCoordinates = [97, 98];
    const startingPosition = 99;
    const outOfBouunds = gameboardObject.checkOutOfBounds(startingPosition, shipCoordinates, duplicateCell);
    expect(outOfBouunds).toBeFalsy();
});

test('test to see if resetArrays is called and arrays are reset when called', () => {
    const shipLength = 5;
    const gameboardObject = gameboard();
    const overboard = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 9, 19, 29, 39, 49, 59, 69, 79, 89, 99];
    let startingPosition = 7;
    const shipCoordinates = [7];
    const duplicateCell = [7];
    let overboardStartingPosition = 0;

    const spyResetArrays = jest.spyOn(gameboardObject, 'resetArrays');

    for (let a = 1; a < shipLength; a++) {

        if (a != shipLength - 1 && overboard.includes(startingPosition)) {
            overboardStartingPosition = startingPosition;
            gameboardObject.resetArrays(shipCoordinates, duplicateCell);
            break;
        }
        startingPosition = startingPosition + 1;
        shipCoordinates.push(startingPosition);
        duplicateCell.push(startingPosition);
    }

    expect(spyResetArrays).toHaveBeenCalledTimes(1);
    expect(shipCoordinates.length).toBe(0);
    expect(duplicateCell.length).toBe(0);
    expect(overboardStartingPosition).toBe(9);
});

test('test generate coordinates', () => {
    const gameboardObject = gameboard();
    const aircraft = ship(2, 'aircraft');
    const boardShipCoordinates = [[2, 12, 22, 32, 42], [20, 30, 40], [46, 47, 48, 49], [69, 79, 89]];
    gameboardObject.shipCoordinates = boardShipCoordinates;

    boardShipCoordinates.forEach(element => {
        gameboardObject.duplicateCells.push(element);
    });

    const axes = gameboardObject.direction(2);

    let coordinates = gameboardObject.generateCoordinates(aircraft, axes);

    boardShipCoordinates.flat().forEach(element => {
        expect(coordinates).not.toContain(element);
    });

    coordinates.forEach(element => {
        expect(element).toBeGreaterThanOrEqual(0);
        expect(element).toBeLessThanOrEqual(99);
    });

    const startingPosition = coordinates[0];
    const endingPosition = coordinates[coordinates.length - 1];

    if (coordinates[0] - coordinates[1] == 1 || coordinates[0] - coordinates[1] == -1) {
        const columnEnd = startingPosition < 10 ? '9' : startingPosition.toString().charAt(0) + '9';
        startingPosition < endingPosition ? expect(startingPosition + (aircraft.length - 1)).toBe(endingPosition)
            : expect(startingPosition - (aircraft.length - 1)).toBe(endingPosition);
        expect(endingPosition).toBeLessThanOrEqual(Number(columnEnd));
    } else {
        if (startingPosition > endingPosition) {
            for (let a = 0; a < coordinates.length; a++) {
                if (a != coordinates.length - 1)
                    expect(coordinates[a + 1] + 10).toBe(coordinates[a]);
            }
        }
        else {
            for (let a = 0; a < coordinates.length; a++) {
                if (a != coordinates.length - 1)
                    expect(coordinates[a + 1] - 10).toBe(coordinates[a]);
            }
        }
    }

    expect(coordinates.length).toBe(aircraft.length);
});












