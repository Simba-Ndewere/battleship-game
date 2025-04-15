function player(gameBoard) {
    return {
        board: gameBoard,

        getGameBoard: function() {
            return this.board;
        },

        addGameBoard: function(board) {
            this.gameBoard = board;
        }
    }

}

export default player;