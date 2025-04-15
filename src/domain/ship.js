function shipObject(shipLength, name) {
    return {
        length: shipLength,
        sunk: false,
        hitSum: 0,
        coordinates: [],
        shipName: name,

        hit: function () {
            this.hitSum = this.hitSum + 1;
        },

        isSunk: function () {
            return this.sunk;
        },

        getCoordinates: function () {
            return this.coordinates;
        },

        addCoordinates: function(coordinates) {
            this.coordinates = coordinates;
        }
    }
}

export default shipObject;