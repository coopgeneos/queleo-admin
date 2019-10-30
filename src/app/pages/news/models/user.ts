import { Favorite } from './favorite';
import { Tag } from './tag';

export class User {
	id: string;
	email: string;
	favorites: Favorite[];
	tags: Tag[];

	constructor() {}

	_init(obj: any) : void {
		if(obj){
			this.id = obj.id ? obj.id : null;
			this.email = obj.email ? obj.email : null;
			this.favorites = obj.favorites ? obj.favorites : null;
			this.tags = obj.tags ? obj.tags : null;
		}
	}
}
