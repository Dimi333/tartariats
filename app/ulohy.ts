/// <reference path="../vendor/phaser.d.ts"/>
declare var Lockr: any;
declare var $: any;
import {UI} from './ui';
import {Nepriatel} from './nepriatel';
import {Predmet} from './predmet';
var ui:UI = new UI();



export function hrac_zadajUlohu(sKymSaRozprava, hrac) {
	let uloha = Lockr.get('plnenaUloha');

	for(let u of hrac.splneneUlohy) {
		if(u === sKymSaRozprava.uloha) {
			ui.mojAlert('Už pre teba nemá žiadnu ďalšiu úlohu.');
			return;
		}
	};

	if(!uloha) {
		if(sKymSaRozprava.uloha === 'Hostimil') hrac_uvod(hrac)
		if(sKymSaRozprava.uloha === 'stratenyDiamant') hrac_stratenyDiamant(hrac);
		if(sKymSaRozprava.uloha === 'priseraVBani') hrac_priseraVBani(hrac);
		if(sKymSaRozprava.uloha === 'netopiereVDome') hrac_netopiereVDome(hrac);
		if(sKymSaRozprava.uloha === 'stratenyNapoj') hrac_stratenyNapoj(hrac);
	} else {
		if(sKymSaRozprava.uloha === 'Hostimil') hrac_uvod(hrac)
		else if(sKymSaRozprava.uloha === 'stratenyDiamant' && uloha[0].nazov === 'stratenyDiamant') hrac_stratenyDiamant(hrac);
		else if(sKymSaRozprava.uloha === 'priseraVBani' && uloha[0].nazov === 'priseraVBani') hrac_priseraVBani(hrac);
		else if(sKymSaRozprava.uloha === 'netopiereVDome' && uloha[0].nazov === 'netopiereVDome') hrac_netopiereVDome(hrac);
		else if(sKymSaRozprava.uloha === 'stratenyNapoj' && uloha[0].nazov === 'stratenyNapoj') hrac_stratenyNapoj(hrac);
		else 
			ui.mojAlert('Naraz môžeš plniť iba jednu úlohu');
	}
}
export function hrac_zberPredmetov(hrac, predmet) {
	var uloha = Lockr.get('plnenaUloha');
	if(uloha) {
		if(uloha[0].nazov === 'stratenyDiamant') collect_stratenyDiamant(hrac, predmet);
		if(uloha[0].nazov === 'stratenyNapoj') collect_stratenyNapoj(hrac, predmet);
	}
}
export function game_pripravVeciPreUlohu(game) {
	var uloha = Lockr.get('plnenaUloha');
	if(uloha) {
		if(uloha[0].nazov === 'stratenyDiamant') game_stratenyDiamant(uloha, game);
		if(uloha[0].nazov === 'priseraVBani') game_priseraVBani(uloha, game);
		if(uloha[0].nazov === 'netopiereVDome') game_netopiereVDome(uloha, game);
		if(uloha[0].nazov === 'stratenyNapoj') game_stratenyNapoj(uloha, game);
	}
}
export function nepriatel_zabitaBytost(slime) {
	var uloha = Lockr.get('plnenaUloha');
    if(uloha) {
		if(uloha[0].nazov === 'priseraVBani') nepriatel_priseraVBani(uloha, slime);
		if(uloha[0].nazov === 'netopiereVDome') nepriatel_netopiereVDome(uloha, slime);
	}
}




//////////////////////////////////////////////////////////////////////////////////// Úvod

function hrac_uvod(hrac) {
	ui.mojAlert('Vitaj dobrodruh! Klávesami E alebo CTRL vyvolávaš akcie. Kliknutým ľavej myši strielaš a hýbeš sa klávesami A a D alebo smerovými šípkami. Skáčeš W alebo MEDZERNÍKOM. Niektoré postavy ti môžu dať pri rozhovore úlohu. Zoznam úloh nájdeš, keď stlačíš Q.');
}

//////////////////////////////////////////////////////////////////////////////////// Stratený nápoj

