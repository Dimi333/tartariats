/// <reference path="../vendor/phaser.d.ts"/>
declare var Lockr: any;
import { Predmet } from './predmet';

export class Inventar {
	game;
	inventar; //drziak pre grafiku
	maxi:number = 5; //pocet poloziek
	veciVInvetari:Array<string> = []; //pole veci, aby sa vedelo <sprite>
	inventarGroup; //skupina pre sprite grafiky

	constructor(
		game
	) {
		this.game = game;

		this.inventarGroup = game.add.group();
		this.inventar = game.add.graphics(10, 10);
		this.inventar.lineStyle(4, 0xffffff, 1);
		this.inventar.y = 20;

		this.inventar.beginFill(0x000000);
		this.inventar.fillAlpha = .5;
		for(let i=1; i<=this.maxi; i++) {
			this.inventar.drawRect(i*50, 0, 50, 50);
			this.veciVInvetari.push('');
		}
		this.inventar.endFill();
		
		this.inventar.x = game.camera.width - this.inventar.width-60;
		this.inventar.fixedToCamera = true;
		this.naplnInventar(game);
	}

	naplnInventar(game) {
		let i = Lockr.get('inventar');
		if(i) {
			for(let e of i) {
				if(e) {
					let pr = new Predmet(e, game, 0, 0, null, null, null, null, null, null);
					pr.name = e;
					this.pridajDoInventara(pr);
				}
			};
		}
	}

	pridajDoInventara(predmet) {
		//prejdi od zaciatku inventar a kde je prazdne pole pridaj sprite
		for(let i=1; i<=this.maxi; i++) {
			if(i == this.maxi && this.veciVInvetari[this.maxi-1] !== '') {
				break; //plny inventar
			}
			if(this.veciVInvetari[i-1] === '') {
				this.inventarGroup.add(predmet);
				this.veciVInvetari[i-1] = predmet.name;
				predmet.fixedToCamera = true;
				predmet.body.enable = false;
				predmet.enableBody = false;

				predmet.cameraOffset.setTo(this.game.camera.width - this.inventar.width + ((i-1)*50), 30);
				Lockr.set('inventar', this.veciVInvetari);
				break;
			}
		}
	}

	vezmiZInventara(sprite:string) {
		//prejdi od zaciatku inventar a kde je predmet a vezmi ho
		for(let i=1; i<=this.maxi; i++) {
			if(this.veciVInvetari[i-1] === sprite) {
				this.veciVInvetari[i-1] = '';

				for(let vec of this.inventarGroup.children) {
					if(vec.name === sprite) {
						vec.destroy();
					}
				};

				Lockr.set('inventar', this.veciVInvetari);
				break;
			}
		}
	}
}