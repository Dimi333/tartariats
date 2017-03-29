/// <reference path="../vendor/phaser.d.ts"/>
declare var Lockr: any;
declare var $: any;
import * as ulohy from './ulohy';
import {UI} from './ui';
import { Inventar } from './inventar';

export class Hrac extends Phaser.Sprite {
	bloky;
	stromy;
	vlastnosti;
	nepriatelia;
	zbieratelnePredmety;
	sipyNepriatelov;
	pohybliveVeci;
	popredie;
	enableBody;
	cursors;
	spaceKey;
	rctrlKey;
	tildaKey;
	escKey;
	resetKey;
	akcneTlacidlo;
	hsKey;
	wasd;
	wasdSipky;
	ulozKey;
	sipy;
	otocenie;
	casStrelby;
	jeVoVode;
	zobrazenaBublina;
	znenie:string = "0.1.25";
	ui;
	inventar;
	dennikGroup;
	dennik;
	dennikKey;
	splneneUlohy:Array<string> = [];

	constructor(game, kdeMaZacatx, kdeMaZacaty, pohybliveVeci, popredie, bloky, stromy, zbieratelnePredmety, nepriatelia, sipy, sipyNepriatelov, vlastnosti) {
		super(game, kdeMaZacatx, kdeMaZacaty);

		this.ui = new UI();

		this.game = game;
		this.bloky = bloky;
		this.stromy = stromy;
		this.vlastnosti = vlastnosti;
		this.nepriatelia = nepriatelia;
		this.zbieratelnePredmety = zbieratelnePredmety;
		this.sipyNepriatelov = sipyNepriatelov;
		this.pohybliveVeci = pohybliveVeci;
		this.popredie = popredie;

		if(!kdeMaZacatx || !kdeMaZacaty) {
			kdeMaZacatx = 150;
			kdeMaZacaty = 0;
		}

		Phaser.Sprite.call(this, this.game, Number(kdeMaZacatx), Number(kdeMaZacaty), 'dataFile', 'postava05.png');

		this.game.add.existing(this);

		this.game.physics.arcade.enable(this);
		this.enableBody = true;
		this.body.mass = 100;
		this.body.maxVelocity.setTo(500, 5000); // x, y
		this.body.drag.setTo(1200, 100); // x, y

		this.animations.add('left', Phaser.Animation.generateFrameNames('postava', 1, 4, '.png', 2), 10, true, false);
		this.animations.add('right', Phaser.Animation.generateFrameNames('postava', 6, 10, '.png', 2), 10, true, false);
		this.animations.add('stop', Phaser.Animation.generateFrameNames('postava', 5, 5, '.png', 2), 0, true, false);
		
		/*this.animations.add('left', [0, 1, 2, 3], 10, true);
		this.animations.add('right', [5, 6, 7, 8], 10, true);*/

		this.body.gravity.y = vlastnosti.gravitacia;
		//this.body.bounce.x = 10;
		
		if(this.vlastnosti.type) {
			this.type = vlastnosti.type;
		}

		this.cursors = this.game.input.keyboard.createCursorKeys();

		this.spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.rctrlKey = this.game.input.keyboard.addKey(Phaser.Keyboard.CONTROL);
		this.dennikKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
		this.tildaKey = this.game.input.keyboard.addKey(Phaser.Keyboard.N);
		this.escKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
		this.resetKey = this.game.input.keyboard.addKey(Phaser.Keyboard.L);
		this.akcneTlacidlo = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
		this.hsKey = this.game.input.keyboard.addKey(Phaser.Keyboard.K);
		this.wasd = {
			up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
			down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
			left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
			right: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
		};
		this.wasdSipky = {
			up: this.game.input.keyboard.addKey(Phaser.Keyboard.UP),
			down: this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
			left: this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
			right: this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
		};
		this.ulozKey = this.game.input.keyboard.addKey(Phaser.Keyboard.U);

		var html = "<div class='okno' id='HUD'><span id='riadokZdravie'><span id='zdraviePas'></span><span class='txt'><span id='zdravie'>" + this.vlastnosti.zdravie  + "</span> / <span id='plneZdravie'>" + this.vlastnosti.plneZdravie  + "</span></span></span>"+
		"<span id='riadokPeniaze'><img src='assets/obr/minca.png'> <span id='peniaze'>" + this.vlastnosti.peniaze  + "</span></span><br>" + 
		"<span id='riadokSkusenosti'>Skúsenosti: <span id='skusenosti'>" + this.vlastnosti.skusenosti  + "</span></span><br>"+
		"<small>Denník: [Q]</small>" +
		"<br><small>znenie: "+this.znenie+"</small></div>";

		if($('#HUD').length === 0) {
			$(html).prependTo('body');
			var can = $('canvas');
			var pos = can.offset();
			$('#HUD').css('left', pos.left);
			$('#HUD').css('top', pos.top);
		} else {
			this.vypisHUD();
		}
		$('#HUD').show();
		this.vypisHUD();

		//sipy
		this.sipy = sipy;
		this.sipy.enableBody = true;
		this.sipy.physicsBodyType = Phaser.Physics.ARCADE;
		this.sipy.createMultiple(10, 'dataFile', 'sip.png');
		this.sipy.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', this.resetSip);
		this.sipy.callAll('anchor.setTo', 'anchor', 0.5, 1.0);
		this.sipy.setAll('checkWorldBounds', true);
		
		this.sipy.setAll('outOfBoundsKill', true);

		this.otocenie = 1; //-1-vlavo, 1-vpravo
		this.casStrelby = 0;

		this.jeVoVode = false;

		Object.create(Phaser.Sprite.prototype);

		if(Lockr.get('splneneUlohy'))
			this.splneneUlohy = Lockr.get('splneneUlohy');
		
		this.inventar = new Inventar(this.game);
	};

