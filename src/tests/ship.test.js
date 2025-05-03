import shipObject from '../domain/ship'

test('ship object', () => {
    expect(shipObject(4)).toMatchObject({
        length: 4,
        sunk: false,
        hitSum: 0,
        coordinates: [],
    });
    expect(shipObject(3)).toHaveProperty("hit");
    expect(shipObject(3)).toHaveProperty("isSunk");
    expect(shipObject(3)).toHaveProperty("getCoordinates");
});

test('ship is hit test', () => {
    const data = shipObject(3);
    expect(data.hitSum).toBe(0);
    data.hit();
    expect(data.hitSum).toBe(1);
});