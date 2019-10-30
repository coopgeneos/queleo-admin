export class Tag {
	value: string;
	weight: number;
	
	constructor() {}

	_init(obj: any) : void {
		if(obj){
			this.value = obj.value ? obj.value : null;
			this.weight = obj.weight ? obj.weight : null;
		}
	}
}