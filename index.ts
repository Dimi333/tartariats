/// <reference path="./vendor/phaser.d.ts"/>
declare var Lockr: any;

import {Tartaria} from './app/tartaria';

window.onload = () => {
	if(!Lockr.get('sirka') && !Lockr.get('vyska') && !Lockr.get('skalovanie')) {
		Lockr.set('sirka', 768);
		Lockr.set('vyska', 432);
		Lockr.set('skalovanie', 0);
		Lockr.set('paralax', 1);
	}

    var game = new Tartaria();
};