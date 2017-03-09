/// <reference path="../vendor/phaser.d.ts"/>
declare var Lockr: any;
declare var $: any;

import {Hrac} from './hrac';
import {PohyblivyPredmet} from './pohyblivyPredmet';
import {Nepriatel} from './nepriatel';
import * as ulohy from './ulohy';

export class Game extends Phaser.State {
	constructor() {
		super();
	}

	uroven:string;
	zaciatok_urovnex:number;
	zaciatok_urovney:number;
	kameraX:number;
	map:any;
	nazovMapy:string;
	vrstvaParallax: any;
	vrstvaPozadie: any;
	vrstvaStromy;
	vrstvaBloky;
	sipy;
	sipyNepriatelov;
	coins;
	nepriatelia;
	pohybliveVeci;
	vrstvaPopredie;
	player;
	naboj;
	nazovMapyText;
	//inventar;

	init(uroven, zaciatok_urovnex, zaciatok_urovney) {
		//reset urovne
		if(Lockr.get('vlastnosti')) {
			var vlastnosti = Lockr.get('vlastnosti');
			this.uroven = vlastnosti.uroven;
			this.zaciatok_urovnex = vlastnosti.kdeMaZacatx;
			this.zaciatok_urovney = vlastnosti.kdeMaZacaty;
		} else {
			this.uroven = uroven;
			this.zaciatok_urovnex = zaciatok_urovnex;
			this.zaciatok_urovney = zaciatok_urovney;
		}
	}

	preload() {
		this.game.time.advancedTiming = true;
		this.game.time.desiredFPS = 30;
    }

	premenne() {
		this.kameraX = 0;
	}

 	create() {
		$('#nastavenia').hide();
		this.camera.flash(0x000000);
		this.game.world.setBounds(0, 0, 640, 480);
		this.game.stage.backgroundColor = "#4488AA";
		this.map = this.game.add.tilemap(this.uroven);
		this.nazovMapy = this.map.layers[0].properties.nazovMapy;
		this.map.addTilesetImage('zakladne', 'dlazdice');

		/*var myBitmap = this.game.add.bitmapData(this.game.world.width, this.game.world.height);
		var grd=myBitmap.context.createLinearGradient(0,0,0,500);
		grd.addColorStop(0,"blue");
		grd.addColorStop(1,"white");
		myBitmap.context.fillStyle=grd;
		myBitmap.context.fillRect(0,0,this.game.world.width, this.game.world.height);
		var lol = this.game.add.sprite(0,0, myBitmap);*/

		this.vrstvaParallax = this.map.createLayer('parallax'); //oblaciky a spol
		this.vrstvaPozadie = this.map.createLayer('pozadie'); //da sa pred nim ist
		this.vrstvaStromy = this.map.createLayer('stromy'); //da sa po nich liezt
		this.vrstvaBloky = this.map.createLayer('bloky'); //zastavia hraca
		this.map.setCollisionBetween(1, 100000, true, 'bloky');
		this.map.setCollisionBetween(1, 100000, true, 'stromy');

		//parallax
		if(Lockr.get('paralax') === 1 && typeof this.vrstvaParallax != 'undefined') {
			this.vrstvaParallax.scrollFactorX  = .8;
			this.vrstvaParallax.scrollFactorY  = .8;
			this.vrstvaParallax.tint = 0x7DB9E8;
		}

		this.sipy = this.game.add.group();
		this.sipyNepriatelov = this.game.add.group();
		this.coins = this.game.add.group();
		this.nepriatelia = this.game.add.group();
		this.pohybliveVeci = this.game.add.group();

		//resizes the game world to match the layer dimensions
		this.vrstvaBloky.resizeWorld();
		//lol.scale.set(100, 100);
		this.vytvorZbieratelnePredmety();

		this.vrstvaPopredie = this.map.createLayer('popredie'); //da sa za nim ist
		
		//hrac
		var vlastnosti = Lockr.get('vlastnosti');
		var vlastnostiHraca = {};

		if(vlastnosti) {
			vlastnostiHraca = vlastnosti;
		} else {
			vlastnostiHraca = {
				rychlostPohybu: 850,
				vyskaSkoku: 500,
				gravitacia: 700,
				plneZdravie: Number(localStorage.getItem('plneZdravie')) || 300,
				zdravie: Number(localStorage.getItem('zdravie')) || 300,
				peniaze: Number(localStorage.getItem('peniaze')) || 0,
				uroven: this.uroven,
				zrychlenie: 20,
				spomalenie: 30,
				zrychlenieSkoku: 40,
				skusenosti: 0,
				urovenPostavy: 1
			};
		}
		this.player = new Hrac(this.game, this.zaciatok_urovnex, this.zaciatok_urovney, this.pohybliveVeci, this.vrstvaPopredie, this.vrstvaBloky, this.vrstvaStromy, this.coins, this.nepriatelia, this.sipy, this.sipyNepriatelov, vlastnostiHraca);
		this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, .5, .5);
		
