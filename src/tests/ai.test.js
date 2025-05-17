import ai from '../AI/ai';
import ship from '../domain/ship';

function resetAI() {
    ai.hitCells = [];
    ai.directionArray = [];
    ai.attackedCells = [];
    ai.hitShips = [];
    ai.firstShipCoordinates = [];
}

beforeEach(() => {
    resetAI();
    jest.clearAllMocks();
});

test('test oppsite direction', () => {
    ai.directionArray.push('left');
    ai.oppositeDirection();
    expect(ai.directionArray[ai.directionArray.length - 1]).toEqual('right');

    ai.directionArray.push('right');
    ai.oppositeDirection();
    expect(ai.directionArray[ai.directionArray.length - 1]).toEqual('left');

    ai.directionArray.push('down');
    ai.oppositeDirection();
    expect(ai.directionArray[ai.directionArray.length - 1]).toEqual('up');

    ai.directionArray.push('up');
    ai.oppositeDirection();
    expect(ai.directionArray[ai.directionArray.length - 1]).toEqual('down');
});


test('test change direction without no in direction array', () => {
    ai.directionArray.push('left');
    ai.changeDirection();
    expect(ai.directionArray[ai.directionArray.length - 1]).not.toEqual(expect.stringContaining('no'));
});

test('test change direction with no in direction array', () => {
    ai.directionArray.push('noright');
    ai.changeDirection();
    expect(ai.directionArray[ai.directionArray.length - 1]).not.toEqual('right');
});

test('test computer pick', () => {
    ai.attackedCells = [34, 55, 87, 2, 45, 46, 46];
    const coordinate = ai.computerPick(100);
    for (let a = 0; a < ai.attackedCells.length - 1; a++) {
        expect(coordinate).not.toBe(ai.attackedCells[a]);
    }
});

test('test attack player board miss with one hitcells', () => {
    const spyChangeDirection = jest.spyOn(ai, 'changeDirection');
    const spyChangeOppositeDirection = jest.spyOn(ai, 'oppositeDirection');
    ai.hitCells.push(12);
    ai.directionArray.push('right');
    ai.attackPlayerBoardMiss();
    expect(spyChangeDirection).toHaveBeenCalledTimes(1);
    expect(spyChangeOppositeDirection).toHaveBeenCalledTimes(0);
});

test('test attack player board miss with more than one hitcells', () => {
    const spyChangeDirection = jest.spyOn(ai, 'changeDirection');
    const spyChangeOppositeDirection = jest.spyOn(ai, 'oppositeDirection');
    ai.hitCells.push(12);
    ai.hitCells.push(22);
    ai.directionArray.push('right');
    ai.firstShipCoordinates.push(12);
    ai.attackPlayerBoardMiss();
    expect(spyChangeDirection).toHaveBeenCalledTimes(0);
    expect(spyChangeOppositeDirection).toHaveBeenCalledTimes(1);
});

test('test initital direction no edge', () => {
    const direction = ai.initialDirection(33);
    expect(direction).not.toEqual(expect.stringContaining('no'));
});

test('test initital direction with edge', () => {
    const direction = ai.initialDirection(99);
    expect(direction).toEqual(expect.stringContaining('no'));
});

test('test attack player board hit when hitCells is 0, direction down', () => {
    const ship1 = ship(4, 'destroyer');
    ship1.coordinates.push(33, 43, 53, 63);
    ai.attackedCells.push(33);
    ai.initialDirection = jest.fn(() => {
        return 'down'
    });

    const coordinate = ai.attackPlayerBoardHit(33, ship1);
    expect(coordinate).toBe(43);
});

test('test attack player board hit when hitCells is 0, direction left', () => {
    const ship1 = ship(4, 'destroyer');
    ship1.coordinates.push(33, 43, 53, 63);
    ai.attackedCells.push(33);
    ai.initialDirection = jest.fn(() => {
        return 'left'
    });

    const coordinate = ai.attackPlayerBoardHit(33, ship1);
    expect(coordinate).toBe(32);
});

test('test attack player board hit when hitCells is greater than 0', () => {
    const ship1 = ship(4, 'destroyer');
    ship1.coordinates.push(33, 34, 35, 36);
    ai.attackedCells.push(33, 34);
    ai.hitCells.push(33, 34);

    ai.directionArray.push('right');
    const coordinate = ai.attackPlayerBoardHit(35, ship1);
    expect(coordinate).toBe(36);
});

test('test attack player board hit when different ship is hit, hitCells is 1, change direction up', () => {
    const ship1 = ship(4, 'destroyer');
    const ship2 = ship(3, 'aircraft');

    ship1.coordinates.push(33, 34, 35, 36);
    ship2.coordinates.push(32, 42, 52);

    ship1.hit();

    ai.attackedCells.push(33);

    ai.initialDirection = jest.fn(() => {
        return 'left'
    });

    const coordinate = ai.attackPlayerBoardHit(33, ship1);
    expect(coordinate).toBe(32);
    expect(ai.hitCells.length).toBe(1);
    expect(ai.hitShips.length).toBe(1);
    expect(ai.firstShipCoordinates).toEqual([33]);

    ai.changeDirection = jest.fn(() => {
        ai.directionArray.push('up');
    });

    ai.attackedCells.push(32);
    ship2.hit();
    const coordinate2 = ai.attackPlayerBoardHit(32, ship2);
    expect(coordinate2).toBe(23);
    expect(ai.hitCells.length).toBe(1);
    expect(ai.hitShips.length).toBe(2);
    expect(ai.firstShipCoordinates).toEqual([33, 32]);
});

