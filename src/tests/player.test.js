import player from '../domain/player'

test('player object test', () => {
    const gameboard = [0,6];
    expect(player(gameboard).getGameBoard()).toEqual([0,6]);
});