declare var Lockr: any;
declare var $: any;

export class UI {
	mojAlert(obsah) {
		if($('#okno').length === 0) {
			var html = "<div class='okno' id='okno'>" + obsah  + "<br><br><button onclick='$(this).parent().remove();'>Zatvor [esc]</button></div>";

			$(html).appendTo('#telo');
			var can = $('canvas');
			var pos = can.offset();
			$('#okno').css('left', pos.left);
			$('#okno').css('top', pos.top);
			$('#okno').width($('canvas').width());
		}
	}

	//aby vedel zrusit okno aj z programu
	zabiOkno() {
		$('#okno').remove();
	}

	//aby vedel potvrdit nastavenia v nastaveniach
	actionOnClick(sirka, vyska, skalovanie, paralax) {
		if(skalovanie === true)
			Lockr.set('skalovanie', 1);
		else
			Lockr.set('skalovanie', 0);

		if(paralax === true)
			Lockr.set('paralax', 1);
		else
			Lockr.set('paralax', 0);

		Lockr.set('sirka', sirka);
		Lockr.set('vyska', vyska);

		location.reload(true);
	}
}