function hrac_stratenyNapoj(hrac) {
	var uloha = Lockr.get('plnenaUloha');
	if(!uloha) {
		let popis = 'Ľudmila: Niesla som čarovný nápoj pre alchymistu, ale po ceste sem mi vypadol. Niekde v Plesách, to je hneď naľavo za mestom. Nemám odvahu vojsť do tých jaskýň. Prosím pomôžeš mi? Vďaka.'
		ui.mojAlert(popis);
		Lockr.set('plnenaUloha', [{nazov: 'stratenyNapoj', cielovaMapa: 'plesa', maNapoj: false, popis: popis}]);
	} else {
		if(uloha[0].maNapoj) {
			ui.mojAlert('Vďaka za nápoj. Tu máš 10 zlatých');
			hrac.vlastnosti.peniaze += 10;
			hrac.vlastnosti.skusenosti += 500;
			hrac.inventar.vezmiZInventara('ruzovaFlasa');
			hrac.vypisHUD();
			Lockr.rm('plnenaUloha');
			hrac.pridajSplnenuUlohu('stratenyNapoj');
		} else {
			ui.mojAlert('Nájdi stratený nápoj v Plesách pre Ľudmilu.');
		}
	}
}
function collect_stratenyNapoj(hrac, predmet) {
	if(predmet.vlastnosti) {
		if(predmet.vlastnosti.predmetPreUlohu === 'stratenyNapoj') {
			hrac.inventar.pridajDoInventara(predmet);
			let popis = 'Výborne, teraz nápoj vezmi Ľudmile do mesta.';
			ui.mojAlert(popis);
			let uloha = Lockr.get('plnenaUloha');
			Lockr.set('plnenaUloha', [{nazov: uloha[0].nazov, cielovaMapa: uloha[0].cielovaMapa, maNapoj: true, popis: popis}]);
		}
	}
}
function game_stratenyNapoj(uloha, game) {
	if(uloha[0].cielovaMapa === game.uroven && uloha[0].maNapoj === false) {
		var pr = new Predmet('ruzovaFlasa', game.game, 1101, 528, game.player, game.vrstvaBloky, game.vrstvaStromy, game.coins, game.sipy, {type: 'napoj', predmetPreUlohu: 'stratenyNapoj'});
		pr.name = 'ruzovaFlasa';
		game.coins.add(pr);
	}
}

//////////////////////////////////////////////////////////////////////////////////// Stratený diamant

function hrac_stratenyDiamant(hrac) {
	var uloha = Lockr.get('plnenaUloha');
	if(!uloha) {
		let popis = 'Moryn: Ach, dobrý hrdina, stala sa mi nepríjemná vec. Bol som v Hustolese a po ceste domov som tak trochu stratil jednu dôležitú vec. Nachádza sa na východ od mesta hlboko v lese pri takom veľkom strome. Ak by si išiel niekedy okolo a zbadal tam veľký diamant, tak mi ho prosím prines, bohato sa ti odmením!';
		ui.mojAlert(popis);

		Lockr.set('plnenaUloha', [{nazov: 'stratenyDiamant', cielovaMapa: 'hustoles', maDiamant: false, popis: popis}]);
	} else {
		if(uloha[0].maDiamant) {
			ui.mojAlert('Vďaka za diamant. Tu máš 100 zlatých');
			hrac.vlastnosti.peniaze += 100;
			hrac.vlastnosti.skusenosti += 500;
			hrac.vypisHUD();
			hrac.inventar.vezmiZInventara('diamant');
			Lockr.rm('plnenaUloha');
			hrac.pridajSplnenuUlohu('stratenyDiamant');
		} else {
			ui.mojAlert('Nájdi diamant v Hustolese pre Moryna.');
		}
	}
}
function collect_stratenyDiamant(hrac, predmet) {
	if(predmet.vlastnosti) {
		if(predmet.vlastnosti.predmetPreUlohu === 'stratenyDiamant') {
			//predmet.destroy();
			hrac.inventar.pridajDoInventara(predmet);
			let uloha = Lockr.get('plnenaUloha');
			let popis = 'Výborne, teraz diamant vezmi čarodejníkovy do mesta.';
			ui.mojAlert(popis);
			Lockr.set('plnenaUloha', [{nazov: uloha[0].nazov, cielovaMapa: uloha[0].cielovaMapa, maDiamant: true, popis: popis}]);
		}
	}
}
function game_stratenyDiamant(uloha, game) {
	if(uloha[0].cielovaMapa === game.uroven && uloha[0].maDiamant === false) {
		var pr = new Predmet('diamant', game.game, 500, 500, game.player, game.vrstvaBloky, game.vrstvaStromy, game.coins, game.sipy, {type: 'diamant', predmetPreUlohu: 'stratenyDiamant'});
		pr.name = 'diamant';
		game.coins.add(pr);
	}
}

/////////////////////////////////////////////////////////////////////////////////// Príšera v bani

