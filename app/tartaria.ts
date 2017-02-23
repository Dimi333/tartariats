/// <reference path="../vendor/phaser.d.ts"/>
declare var Lockr: any;

import {Boot} from './boot';
import {Nastavenia} from './nastavenia';
import {Preload} from './preload';
import {Game} from './game';

export class Tartaria {
	game: Phaser.Game;

	constructor() {
		this.game = new Phaser.Game(Number(Lockr.get('sirka')), Number(Lockr.get('vyska')));

		this.game.state.add("Boot", Boot);
		this.game.state.add("Preload", Preload);
		this.game.state.add("Game", Game);
		this.game.state.add("Nastavenia", Nastavenia);
		this.game.state.start("Boot");
	}
}

/*export class TitleScreenState extends Phaser.State {
	game: Phaser.Game;

	constructor() {
		super();
	}
	
	titleScreenImage: Phaser.Sprite;

	preload() {
		this.load.image('logo', 'assets/obr/phaser.png');
	}

	create() {
		this.titleScreenImage = this.add.sprite(0, 0, "logo");
		this.input.onTap.addOnce(this.titleClicked, this); // <-- that um, this is extremely important
	}

	titleClicked (){
		this.game.state.start("GameRunningState");
	}
}

export class GameRunningState extends Phaser.State {
	constructor() {
		super();
	}

	textValue: Phaser.Text;
	updateCount: number;

	create() {
		var style = { font: "65px Arial", fill: "#ff0000", align: "center" };
		this.textValue = this.game.add.text(0, 0, "0", style);
		this.updateCount = 0;
	}

	update() {
		this.textValue.text = (this.updateCount++).toString();
	}

	render() {
		this.game.debug.text("This is drawn in render()", 0, 80);
	}
}*/