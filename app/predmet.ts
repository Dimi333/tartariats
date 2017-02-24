/// <reference path="../vendor/phaser.d.ts"/>

export class Predmet extends Phaser.Sprite {
	hrac;
	bloky;
	stromy;
	zbieratelnePredmety;
	sipy;
	vlastnosti;
	enableBody;

	constructor(sprite, game, x, y, hrac, bloky, stromy, zbieratelnePredmety, sipy, vlastnosti) {
		super(game, x, y);

		this.hrac = hrac;
		this.bloky = bloky;
		this.stromy = stromy;
		this.zbieratelnePredmety = zbieratelnePredmety;
		this.sipy = sipy;
		this.vlastnosti = vlastnosti;

		Phaser.Sprite.call(this, this.game, x, y, 'dataFile', sprite + '.png');
		this.game.add.existing(this);

		this.game.physics.arcade.enable(this);
		this.enableBody = true;
		this.body.collideWorldBounds = true;
		this.body.gravity.y = 700;

		if(vlastnosti.type) {
			this.type = vlastnosti.type;
		}

		Object.create(Phaser.Sprite.prototype);
	}

	update() {
		this.game.physics.arcade.collide(this, this.bloky, function (tento, tenDruhy) {
		});

		//this.game.physics.arcade.collide(this.zbieratelnePredmety);

		this.game.physics.arcade.collide(this, this.stromy, function (tento, tenDruhy) {
		});

		this.game.physics.arcade.collide(this, this.hrac, function (tento, tenDruhy) {
			tento.kill();
		});
	}
}