function hrac_priseraVBani(hrac) {
	var uloha = Lockr.get('plnenaUloha');
	if(!uloha) {
		let popis = 'Alkazar: Hlboko v starej bani žije hrozný netvor. Má niečo, čo má pre mňa obrovskú hodnotu. Ak ho pre mňa zabiješ, odmením sa ti!';
		ui.mojAlert(popis);

		Lockr.set('plnenaUloha', [{nazov: 'priseraVBani', cielovaMapa: 'staraBana', zabilHo: false, popis: popis}]);
	} else {
		if(uloha[0].zabilHo) {
			ui.mojAlert('Vykonal si hrdinský čin! Tu máš 150 zlatých');
			hrac.vlastnosti.peniaze += 150;
			hrac.vlastnosti.skusenosti += 1500;
			hrac.vypisHUD();
			Lockr.rm('plnenaUloha');
			hrac.pridajSplnenuUlohu('priseraVBani');
		} else {
			ui.mojAlert('Choď do starej bane a zabi netvora, čo tam žije.');
		}
	}
}
function game_priseraVBani(uloha, game) {
	if(uloha[0].cielovaMapa === game.uroven && uloha[0].zabilHo === false) {
		//nepriatel
		var vlastnostiBossa = {
			sprite: "slimeBoss",
			type: "sliz",
			zdravie: 550,
			zranenie: 5,
			cielUlohy: 'priseraVBani',
			skusenosti: 500,
			striela: true,
			naboj: 'guano'
		};
		var sliz = new Nepriatel(game.game, game.player, vlastnostiBossa, game.vrstvaBloky, game.coins, game.vrstvaStromy, game.sipy, game.sipyNepriatelov, 2463, 660);
		game.nepriatelia.add(sliz);
	}
}
function nepriatel_priseraVBani(uloha, nepriatel) {
	if(uloha && nepriatel.cielUlohy === 'priseraVBani') {
		let popis = 'Zabil si obludu. Vráť sa do Stroku a povedz o tom Alkazarovy.';
		let uloha = Lockr.get('plnenaUloha');
		Lockr.set('plnenaUloha', [{nazov: uloha[0].nazov, cielovaMapa: uloha[0].cielovaMapa, zabilHo: true, popis:popis}]);
		ui.mojAlert(popis);
	}
}

/////////////////////////////////////////////////////////////////////////////////// Netopiere v dome

function hrac_netopiereVDome(hrac) {
	var uloha = Lockr.get('plnenaUloha');
	if(!uloha) {
		let popis = 'Dubák: Strašná vec sa mi stala. Mám v dome netopiere. Ak ich pre mňa vyzabíjaš, odmením sa ti. Bývam hore na terase. Len mi prosím neponič kvetiny, ďakujem.';
		ui.mojAlert(popis);

		Lockr.set('plnenaUloha', [{nazov: 'netopiereVDome', cielovaMapa: 'domCarodejnikaVStroku', kolkoZabilNetopierov: 0, zabil10Netopierov: false, popis: popis}]);
	} else {
		if(uloha[0].zabil10Netopierov) {
			ui.mojAlert('Vďaka ti mocný hrdina, dúfam, že to moje kvietky prežili!');
			hrac.vlastnosti.peniaze += 50;
			hrac.vlastnosti.skusenosti += 500;
			hrac.vypisHUD();
			Lockr.rm('plnenaUloha');
			hrac.pridajSplnenuUlohu('netopiereVDome');
		} else {
			ui.mojAlert('V dome na kopci mám hromadu netopierov. Zbav ma ich prosím, a dávaj pozor na moje kvietky!');
		}
	}
}
function game_netopiereVDome(uloha, game) {
	if(uloha[0].cielovaMapa === game.uroven && uloha[0].zabil10Netopierov === false) {
		for(let i=0; i<10; i++) {
			var vlastnosti = {
				sprite: "netopier",
				type: "netopier",
				zdravie: 50,
				zranenie: 1,
				cielUlohy: 'netopiereVDome',
				skusenosti: 20
			};
			var neto = new Nepriatel(game.game, game.player, vlastnosti, game.vrstvaBloky, game.coins, game.vrstvaStromy, game.sipy, game.sipyNepriatelov, 150, 150*i+50);
			game.nepriatelia.add(neto);
		}
	}
}
function nepriatel_netopiereVDome(uloha, nepriatel) {
	if(uloha[0] && nepriatel.cielUlohy === 'netopiereVDome') {
		var netopiere = Number(uloha[0].kolkoZabilNetopierov);
		netopiere++;

		if(netopiere >= 10) {
			let popis = 'Vyčistil si Dubákov dom. Choď mu o tom povedať.';
			Lockr.set('plnenaUloha', [{nazov: 'netopiereVDome', cielovaMapa: 'domCarodejnikaVStroku', kolkoZabilNetopierov: 10, zabil10Netopierov: true, popis: popis}]);
			ui.mojAlert(popis);
		} else {
			Lockr.set('plnenaUloha', [{nazov: 'netopiereVDome', cielovaMapa: 'domCarodejnikaVStroku', kolkoZabilNetopierov: netopiere, zabil10Netopierov: false}]);
		}
	}
}