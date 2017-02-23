/// <reference path="../vendor/phaser.d.ts"/>
declare var Lockr: any;

export class Boot extends Phaser.State {
	constructor() {
		super();
	}

	init() {
		//scaling options
		if(Lockr.get('skalovanie'))
			var skalovanie = Number(Lockr.get('skalovanie'));

		if(skalovanie === 1)
			this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		else
			this.game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
			
		this.game.renderer.renderSession.roundPixels = true;
		//Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
		this.game.scale.minWidth = 240;
		this.game.scale.minHeight = 170;
		this.game.scale.maxWidth = 2880;
		this.game.scale.maxHeight = 1920;

		//have the game centered horizontally
		this.game.scale.pageAlignHorizontally = true;
		this.game.scale.pageAlignVertically = true;

		//physics system for movement
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
	}

	preload() {
		//assets we'll use in the loading screen
		this.load.image('nacitavanie', 'assets/obr/nacitavanie.jpg');
	}

	create() {
		this.state.start('Preload');
	}
}