test('test attack player board hit when different ship is hit, hitCells is > 1, change opposite direction', () => {
    const ship1 = ship(4, 'destroyer');
    const ship2 = ship(3, 'aircraft');

    ship1.coordinates.push(33, 34, 35, 36);
    ship2.coordinates.push(32, 42, 52);

    ship1.hit();

    ai.attackedCells.push(34);

    ai.initialDirection = jest.fn(() => {
        return 'left'
    });

    const coordinate = ai.attackPlayerBoardHit(34, ship1);
    expect(coordinate).toBe(33);
    expect(ai.hitCells.length).toBe(1);
    expect(ai.hitShips.length).toBe(1);
    expect(ai.firstShipCoordinates).toEqual([34]);

    ai.attackedCells.push(33);
    ship1.hit();
    const coordinate2 = ai.attackPlayerBoardHit(33, ship1);
    expect(coordinate2).toBe(32);
    expect(ai.hitCells.length).toBe(2);
    expect(ai.hitShips.length).toBe(1);
    expect(ai.firstShipCoordinates).toEqual([34]);

    ai.attackedCells.push(32);
    ship1.hit();
    const coordinate3 = ai.attackPlayerBoardHit(32, ship2);
    expect(coordinate3).toBe(35);
    expect(ai.hitCells.length).toBe(3);
    expect(ai.hitShips.length).toBe(2);
    expect(ai.firstShipCoordinates).toEqual([34, 32]);
});

test('test check for adjacent cells new ship', () => {
    const ship1 = ship(4, 'destroyer');
    ship1.coordinates.push(33, 34, 35, 36);

    ship1.sunk = true;
    ai.hitShips.push(ship1);
    const spyAdjacentCellNewShip = jest.spyOn(ai, 'adjacentCellsNewShip');
    const spyAdjacentCellCurrentShip = jest.spyOn(ai, 'adjacentCellsCurrentShip');
    ai.checkForAdjacentCells();
    expect(spyAdjacentCellNewShip).toHaveBeenCalledTimes(1);
    expect(spyAdjacentCellCurrentShip).toHaveBeenCalledTimes(0);
});

test('test check for adjacent cells current ship', () => {
    const ship1 = ship(4, 'destroyer');
    ship1.coordinates.push(33, 34, 35, 36);

    ai.hitShips.push(ship1);
    const spyAdjacentCellNewShip = jest.spyOn(ai, 'adjacentCellsNewShip');
    const spyAdjacentCellCurrentShip = jest.spyOn(ai, 'adjacentCellsCurrentShip');

    ai.checkForAdjacentCells();
    expect(spyAdjacentCellNewShip).toHaveBeenCalledTimes(0);
    expect(spyAdjacentCellCurrentShip).toHaveBeenCalledTimes(1);
});

test('test adjacentCellsNewShip with first coordinate array being not zero', () => {
    ai.firstShipCoordinates = [34, 88];
    ai.hitCells = [34, 35, 36, 37];

    const ship1 = ship(4, 'destroyer');
    const ship2 = ship(3, 'aircraft');

    ship1.coordinates.push(34, 35, 36, 37);
    ship2.coordinates.push(33, 23, 13);

    ai.hitShips = [ship1, ship2];
    ai.directionArray = ['left', 'up', 'right'];
    const spyInitialDirection = jest.spyOn(ai, 'initialDirection');
    const spyAdjacentCellCurrentShip = jest.spyOn(ai, 'adjacentCellsCurrentShip');
    const spyComputerPick = jest.spyOn(ai, 'computerPick');

    ai.adjacentCellsNewShip();
    expect(spyInitialDirection).toHaveBeenCalledTimes(1);
    expect(spyAdjacentCellCurrentShip).toHaveBeenCalledTimes(1);
    expect(spyComputerPick).toHaveBeenCalledTimes(0);
    expect(ai.firstShipCoordinates).toEqual([88]);
    expect(ai.hitCells.length).toBe(1);
    expect(ai.directionArray.length).toBe(1);
    expect(ai.hitShips).toEqual([ship2]);
});

test('test adjacentCellsNewShip with first coordinate array being zero', () => {
    ai.hitCells = [34, 35, 36, 37];
    ai.firstShipCoordinates = [34]
    const ship1 = ship(4, 'destroyer');

    ship1.coordinates.push(34, 35, 36, 37);

    ai.hitShips = [ship1];
    ai.directionArray = ['left', 'up', 'right'];
    const spyAdjacentCellCurrentShip = jest.spyOn(ai, 'adjacentCellsCurrentShip');
    const spyInitialDirection = jest.spyOn(ai, 'initialDirection');
    const spyComputerPick = jest.spyOn(ai, 'computerPick');

    ai.adjacentCellsNewShip();

    expect(spyInitialDirection).toHaveBeenCalledTimes(0);
    expect(spyAdjacentCellCurrentShip).toHaveBeenCalledTimes(0);
    expect(spyComputerPick).toHaveBeenCalledTimes(1);
    expect(ai.firstShipCoordinates).toEqual([]);
    expect(ai.hitCells.length).toBe(0);
    expect(ai.directionArray.length).toBe(0);
    expect(ai.hitShips).toEqual([]);
});

test('test adjacentCellsCurrentShip left direction with coordinate not in attacked cells', () => {
    ai.directionArray = ['left'];
    ai.hitCells = [33, 32, 31];
    ai.attackedCells = [5, 8, 57, 33, 32, 31];

    const checkAttackedCells = jest.spyOn(ai, 'checkAttackedCells');
    const adjacentCellsChangeDirection = jest.spyOn(ai, 'adjacentCellsChangeDirection');

    const coordinate = ai.adjacentCellsCurrentShip();
    expect(coordinate).toBe(30);
    expect(checkAttackedCells).toHaveBeenCalledTimes(1);
    expect(adjacentCellsChangeDirection).toHaveBeenCalledTimes(0);
});