	update() {
		this.jeVoVode = false;

		this.game.physics.arcade.collide(this, this.pohybliveVeci, function(hrac, krabica) {
			if(hrac.body.touching.down)
				hrac.body.blocked.down = true;

			if(krabica.padajuce)
				setTimeout(function(krabica) {krabica.body.moves = true;}, krabica.zdrzanie, krabica);
		}, null, this);
		this.game.physics.arcade.collide(this, this.bloky, null, null, this);
		this.game.physics.arcade.overlap(this, this.popredie, function(hrac, popredie) {
			if(popredie.index === 296 || popredie.index === 297) { //voda
				this.jeVoVode = true;
			}
		}, null, this);
		this.game.physics.arcade.collide(this, this.stromy, null, null, this);
		var koliziaSObchodnikom = this.game.physics.arcade.overlap(this, this.zbieratelnePredmety, this.collect, null, this);
		this.game.physics.arcade.overlap(this, this.nepriatelia, this.collect, null, this);
		this.game.physics.arcade.collide(this.sipy, this.bloky, this.resetSip, null, this);

		this.game.physics.arcade.overlap(this.sipyNepriatelov, this, function(hrac, sip) {
			hrac.vlastnosti.zdravie -= 20;
			this.game.camera.flash(0xff0000);
			hrac.vypisHUD();
			sip.kill();
		}, null, this);

		if(!koliziaSObchodnikom && this.zobrazenaBublina) {
			this.zobrazenaBublina.visible = false; //ked prejde okolo, skryje sa mu pozdrav
		}

		//voda
		if(this.jeVoVode) {
			this.body.gravity.y = 400;
			this.body.velocity.y /= 1.1;
			this.body.velocity.x /= 1.1;
		} else {
			this.body.gravity.y = this.vlastnosti.gravitacia;
		}

		//zatvorenie okna
		if(this.escKey.justDown) {
			this.ui.zabiOkno();
		}

		//reset hry
		if(this.resetKey.justDown) {
			Lockr.rm('vlastnosti');
			Lockr.rm('plnenaUloha');
			Lockr.rm('inventar');
			Lockr.rm('splneneUlohy');
			location.reload(true);
		}
		//hlboke spady
		if(this.hsKey.justDown) {
			this.vlastnosti.uroven = 'jancib';
			this.uloz(this.vlastnosti.uroven, 150, 2200);
			location.reload(true);
		}

		if(this.dennikKey.justDown) {
			var uloha = Lockr.get('plnenaUloha');

			if(typeof this.dennik === 'undefined') {
				this.dennikGroup = this.game.add.group();
				this.dennik = this.game.add.graphics(1, 1);
				this.dennik.lineStyle(4, 0x000000, 1);
				this.dennik.y = 20;
				this.dennik.x = 180;
				this.dennik.beginFill(0x000000);
					this.dennik.fillAlpha = .8;
					this.dennik.drawRect(0, 0, this.game.camera.width - 320, this.game.camera.height - 40);
				this.dennik.endFill();
				this.dennik.fixedToCamera = true;
				this.dennikGroup.add(this.dennik);

				if(uloha) {
					let style = { font: "16px Arial", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: this.game.camera.width/2 };
					let text = this.game.add.text(this.game.camera.width/4, this.game.camera.height/5, uloha[0].popis, style);
					text.fixedToCamera = true;
					this.dennikGroup.add(text);
				}

				let style = { font: "16px Arial", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: this.game.camera.width/2 };
				if(Lockr.get('splneneUlohy')) {
					let textSplneneUlohy = this.game.add.text(this.game.camera.width/4, this.game.camera.height/1.5, 'Splnené úlohy: ' + Lockr.get('splneneUlohy').toString(), style);
					textSplneneUlohy.fixedToCamera = true;
					this.dennikGroup.add(textSplneneUlohy);
				}
			} else {
				this.dennik = undefined;
				this.dennikGroup.callAll('destroy');
				this.dennikGroup.destroy();
			}
		}

		//zber skúseností
		this.game.physics.arcade.overlap(this.nepriatelia, this.sipy, function (coin, sipy) {
			if(coin.zdravie <= 25) {
				this.vlastnosti.skusenosti += coin.skusenosti;
				this.vypisHUD();
			}
		}, null, this);
		
		//ulozenie pozicie
		if(this.ulozKey.justDown) {
			this.ui.mojAlert('Ulozene');
			this.uloz(this.vlastnosti.uroven, this.x, this.y);
		}

		if(this.tildaKey.justDown)
			this.game.state.start('Nastavenia');

		//naklananie sipov podla drahy
		this.sipy.forEachAlive(function(bullet) {
			bullet.rotation = Math.atan2(bullet.body.velocity.y, bullet.body.velocity.x);
		}, this);

		if (this.wasdSipky.left.isDown || this.wasd.left.isDown) {
			this.otocenie = -1;
			
			this.body.acceleration.x = -this.vlastnosti.rychlostPohybu;

			this.animations.play('left');
		} else if (this.wasdSipky.right.isDown || this.wasd.right.isDown) {
			this.otocenie = 1;

			this.body.acceleration.x = this.vlastnosti.rychlostPohybu;

			this.animations.play('right');
		} else if((this.wasdSipky.down.isDown || this.wasd.down.isDown) && this.jeVoVode) {
			if(this.body.velocity.y < this.vlastnosti.rychlostPohybu)
				this.body.velocity.y += this.vlastnosti.zrychlenie;
		} else {
			this.animations.play('stop');
			this.body.acceleration.x = 0;
		}

		if (this.cursors.up.isDown || this.wasd.up.isDown || this.spaceKey.isDown) {
			if(this.body.blocked.down || this.jeVoVode) { //aby neskakal zo vzduchu
				if(this.jeVoVode) {
					if(this.body.velocity.y > -300)
						this.body.velocity.y -= 45;
				} else
					this.body.velocity.y -= this.vlastnosti.vyskaSkoku;
			}
		}

		/*if(this.rctrlKey.justDown) {
			if(Date.now() > this.casStrelby)
				this.strielaj();
		}*/
		if(this.game.input.activePointer.leftButton.isDown) {
			if(Date.now() > this.casStrelby)
				this.strielajMysou();
		}

		//restart the game if reaching the edge
		if((this.y >= this.game.world.height) || this.vlastnosti.zdravie <= 0) {
			this.vlastnosti.zdravie = 0;
			this.vypisHUD();
			this.ui.mojAlert('Zomrel si... :(');
			this.game.paused = true;
			setTimeout(function(game) {game.paused = false}, 1000, this.game);
			this.game.state.start('Game', true, false, this.vlastnosti.uroven, this.vlastnosti.kdeMaZacatx, this.vlastnosti.kdeMaZacaty);
		}
	}

