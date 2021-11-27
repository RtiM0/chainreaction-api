const Game = require('./game');

module.exports = class Room {
    constructor(id) {
        this.id = id;
        this.started = false;
        this.availableColors = ['green','blue','yellow','pink','indigo','purple','gray'];
        this.players = [{name:id,color:'red'}];
        this.game = {};
    }

    add(id) {
        if (this.availableColors.length>0) {
            this.players.push({name:id,color:this.availableColors.shift()});
            return true;
        }
        return false;
    }

    remove(id) {
        this.availableColors.unshift(this.players.find(e => e.name===id).color);
        this.players = this.players.filter(e => e.name!==id);
    }

    makeGame() {
        this.game = new Game({players: this.players});
    }
}