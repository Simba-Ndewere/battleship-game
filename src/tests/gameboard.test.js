import gameboard from '../domain/gameboard';
import ship from '../domain/ship';

test('', () => {
    const gameboardObject = gameboard();
    expect(gameboardObject.allShipsSunk).toBe(false);
    expect(gameboardObject.shipCoordinates).toEqual([]);
    expect(gameboardObject).toHaveProperty("receiveAttack");

    expect(gameboardObject).toHaveProperty("shuffle");
});

test('test adding coordinates', () => {
    const gameboardObject = gameboard();
    const array = [46, 36];
    gameboardObject.addCoordinates(array);
    expect(gameboardObject.shipCoordinates).toStrictEqual([[46, 36]]);
});

test('test shuffling ship coordinates', () => {

    const gameboardObject = gameboard();

    const array4 = [81, 82, 83, 84, 85];
    const array5 = [12, 13, 14, 15];
    gameboardObject.addCoordinates(array4);
    gameboardObject.addCoordinates(array5);

    gameboardObject.shuffle();

});

test('check cell clicked is in ship coordinates', () => {
    
    const gameBoard = gameboard();

    const coordinates = [46,45];
    gameBoard.shipCoordinates.push(coordinates);
    let value = gameBoard.checkInShipCoordinate(45);
    expect(value).toBe(true);

});

test('check hit coordinate is in which ship', () => {
    const gameBoard = gameboard();

    const coordinates = [46,45];

    const cruiser = ship(2,0);
    const submarine = ship(3,1);

    const coordinates2 = [87,88,89];
    submarine.addCoordinates(coordinates2);

    cruiser.addCoordinates(coordinates);
    submarine.addCoordinates(coordinates2);

    gameBoard.ships.push(cruiser);
    gameBoard.ships.push(submarine);

    const shipId = gameBoard.checkShipHit(88);
    expect(shipId).toBe(1);
});

test('check if ship has been sunk', () => {
    const gameBoard = gameboard();

    const coordinates = [46,45];
    const cruiser = ship(2,0);
    cruiser.addCoordinates(coordinates);
    gameBoard.ships.push(cruiser);
        
    gameBoard.receiveAttack(46);
    gameBoard.receiveAttack(45);

    expect(cruiser.hitSum).toBe(2);
    expect(cruiser.sunk).toBe(true);
});