	resetSip(sip) {
		sip.kill();
	};

	strielaj() {
		// Get the first laser that's inactive, by passing 'false' as a parameter
		var sip = this.sipy.getFirstExists(false);
		if (sip) {
			if(this.otocenie === -1) {
				sip.scale.x = -1;
			} else {
				sip.scale.x = 1;
			}
			// If we have a laser, set it to the starting position
			sip.reset(this.x + 20, this.y + 30);
			this.casStrelby = Date.now() + 300;
		}
	};

	strielajMysou() {
		var sip = this.sipy.getFirstExists(false);
		if (sip) {
			sip.scale.x = 1;
			sip.reset(this.x + 20, this.y + 30);
			this.casStrelby = Date.now() + 300;
			sip.rotation = this.game.physics.arcade.angleToPointer(sip);
			sip.body.gravity.y = 500;
			let rs:number = 700;
			if(this.jeVoVode)
				rs /= 1.5;
			this.game.physics.arcade.moveToPointer(sip, rs);
		}
	};

	dalsiaUroven(hrac, dotknuteDvere) {
		this.uloz(dotknuteDvere.uroven, dotknuteDvere.zaciatokX, dotknuteDvere.zaciatokY);
		this.game.state.start('Game', true, false, dotknuteDvere.uroven, dotknuteDvere.obrazokNaPozadi, dotknuteDvere.zaciatokX, dotknuteDvere.zaciatokY);
	};

	pridajSkusenosti(mnozstvo) {
		this.vlastnosti.skusenosti += mnozstvo;
		this.vypisHUD();
	}

	uloz(uroven, x, y) {
		this.vlastnosti.uroven = uroven;
		this.vlastnosti.kdeMaZacatx = x;
		this.vlastnosti.kdeMaZacaty = y;
		Lockr.set('vlastnosti', this.vlastnosti);
		Lockr.set('splneneUlohy', this.splneneUlohy);
	};

