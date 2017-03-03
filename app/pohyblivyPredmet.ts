/// <reference path="../vendor/phaser.d.ts"/>

export class PohyblivyPredmet extends Phaser.Sprite {
	vlastnosti;
	hrac;
	bloky;
	zbieratelnePredmety;
	stromy;
	sipy;
	sipyNepriatelov;
	padajuce;
	zdrzanie;
	zranenie;
	enableBody;

	constructor(sprite, game, x, y, hrac, bloky, stromy, zbieratelnePredmety, sipy, sipyNepriatelov, vlastnosti) {
		super(game, x, y);

		this.game = game;
		this.hrac = hrac;
		this.bloky = bloky;
		this.stromy = stromy;
		this.zbieratelnePredmety = zbieratelnePredmety;
		this.sipy = sipy;
		this.sipyNepriatelov = sipyNepriatelov;
		this.vlastnosti = vlastnosti;
		this.padajuce = vlastnosti.padajuce;
		this.zdrzanie = vlastnosti.zdrzanie || 300;

		if(vlastnosti.zranenie)
			this.zranenie = vlastnosti.zranenie;
		else
			this.zranenie = 0;

		if(vlastnosti.sprite === "krabica" || 
		vlastnosti.sprite === "krabica2" ||
		vlastnosti.sprite === "krabica3" ||
		vlastnosti.sprite === "jezko") {
			sprite = Phaser.Sprite.call(this, game, x, y, 'dataFile', vlastnosti.sprite + '.png');
		} else {
			Phaser.Sprite.call(this, game, x, y, vlastnosti.sprite);   
		}

		this.game.add.existing(this);
		this.game.physics.arcade.enable(this);
		this.enableBody = true;
		this.body.collideWorldBounds = true;
		this.body.gravity.y = 700;

		if(this.vlastnosti.pohyblive) {
			this.body.immovable = false;
			this.body.moves = true;
			this.body.mass = 110;
			this.body.drag.x = 450;
		} else {
			this.body.immovable = true;
			this.body.moves = false;
			this.body.mass = 110;
		}

		if(vlastnosti.type) {
			this.type = vlastnosti.type;
		}
		Object.create(Phaser.Sprite.prototype);
	}

	update() {
		if((Math.abs(this.hrac.x - this.x) <= 40 && this.hrac.y > this.y) && this.vlastnosti.type === 'pasca') {
			this.body.moves = true;
		}

		this.game.physics.arcade.collide(this, this.bloky);

		this.game.physics.arcade.collide(this, this.stromy);

		this.game.physics.arcade.overlap(this, this.sipy, function (tento, tenDruhy) {
			if(tento.vlastnosti.zdravie && tento.vlastnosti.znicitelne === true) {
				
				tento.vlastnosti.zdravie -= 25;
				
				if(tento.vlastnosti.zdravie <= 0) {
					tento.kill();
				}
			}
			tenDruhy.kill();
		});

		this.game.physics.arcade.overlap(this, this.sipyNepriatelov, function (tento, tenDruhy) {
			if(tento.vlastnosti.zdravie && tento.vlastnosti.znicitelne === true) {
				tento.vlastnosti.zdravie -= 25;
				
				if(tento.vlastnosti.zdravie <= 0) {
					tento.kill();
				}
			}
			tenDruhy.kill();
		});
	};

	obnov() {
		this.vlastnosti.zdravie = this.vlastnosti.plneZdravie || 50;
	};
};