		this.vytvorNepriatelov();

		this.game.world.swap(this.player, this.vrstvaPopredie);

        //sipy nepriatelov
        this.sipyNepriatelov.enableBody = true;
        this.sipyNepriatelov.physicsBodyType = Phaser.Physics.ARCADE;
        this.sipyNepriatelov.createMultiple(10, this.naboj);
        this.sipyNepriatelov.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', this.resetSip);
        this.sipyNepriatelov.callAll('anchor.setTo', 'anchor', 0.5, 1.0);
        this.sipyNepriatelov.setAll('checkWorldBounds', true);
		this.sipyNepriatelov.setAll('body.gravity.y', 500);
        
		//vypne koliziu so stromami zo spodu a z bokov
		this.map.layers[this.vrstvaStromy.index].data.forEach(function(pole) {
			pole.forEach(function(dlazdica) {
				if(dlazdica.index > 0) {
					dlazdica.collideDown = false;
					dlazdica.collideRight = false;
					dlazdica.collideLeft = false;
					dlazdica.collideUp = true;
				}
			});
		});

		//nazov mapy
		this.nazovMapyText = this.game.add.text(0, 0 , this.nazovMapy, { font: 'system', fontSize: '25px', fill: '#fff', boundsAlignH: "center", boundsAlignV: "middle" });
		this.nazovMapyText.setTextBounds(0, 0, this.game.camera.width, 50);
		this.nazovMapyText.fixedToCamera = true;
		this.nazovMapyText.stroke = '#000';
		this.nazovMapyText.strokeThickness = 5;

		//pocasie
		if(this.map.layers[0].properties.pocasie === 'snezi') {
			var emitter = this.game.add.emitter(0, 0, 400);
			emitter.makeParticles('dataFile', 'vlocka.png');
			emitter.minParticleSpeed.setTo(-15, 10);
			emitter.maxParticleSpeed.setTo(15, 	80);
			emitter.minParticleScale = 0.1;
			emitter.maxParticleScale = 0.2;
			emitter.blendMode = PIXI.blendModes.ADD;
			emitter.width = this.game.world.width * 2.1;
			emitter.gravity = new Phaser.Point(1, 100);
			emitter.start(false, 3600, 5, 0);
		}

		//fauna a flora
		if(this.map.layers[0].properties.prostredie === 'les') {
			var emitter2 = this.game.add.emitter(0, 600, 15);
			emitter2.makeParticles('dataFile', 'list.png');
			emitter2.minParticleSpeed.setTo(100, 0);
			emitter2.maxParticleSpeed.setTo(2000, 0);
			emitter2.minParticleScale = 0.8;
			emitter2.maxParticleScale = 1.2;
			emitter2.blendMode = PIXI.blendModes.ADD;
			emitter2.height = this.game.world.height * 2.1;
			emitter2.gravity = new Phaser.Point(0, 10);
			emitter2.start(false, 6600, 5, 0);
		}

