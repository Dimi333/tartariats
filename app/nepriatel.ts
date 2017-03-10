/// <reference path="../vendor/phaser.d.ts"/>
declare var Lockr: any;
declare var $: any;

export class Nepriatel extends Phaser.Sprite {
	hrac;
	vrstvaBloky;
	vrstvaMince;
	stromy;
	sipy;
	sipyNepriatelov;
	collideWorldBounds;
	rychlostPohybu;
	sprite;
	zranenie;
	zdravie;
	cielUlohy;
	skusenosti;
	pohybDoX;
	pohybOdX;
	dovidi;
	striela;
	casMedziVystrelmi;
	naboj;
	casStrelby;

	constructor(game, hrac, vlastnosti, vrstvaBloky, vrstvaMince, stromy, sipy, sipyNepriatelov, x, y) {
		super(game, x, y);

		if(	vlastnosti.sprite === "netopier" || 
			vlastnosti.sprite === "slime" ||
			vlastnosti.sprite === "slime2" ||
			vlastnosti.sprite === "kostlivec" ||
			vlastnosti.sprite === "slimeBoss" ||
			vlastnosti.sprite === "ohyzd") {
			this.sprite = Phaser.Sprite.call(this, game, x, y, 'dataFile', vlastnosti.sprite + '01.png');
		} if(vlastnosti.sprite === "netopier2") {
			this.sprite = Phaser.Sprite.call(this, game, x, y, 'dataFile', vlastnosti.sprite + '1.png');
		}

		this.autoCull = true;
		this.game = game;
		this.hrac = hrac;
		this.game.physics.arcade.enable(this);
		this.vrstvaBloky = vrstvaBloky;
		this.vrstvaMince = vrstvaMince;
		this.stromy = stromy;
		this.sipy = sipy;
		this.sipyNepriatelov = sipyNepriatelov;
		this.collideWorldBounds = true;
		this.rychlostPohybu = vlastnosti.rychlostPohybu || 80;
		this.sprite = vlastnosti.sprite;
		this.body.collideWorldBounds = true;
		this.body.bounce.y = 0;
		this.body.bounce.x = 1;
		this.zranenie = vlastnosti.zranenie;
		this.type = vlastnosti.type;
		this.zdravie = vlastnosti.zdravie;
		this.cielUlohy = vlastnosti.cielUlohy;
		this.skusenosti = vlastnosti.skusenosti || 10;
		this.pohybDoX = vlastnosti.pohybDoX;
		this.pohybOdX = vlastnosti.pohybOdX;
		this.dovidi = vlastnosti.dovidi || 300;
		this.striela = vlastnosti.striela || false;
		this.casMedziVystrelmi = vlastnosti.casMedziVystrelmi || 1000;
		this.naboj = vlastnosti.naboj || 'sip';
		this.autoCull = true;
		this.casStrelby = 0;

		//podla typu
		if( String(this.type) === "kostlivec") {
			this.body.gravity.y = 800;
			this.body.velocity.x = this.rychlostPohybu;
			this.animations.add('right', Phaser.Animation.generateFrameNames(this.sprite, 1, 5, '.png', 2), 10, true, false);
			this.animations.add('left', Phaser.Animation.generateFrameNames(this.sprite, 6, 10, '.png', 2), 10, true, false);
			this.animations.play('right');
		}
		if(String(this.type) === "sliz") {
			this.body.gravity.y = 800;
			this.body.velocity.x = this.rychlostPohybu;
			this.animations.add('right', Phaser.Animation.generateFrameNames(this.sprite, 1, 5, '.png', 2), 10, true, false);
			this.animations.add('left', Phaser.Animation.generateFrameNames(this.sprite, 6, 10, '.png', 2), 10, true, false);
			this.animations.play('right');
		}
		if(String(this.type) === "ohyzd") {
			this.body.gravity.y = 800;
			this.body.velocity.x = this.rychlostPohybu;
			this.animations.add('right', Phaser.Animation.generateFrameNames(this.sprite, 1, 6, '.png', 2), 10, true, false);
			this.animations.add('left', Phaser.Animation.generateFrameNames(this.sprite, 7, 12, '.png', 2), 10, true, false);
			this.animations.add('smrt', Phaser.Animation.generateFrameNames(this.sprite, 13, 17, '.png', 2), 10, true, false);
			this.animations.play('right');
		}
		if(this.sprite === "netopier") {
			this.body.gravity.y = 0;
			this.animations.add('let', Phaser.Animation.generateFrameNames(this.sprite, 2, 4, '.png', 2), 10, true, false);
			this.animations.play('let');
		}
		if(vlastnosti.sprite === "netopier2") {
			this.body.gravity.y = 0;
			this.animations.add('let', Phaser.Animation.generateFrameNames(this.sprite, 1, 3, '.png', 1), 10, true, false);
			this.animations.play('let', 13, true);
		}

		if(vlastnosti.neviditelny) {
			this.alpha  = vlastnosti.neviditelny;
		}

		Object.create(Phaser.Sprite.prototype);
	}

	update() {
		var vzdialenostx = Math.abs(this.hrac.x - this.x);
		var vzdialenosty = Math.abs(this.hrac.y - this.y);

		if((vzdialenostx < this.dovidi && vzdialenosty < this.dovidi && this.alive === true) || (this.inCamera === true && this.alive)) {
			if(String(this.type) === "netopier") {
				this.game.physics.arcade.moveToObject(this, this.hrac, this.rychlostPohybu);
			}
			if(this.striela) {
				if(Date.now() > this.casStrelby && this.hrac.x !== this.x)
					if((this.body.velocity.x > 0 && this.hrac.x > this.x) || (this.body.velocity.x < 0 && this.hrac.x < this.x))
						this.strielaj(vzdialenostx);
			}
		} else if(String(this.type) === "netopier") {
			this.body.velocity.x = 0;
			this.body.velocity.y = 0;
		}

		if(String(this.type) === "sliz" || String(this.type) === "kostlivec"  || String(this.type) === "ohyzd") {
			if(this.body.x >= this.pohybDoX) {
				this.animations.play('left', 5, true);
				this.body.velocity.x *= -1;
			}
			if(this.body.x <= this.pohybOdX) {
				this.animations.play('right', 5, true);
				this.body.velocity.x *= -1;
			}
		}
	};

	strielaj(vzdialenostx) {
		// Get the first laser that's inactive, by passing 'false' as a parameter
		var sip = this.sipyNepriatelov.getFirstExists(false, false, 0, 0, 'dataFile', this.naboj + '.png');
		
		if (sip) {
			sip.reset(this.x + 33, this.y + 20);
			sip.rotation = this.game.physics.arcade.angleBetween(sip, this.hrac);
			if(this.casMedziVystrelmi)
				this.casStrelby = Date.now() + this.casMedziVystrelmi;
			else
				this.casStrelby = Date.now() + 1000;
			this.game.physics.arcade.moveToXY(sip, this.hrac.x, this.hrac.y-(vzdialenostx/2), 500);
		}
	};
};