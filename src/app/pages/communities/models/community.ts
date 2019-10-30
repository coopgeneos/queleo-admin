import { RSS } from '../../news/models/rss';

export class Community {
  id: string;
  owner: string;
  name: string;
  description: string;
  image: string;
  rss: RSS[];
  members: string[];
  sources: string[];

  constructor() {}

  _init(obj: any) {
    try{
      if(obj){
        this.id = obj.id ? obj.id : null;
        this.owner = obj.owner ? obj.owner : null;
        this.name = obj.name ? obj.name : null;
        this.description = obj.description ? obj.description : null;
        this.image = obj.image ? obj.image : null;
        this.rss = obj.rss ? obj.rss : null;
        this.members = obj.members ? obj.members : null;
        this.sources = obj.sources ? obj.sources : null;
      }
    } catch(err) {
      throw err;
    }
  }
}