		this.game.physics.arcade.TILE_BIAS = 32;
	}

	update() {
		//naklananie sipov podla drahy
		this.sipyNepriatelov.forEachAlive(function(bullet) {
			bullet.rotation = Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x);
		}, this);

		this.game.physics.arcade.collide(this.sipyNepriatelov, this.vrstvaBloky, this.resetSip, null, this);

		this.game.physics.arcade.collide(this.nepriatelia, this.vrstvaBloky, function (nepriatel, platform) {
            if (nepriatel.body.blocked.right) {
                nepriatel.animations.play('left', 5, true);
                nepriatel.body.velocity.x *= -1;
            }
            if (nepriatel.body.blocked.left) {
                nepriatel.animations.play('right', 5, true);
                nepriatel.body.velocity.x *= -1;
            }
        }, function(nepriatel, platform) {
			return nepriatel.type != 'netopier';
		}, this);

		this.game.physics.arcade.collide(this.nepriatelia, this.vrstvaStromy, function (nepriatel, platform) {
            if (nepriatel.body.blocked.right) {
                nepriatel.animations.play('left', 5, true);
                nepriatel.body.velocity.x *= -1;
            }
            if (nepriatel.body.blocked.left) {
                nepriatel.animations.play('right', 5, true);
                nepriatel.body.velocity.x *= -1;
            }
        }, function(nepriatel, platform) {
			return nepriatel.type != 'netopier';
		}, this);

		this.game.physics.arcade.overlap(this.nepriatelia, this.sipy, function (nepriatel, platform) {
			nepriatel.zdravie -= 25;

			if(nepriatel.zdravie <= 0) {
				ulohy.nepriatel_zabitaBytost(nepriatel);	//aby o tom vedel quest system
				this.player.pridajSkusenosti(nepriatel.skusenosti);

				if(nepriatel.animations._anims.smrt) {
					nepriatel.body.velocity.x = 0;
					var shouldLoop = false, killOnComplete = true;
					nepriatel.animations.play('smrt', 10, shouldLoop, killOnComplete);
				} else {
					nepriatel.kill();
				}
			}
			
			platform.kill();
		}, null, this);
 	}

	resetSip(sip) {
		sip.kill();
	}

	findObjectsByType(type, map, layerName) {
		var result = new Array();

		map.objects[layerName].forEach(function(element){
			if(element.properties.type === type) {	
				//Phaser uses top left, Tiled bottom left so we have to adjust
				//also keep in mind that some images could be of different size as the tile size
				//so they might not be placed in the exact position as in Tiled
				element.y -= map.tileHeight;

				result.push(element);
			}     
		});

		return result;
	}

	createFromTiledObject(element, group, druh) {
		switch(druh) {
			case 'mince':
				if(element.properties.sprite === 'zlataMinca') {
					let sprite = group.create(element.x, element.y, 'dataFile', element.properties.sprite + '01.png');
					sprite.animations.add('otacaniesa', Phaser.Animation.generateFrameNames(element.properties.sprite, 1, 11, '.png', 2), 10, true, false);
					sprite.animations.play('otacaniesa');
					sprite.autoCull = true;

					//copy all properties to the sprite
					Object.keys(element.properties).forEach(function(key) {
						sprite[key] = element.properties[key];
					});
				}
				if(element.properties.sprite === 'diamant') {
					let sprite = group.create(element.x, element.y, 'dataFile', element.properties.sprite + '.png');
					sprite.autoCull = true;

					//copy all properties to the sprite
					Object.keys(element.properties).forEach(function(key) {
						sprite[key] = element.properties[key];
					});
				}
				break;
			case 'lava':
				let sprite = group.create(element.x, element.y, 'dataFile', element.properties.sprite + '01.png');
				sprite.animations.add('prudenie', Phaser.Animation.generateFrameNames(element.properties.sprite, 1, 31, '.png', 2), 10, true, false);
				sprite.animations.play('prudenie');
				sprite.autoCull = true;

				//copy all properties to the sprite
				Object.keys(element.properties).forEach(function(key) {
					sprite[key] = element.properties[key];
				});
				break;
			case 'dvere':
				if(element.properties.sprite === 'teleport') {
					sprite = group.create(element.x, element.y, 'dataFile', element.properties.sprite + '01.png');
					sprite.animations.add('tocenie', Phaser.Animation.generateFrameNames(element.properties.sprite, 1, 9, '.png', 2), 10, true, false);
					sprite.animations.play('tocenie');
				}
				else if(element.properties.sprite) {
					sprite = group.create(element.x, element.y, 'dataFile', element.properties.sprite + '.png');
				} else {
					sprite = group.create(element.x, element.y, 'dataFile', 'neviditelny.png');
				}
				if(element.properties.vstupNaPoziadanie === true) {
					var child = sprite.addChild(this.game.make.sprite(-50, -110, 'dataFile', 'dvereBublina.png'));
					child.visible = false;
				}
				sprite.autoCull = true;

				//copy all properties to the sprite
				Object.keys(element.properties).forEach(function(key) {
					sprite[key] = element.properties[key];
				});
				break;
			case 'ovocie':
				sprite = group.create(element.x, element.y, 'dataFile', element.properties.sprite + '.png');
				sprite.autoCull = true;

				//copy all properties to the sprite
				Object.keys(element.properties).forEach(function(key) {
					sprite[key] = element.properties[key];
				});
				break;
			case 'nepriatel':
				sprite = group.create(element.x, element.y, 'dataFile', 'jezko.png');
				sprite.autoCull = true;

				//copy all properties to the sprite
				Object.keys(element.properties).forEach(function(key) {
					sprite[key] = element.properties[key];
				});
				break;
			case 'fakla':
				sprite = group.create(element.x, element.y, 'dataFile', 'fakla.png');
				sprite.autoCull = true;

				var emitter = this.game.add.emitter(element.x+16, element.y+16, 0);
					emitter.makeParticles('dataFile', 'plamen.png', 10, false, false);

					emitter.minParticleSpeed.setTo(-15, 10);
					emitter.maxParticleSpeed.setTo(15, -100);
					emitter.minParticleScale = 0.1;
					emitter.maxParticleScale = 0.5;
					emitter.blendMode = PIXI.blendModes.ADD;
					emitter.gravity = new Phaser.Point(0, -45);
					emitter.start(false, 300, 5);

				//copy all properties to the sprite
				Object.keys(element.properties).forEach(function(key) {
					sprite[key] = element.properties[key];
				});
				break;
			case 'teleport':
				if(element.properties.sprite === 'teleport' && element.properties.sprite !== 'neviditelny') {
					sprite = group.create(element.x, element.y, 'dataFile', element.properties.sprite + '01.png');

					sprite.animations.add('tocenie', Phaser.Animation.generateFrameNames(element.properties.sprite, 1, 9, '.png', 2), 10, true, false);
					sprite.animations.play('tocenie');
				} else {
					sprite = group.create(element.x, element.y, 'dataFile', 'neviditelny.png');
				}

				sprite.autoCull = true;

				//copy all properties to the sprite
				Object.keys(element.properties).forEach(function(key) {
					sprite[key] = element.properties[key];
				});

				break;
			case 'carodejnica':
				sprite = group.create(element.x, element.y, 'dataFile', element.properties.sprite + '01.png');

				sprite.animations.add('otacanie', Phaser.Animation.generateFrameNames(element.properties.sprite, 1, 16, '.png', 2), 10, true, false);
				sprite.animations.play('otacanie');
				var child = sprite.addChild(this.game.make.sprite(-45, -100, 'dataFile', 'chatBublina.png'));
				child.visible = false;
				sprite.autoCull = true;

				//copy all properties to the sprite
				Object.keys(element.properties).forEach(function(key) {
					sprite[key] = element.properties[key];
				});
				break;
			case 'lahkaZena':
				sprite = group.create(element.x, element.y, 'dataFile', element.properties.sprite + '01.png');

				sprite.animations.add('otacanie', Phaser.Animation.generateFrameNames(element.properties.sprite, 1, 16, '.png', 2), 10, true, false);
				sprite.animations.play('otacanie');
				var child = sprite.addChild(this.game.make.sprite(-45, -100, 'dataFile', 'chatBublina.png'));
				child.visible = false;
				sprite.autoCull = true;

				//copy all properties to the sprite
				Object.keys(element.properties).forEach(function(key) {
					sprite[key] = element.properties[key];
				});
				break;
			case 'zena':
				sprite = group.create(element.x, element.y, 'dataFile', element.properties.sprite + '1.png');

				sprite.animations.add('otacanie', Phaser.Animation.generateFrameNames(element.properties.sprite, 1, 4, '.png', 1), 1, true, false);
				sprite.animations.play('otacanie');
				var child = sprite.addChild(this.game.make.sprite(5, -100, 'dataFile', 'chatBublina.png'));
				child.visible = false;
				sprite.autoCull = true;

				//copy all properties to the sprite
				Object.keys(element.properties).forEach(function(key) {
					sprite[key] = element.properties[key];
				});
				break;
			case 'obchodnik':
				sprite = group.create(element.x, element.y, 'dataFile', element.properties.sprite + '1.png');

				sprite.animations.add('otacanie', Phaser.Animation.generateFrameNames(element.properties.sprite, 1, 4, '.png', 1), 1, true, false);
				sprite.animations.play('otacanie');
				var child = sprite.addChild(this.game.make.sprite(5, -100, 'dataFile', 'nakupBublina.png'));
				child.visible = false;
				sprite.autoCull = true;

				//copy all properties to the sprite
				Object.keys(element.properties).forEach(function(key) {
					sprite[key] = element.properties[key];
				});
				break;
			case 'carodejnik':
				sprite = group.create(element.x, element.y, 'dataFile', element.properties.sprite + '1.png');

				sprite.animations.add('otacanie', Phaser.Animation.generateFrameNames(element.properties.sprite, 1, 3, '.png', 1), 1, true, false);
				sprite.animations.play('otacanie');
				var child = sprite.addChild(this.game.make.sprite(5, -100, 'dataFile', 'chatBublina.png'));
				child.visible = false;
				sprite.autoCull = true;

				//copy all properties to the sprite
				Object.keys(element.properties).forEach(function(key) {
					sprite[key] = element.properties[key];
				});
				break;
			default:
				sprite = group.create(element.x, element.y, element.properties.sprite);

				if(druh === 'banner') {
					var banText = this.game.add.text(element.x, element.y, element.properties.text, { font: 'VT323', fontSize: element.properties.txtVelkost, fill: element.properties.txtFarba });
					banText.stroke = element.properties.txtFarbaTahu;
					banText.strokeThickness = Number(element.properties.txtHrubkaTahu);
					//  Apply the shadow to the Stroke only
					banText.setShadow(2, 2, "#333333", 2, true, false);
				}

				sprite.autoCull = true;
				//copy all properties to the sprite
				Object.keys(element.properties).forEach(function(key) {
					sprite[key] = element.properties[key];
				});
				break;
		}
	}

	vytvorNepriatelov() {
		this.nepriatelia.enableBody = true;

		//vytvorenie veci pre ulohu
		if(Lockr.get('plnenaUloha')) {
			ulohy.game_pripravVeciPreUlohu(this);
		}

		//pichliac
		var result = this.findObjectsByType('nepriatel', this.map, 'objekty');
		result.forEach(function(element){
			this.createFromTiledObject(element, this.nepriatelia, 'nepriatel');
		}, this);

		var result = this.findObjectsByType('sliz', this.map, 'objekty');	
		result.forEach(function(element){
			//nepriatel
			var sliz = new Nepriatel(this.game, this.player, element.properties, this.vrstvaBloky, this.coins, this.vrstvaStromy, this.sipy, this.sipyNepriatelov, element.x, element.y);
			this.nepriatelia.add(sliz);
		}, this);

		var result = this.findObjectsByType('ohyzd', this.map, 'objekty');	
		result.forEach(function(element){
			//nepriatel
			var ohyzd = new Nepriatel(this.game, this.player, element.properties, this.vrstvaBloky, this.coins, this.vrstvaStromy, this.sipy, this.sipyNepriatelov,element.x, element.y);
			this.nepriatelia.add(ohyzd);
		}, this);

		var result = this.findObjectsByType('netopier', this.map, 'objekty');	
		result.forEach(function(element){
			//nepriatel
			var neto = new Nepriatel(this.game, this.player, element.properties, this.vrstvaBloky, this.coins, this.vrstvaStromy, this.sipy, this.sipyNepriatelov, element.x, element.y);
			this.nepriatelia.add(neto);
		}, this);

		var result = this.findObjectsByType('kostlivec', this.map, 'objekty');	
		result.forEach(function(element){
			//nepriatel
			var kosto = new Nepriatel(this.game, this.player, element.properties, this.vrstvaBloky, this.coins, this.vrstvaStromy, this.sipy, this.sipyNepriatelov, element.x, element.y);
			this.nepriatelia.add(kosto);
		}, this);

		var result = this.findObjectsByType('pohyblive', this.map, 'objekty');
		result.forEach(function(element){
			var poh = new PohyblivyPredmet(element.properties.sprite, this.game, element.x, element.y, this.player, this.vrstvaBloky, this.vrstvaStromy, this.coins, this.sipy, this.sipyNepriatelov, element.properties)
			poh.obnov();
			this.pohybliveVeci.add(poh);
		}, this);

		var result = this.findObjectsByType('pasca', this.map, 'objekty');
		result.forEach(function(element){
			var pas = new PohyblivyPredmet(element.properties.sprite, this.game, element.x, element.y, this.player, this.vrstvaBloky, this.vrstvaStromy, this.coins, this.sipy, this.sipyNepriatelov, element.properties)
			pas.obnov();
			this.nepriatelia.add(pas);
		}, this);
	}

	vytvorZbieratelnePredmety() {
		this.coins.enableBody = true;

		var result = this.findObjectsByType('dvere', this.map, 'objekty');
		result.forEach(function(element){
			this.createFromTiledObject(element, this.coins, 'dvere');
		}, this);

		var result = this.findObjectsByType('minca', this.map, 'objekty');
		result.forEach(function(element){
			this.createFromTiledObject(element, this.coins, 'mince');
		}, this);

		var result = this.findObjectsByType('teleport', this.map, 'objekty');
		result.forEach(function(element){
			this.createFromTiledObject(element, this.coins, 'teleport');
		}, this);

		var result = this.findObjectsByType('lava', this.map, 'objekty');
		result.forEach(function(element){
			this.createFromTiledObject(element, this.coins, 'lava');
		}, this);

		var result = this.findObjectsByType('ovocie', this.map, 'objekty');
		result.forEach(function(element){
			this.createFromTiledObject(element, this.coins, 'ovocie');
		}, this);

		var result = this.findObjectsByType('banner', this.map, 'objekty');	
		result.forEach(function(element){
			this.createFromTiledObject(element, this.coins, 'banner');
		}, this);

		var result = this.findObjectsByType('obchodnik', this.map, 'objekty');
		result.forEach(function(element){
			this.createFromTiledObject(element, this.coins, 'obchodnik');
		}, this);

		var result = this.findObjectsByType('carodejnica', this.map, 'objekty');
		result.forEach(function(element){
			this.createFromTiledObject(element, this.coins, 'carodejnica');
		}, this);

		var result = this.findObjectsByType('lahkaZena', this.map, 'objekty');
		result.forEach(function(element){
			this.createFromTiledObject(element, this.coins, 'carodejnica');
		}, this);

		var result = this.findObjectsByType('carodejnik', this.map, 'objekty');
		result.forEach(function(element){
			this.createFromTiledObject(element, this.coins, 'carodejnik');
		}, this);

		var result = this.findObjectsByType('fakla', this.map, 'objekty');
		result.forEach(function(element){
			this.createFromTiledObject(element, this.coins, 'fakla');
		}, this);

		var result = this.findObjectsByType('zena', this.map, 'objekty');
		result.forEach(function(element){
			this.createFromTiledObject(element, this.coins, 'zena');
		}, this);
	}

	render()	{
		this.game.debug.text(String(this.game.time.fps), this.game.camera.width-80, 70, "#00ff00", "40px Courier");  
		//this.game.debug.cameraInfo(this.game.camera, 32, 32);
	}
}