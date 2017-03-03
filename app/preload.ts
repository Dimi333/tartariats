/// <reference path="../vendor/phaser.d.ts"/>
declare var Lockr: any;

export class Preload extends Phaser.State {
	logo:Phaser.Sprite;

	constructor() {
		super();
	}

	preload() {
		this.logo = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'nacitavanie');
		this.logo.width = this.camera.width;
		this.logo.height = this.camera.height;
		this.logo.anchor.setTo(0.5);
		
		this.load.atlasJSONHash('dataFile', 'assets/obr/dataFile.png', 'assets/obr/dataFile.json');
		this.load.tilemap('plesa', 					'assets/urovne/plesa.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('zakazanyLes', 			'assets/urovne/zakazanyLes.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('hrobka', 				'assets/urovne/hrobka.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('ohyzdiePlane', 			'assets/urovne/ohyzdiePlane.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('vychor', 				'assets/urovne/vychor.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('drevenik', 				'assets/urovne/drevenik.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('milicinaIzbicka', 		'assets/urovne/milicinaIzbicka.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('drevenikStajne', 		'assets/urovne/drevenikStajne.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('drevenikAlchymista', 	'assets/urovne/drevenikAlchymista.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('drevenikObchod', 		'assets/urovne/drevenikObchod.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('nadstromovaUroven', 		'assets/urovne/nadstromovaUroven.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('mosty', 					'assets/urovne/mosty.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('podMostom', 				'assets/urovne/podMostom.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('les', 					'assets/urovne/les.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('predmestie', 			'assets/urovne/predmestie.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('strok', 					'assets/urovne/strok.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('rudohorie', 				'assets/urovne/rudohorie.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('staraBana', 				'assets/urovne/staraBana.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('zahrady', 				'assets/urovne/zahrady.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('hustoles', 				'assets/urovne/hustoles.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('domObchodnikaVStroku', 	'assets/urovne/domObchodnikaVStroku.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('domCarodejnikaVStroku', 	'assets/urovne/domCarodejnikaVStroku.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('jancib', 				'assets/urovne/jancib.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('povala', 				'assets/urovne/povala.json', null, Phaser.Tilemap.TILED_JSON);
		
		this.load.image('dlazdice', 				'assets/obr/dlazdice.png');

		/*this.load.image('temnoles', 'assets/temnoles.jpg');
		this.load.image('obrazokNaPozadi1', 'assets/pozadie.jpg');
		this.load.image('obrazokNaPozadi2', 'assets/pozadie2.jpg');
		this.load.image('obrazokNaPozadi2b', 'assets/pozadie2b.jpg');
		this.load.image('obrazokNaPozadi3', 'assets/pozadie3.jpg');
		this.load.image('obrazokNaPozadi1-3', 'assets/pozadie1-3.jpg');
		this.load.image('obrazokNaPozadi4', 'assets/pozadie4.jpg');*/
		//this.load.image('neviditelny', 'assets/obrneviditelny.png'); // musi ostat, kvoli niektorym objektom bez spritov

	}

	create() {
		var vlastnosti = Lockr.get('vlastnosti');

		if(vlastnosti) {
			var uroven:string = vlastnosti.uroven || 'drevenik';
			var uroven_obrazokNaPozadi:string = vlastnosti.obrazokNaPozadi || 'obrazokNaPozadi2b';
			var zaciatok_urovne = vlastnosti.kdeMaZacat || 'vlavo';
			var zaciatok_urovnex:number = 1147;
			var zaciatok_urovney:number = 842;
		} else {
			var uroven:string = 'drevenik';
			var uroven_obrazokNaPozadi:string = 'obrazokNaPozadi2b';
			var zaciatok_urovne:any = 'vlavo';
			var zaciatok_urovnex:number = 1147;
			var zaciatok_urovney:number = 842;
		}

		this.camera.fade(0x000000);
		this.camera.onFadeComplete.add(function() {
			this.state.start('Game', true, false, uroven, uroven_obrazokNaPozadi, zaciatok_urovnex, zaciatok_urovney);
		}, this);
	}
}