/// <reference path="./vendor/phaser.d.ts"/>
import {Meno} from './app/Meno';
declare var Lockr: any;

class Tartaria {
    constructor() {
        this.game = new Phaser.Game(Lockr.get('sirka'), Lockr.get('vyska'), Phaser.AUTO, 'telo', { preload: this.preload, create: this.create });
    }

    game: Phaser.Game;

    preload() {
        this.game.load.image('logo', 'assets/obr/phaser.png');
    }

    create() {
        var logo = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        logo.anchor.setTo(0.5, 0.5);
    }

}

window.onload = () => {
	if(!Lockr.get('sirka') && !Lockr.get('vyska') && !Lockr.get('skalovanie')) {
		Lockr.set('sirka', 768);
		Lockr.set('vyska', 432);
		Lockr.set('skalovanie', 0);
	}

    var game = new Tartaria();
};