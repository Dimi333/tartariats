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
		this.inventar.y = game.camera.height-62;

		for(let i=1; i<=this.maxi; i++) {
			this.inventar.drawRect(i*50, 0, 50, 50);
			this.veciVInvetari.push('');
		}

		let sg = this.inventar.width; //sirka grafiky
		this.inventar.x = (game.camera.width/2) - (sg/2+24);
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
				//console.log('predmet',predmet);
				predmet.fixedToCamera = true;
				predmet.body.enable = false;
				predmet.enableBody = false;
				predmet.cameraOffset.setTo((this.game.camera.width/2) - (this.inventar.width/2-36) + ((i-1)*50), this.game.camera.height-52);
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