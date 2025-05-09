import gameboard from '../domain/gameboard';
import ship from '../domain/ship';

test('', () => {
    const gameboardObject = gameboard();
    expect(gameboardObject).toHaveProperty("receiveAttack");

    expect(gameboardObject).toHaveProperty("shuffle");
});

test('check ship hit is true when gameboard receive a hit attack. Returned value to be falsy due to switch player turn', () => {
    const gameboardObject = gameboard();
    const shipArray1 = [3,13,23,33];
    const shipArray2 = [33,34,35];

    const ship1 = ship(4,'destroyer');
    ship1.addCoordinates(shipArray1);
    const ship2 = ship(3,'undertaker');
    ship2.addCoordinates(shipArray2);

    gameboardObject.ships.push(ship1);
    gameboardObject.ships.push(ship2);

    gameboardObject.shipCoordinates.push(shipArray1);
    gameboardObject.shipCoordinates.push(shipArray2);
    const returnedValue = gameboardObject.receiveAttack(35);
    expect(returnedValue).toBeFalsy();
});

test('check if a coordinate is in a ship',() => {
    const gameboardObject = gameboard();
    const shipArray1 = [3,13,23,33];
    gameboardObject.shipCoordinates.push(shipArray1);
    const shipHit = gameboardObject.checkInShipCoordinate(13);
    expect(shipHit).toBeTruthy();
});


test('check which ship is hit after a received attack', () => {
    const gameboardObject = gameboard();
    const shipArray1 = [3,13,23,33];
    const shipArray2 = [34,35,36];

    const ship1 = ship(4,'destroyer');
    ship1.addCoordinates(shipArray1);
    const ship2 = ship(3,'undertaker');
    ship2.addCoordinates(shipArray2);

    gameboardObject.ships.push(ship1);
    gameboardObject.ships.push(ship2);

    gameboardObject.shipCoordinates.push(shipArray1);
    gameboardObject.shipCoordinates.push(shipArray2);
    const shipReturned = gameboardObject.checkShipHit(33);
    expect(shipReturned).toEqual(ship1);
});