	collect(player, collectable) {
		//zoberie predmet, vola ulohy
		ulohy.hrac_zberPredmetov(player, collectable);

		if(collectable.skusenostiZaZber) {
			this.vlastnosti.skusenosti += collectable.skusenostiZaZber;
			this.vypisHUD();
		}

		if(collectable.type === 'minca') {
			collectable.destroy();
			if(collectable.hodnota)
				this.vlastnosti.peniaze += collectable.hodnota;
			else
				this.vlastnosti.peniaze++;
			this.vypisHUD();
		}

		if(collectable.type === 'teleport') {
			this.x = collectable.cielX;
			this.y = collectable.cielY;
			this.body.acceleration.x = 0;
			this.body.acceleration.y = 0;
			this.body.velocity.x = 0;
			this.body.velocity.y = 0;
			this.body.velocity.x = 0;
		}

		if(collectable.type === 'dvere') {
			if(collectable.vstupNaPoziadanie) {
				collectable.children[0].visible = true; //ukaze sa bublina 'ahoj'
				this.zobrazenaBublina = collectable.children[0];
			} else
				this.dalsiaUroven(this, collectable);	
		}
		if(collectable.type === 'dvere' && (this.akcneTlacidlo.isDown || this.rctrlKey.isDown)) {
			this.dalsiaUroven(this, collectable);
		}

		if(collectable.type === 'ovocie') {
			collectable.destroy();
			if(this.vlastnosti.zdravie < this.vlastnosti.plneZdravie)
				this.vlastnosti.zdravie += 20;
			if(this.vlastnosti.zdravie > this.vlastnosti.plneZdravie)
				this.vlastnosti.zdravie = this.vlastnosti.plneZdravie
			this.vypisHUD();
		}
		
		if(
			collectable.type === 'pasca' || 
			collectable.type === 'nepriatel' || 
			collectable.type === 'sliz' || 
			collectable.type === 'kostlivec' || 
			collectable.type === 'netopier' || 
			collectable.type === 'lava'
		) {
			this.vlastnosti.zdravie -= collectable.zranenie;
			this.vypisHUD();
			this.game.camera.flash(0xff0000);
		}

		if(collectable.rozhovor === true) {
			collectable.children[0].visible = true; //ukaze sa bublina 'ahoj'
			this.zobrazenaBublina = collectable.children[0]; //ukaze sa bublina 'ahoj'

			if(collectable.type === 'obchodnik' && (this.akcneTlacidlo.justDown || this.rctrlKey.justDown)) {
				if(this.vlastnosti.peniaze >= 5 && Number(this.vlastnosti.zdravie) < Number(this.vlastnosti.plneZdravie)) {
					this.vlastnosti.peniaze -= 5;
					this.vlastnosti.zdravie = this.vlastnosti.plneZdravie;
					this.vypisHUD();
					this.ui.mojAlert('Si vyliečený')
				} else {
					this.ui.mojAlert('Nemáš dosť peňazí alebo niesi zranený.')
				}
			}

			if(collectable.type === 'lahkaZena' && (this.akcneTlacidlo.justDown || this.rctrlKey.justDown)) {
				if(this.vlastnosti.peniaze >= 2) {
					this.vlastnosti.peniaze -= 2;
					this.vlastnosti.zdravie += 30;
					if(this.vlastnosti.zdravie >= this.vlastnosti.plneZdravie)
						this.vlastnosti.zdravie = this.vlastnosti.plneZdravie;
					this.vypisHUD();
					this.ui.mojAlert('Užil si si v Milicinej izbičke ;). Už sa tešia až ťa tu uvidia opäť!');
				} else {
					this.ui.mojAlert('BEZ PENĚZ DO HOSPODY NELEZ!')
				}
			}

			//zadanie a ukoncenie uloh
			if(typeof collectable.uloha !== 'undefined' && (this.akcneTlacidlo.justDown || this.rctrlKey.justDown)) {
				ulohy.hrac_zadajUlohu(collectable, this);
			}
		}
	};

	pridajSplnenuUlohu(meno) {
		this.splneneUlohy.push(meno);
		this.uloz(this.vlastnosti.uroven, this.x, this.y);
	};

	vypisHUD() {
		$('#HUD #zdraviePas').css('width', (this.vlastnosti.zdravie/this.vlastnosti.plneZdravie)*100 + '%');
		$('#HUD #zdravie').text(this.vlastnosti.zdravie);
		$('#HUD #plneZdravie').text(this.vlastnosti.plneZdravie);
		$('#HUD #peniaze').text(this.vlastnosti.peniaze);
		$('#HUD #skusenosti').text(this.vlastnosti.skusenosti);
	};
};
