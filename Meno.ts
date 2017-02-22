export class Meno {
	ake:string = 'jaro';
	druhe:string;

	constructor(hodnota:string) {
		this.druhe = hodnota;
	}

	povedz():string {
		return this.ake + ' ' + this.druhe;
	}
}
