/// <reference path="../vendor/phaser.d.ts"/>
declare var Lockr: any;
declare var $: any;
import * as ui from './ui.js';

export class Nastavenia extends Phaser.State {
	escapeKey;

	constructor() {
		super();
	}

 	create() {
		$('#HUD').hide();

		if($('#nastavenia').length > 0) {
			$('#nastavenia').remove();
		} 
		if($('#okno').length > 0) {
			$('#okno').remove();
		} 

		this.escapeKey = this.game.input.keyboard.addKey(Phaser.Keyboard.TILDE);

		var html = "<div class='okno' id='nastavenia'>Nastavenia<br>"+
						"<small>Terajsie rozlíšenie: "+Lockr.get('sirka')+'x'+Lockr.get('vyska')+"</small><br>"+
						"<label><input type='checkbox' name='skalovanie' id='skalovanie' ";

		if(Lockr.get('skalovanie') == 1) {
			html += 'checked';
		}

		html += "> skalovanie</label><br>" +
						"Vyber z niektoreho 16:9 rozlisenia:<br>" +
						"<select id='rozlisenie' name='rozlisenie'>" +
						"	<option value='"+Lockr.get('sirka')+"x"+Lockr.get('vyska')+"' selected>* "+Lockr.get('sirka')+" × "+Lockr.get('vyska')+"</option>" +
						"	<option value='768x432'>768 × 432</option>" +
						"	<option value='784x441'>784 × 441</option>" +
						"	<option value='800x450'>800 × 450</option>" +
						"	<option value='832x468'>832 × 468</option>" +
						"	<option value='848x477'>848 × 477</option>" +
						"	<option value='864x486'>864 × 486</option>" +
						"	<option value='880x495'>880 × 495</option>" +
						"	<option value='912x513'>912 × 513</option>" +
						"	<option value='928x522'>928 × 522</option>" +
						"	<option value='944x531'>944 × 531</option>" +
						"	<option value='960x540'>960 × 540</option>" +
						"	<option value='976x549'>976 × 549</option>" +
						"	<option value='992x558'>992 × 558</option>" +
						"	<option value='1008x567'>1008 × 567</option>" +
						"	<option value='1024x576'>1024 × 576</option>" +
						"	<option value='1040x585'>1040 × 585</option>" +
						"	<option value='1056x594'>1056 × 594</option>" +
						"	<option value='1072x603'>1072 × 603</option>" +
						"	<option value='1088x612'>1088 × 612</option>" +
						"	<option value='1104x621'>1104 × 621</option>" +
						"	<option value='1120x630'>1120 × 630</option>" +
						"	<option value='1136x639'>1136 × 639</option>" +
						"	<option value='1152x648'>1152 × 648</option>" +
						"	<option value='1168x657'>1168 × 657</option>" +
						"	<option value='1184x666'>1184 × 666</option>" +
						"	<option value='1200x675'>1200 × 675</option>" +
						"	<option value='1232x693'>1232 × 693</option>" +
						"	<option value='1248x702'>1248 × 702</option>" +
						"	<option value='1264x711'>1264 × 711</option>" +
						"	<option value='1280x720'>1280 × 720</option>" +
						"	<option value='1296x729'>1296 × 729</option>" +
						"	<option value='1312x738'>1312 × 738</option>" +
						"	<option value='1328x747'>1328 × 747</option>" +
						"	<option value='1344x756'>1344 × 756</option>" +
						"	<option value='1360x765'>1360 × 765</option>" +
						"	<option value='1376x774'>1376 × 774</option>" +
						"	<option value='1392x783'>1392 × 783</option>" +
						"	<option value='1424x801'>1424 × 801</option>" +
						"	<option value='1440x810'>1440 × 810</option>" +
						"	<option value='1456x819'>1456 × 819</option>" +
						"	<option value='1472x828'>1472 × 828</option>" +
						"	<option value='1488x837'>1488 × 837</option>" +
						"	<option value='1504x846'>1504 × 846</option>" +
						"	<option value='1520x855'>1520 × 855</option>" +
						"	<option value='1536x864'>1536 × 864</option>" +
						"	<option value='1552x873'>1552 × 873</option>" +
						"	<option value='1568x882'>1568 × 882</option>" +
						"	<option value='1584x891'>1584 × 891</option>" +
						"	<option value='1600x900'>1600 × 900</option>" +
						"	<option value='1616x909'>1616 × 909</option>" +
						"	<option value='1632x919'>1632 × 919</option>" +
						"</select><br>" +
						"<br>" +
						"<button id='ulozNastavenia'>Ulozit a restartovat</button>" +
					"</div>";

		$(html).appendTo('#telo');

		$('#telo').on('click', '#ulozNastavenia', function(e) {
			var roz = $('#rozlisenie').val();
			var ska = $('#skalovanie').is(':checked');
			
			var polohaX = roz.indexOf('x');
			var sirka = roz.substring(0, polohaX);
			var vyska = roz.substring(polohaX+1);

			ui.actionOnClick(sirka, vyska, ska);
		});

		var can = $('canvas');
		var pos = can.offset();
		$('#nastavenia').css('left', pos.left);
		$('#nastavenia').css('top', pos.top);	
	}

	update() {
		/*if(this.escapeKey.justDown)
			fmmo.game.state.start('Game');*/
 	}
}