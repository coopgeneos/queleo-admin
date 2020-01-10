import { RSS } from '../../news/models/rss';

export class Profile {
  id: string;
  name: string;
  categories: string[];
  rss: RSS[];
  sources: string[];
  default: boolean;

  constructor() {}

  _init(obj: any) {
    if(obj) {
      if(obj['id']) this.id = obj.id;
      if(obj['name']) this.name = obj.name;
      if(obj['rss']) this.rss = obj.rss;
      if(obj['sources']) this.sources = obj.sources;
      if(obj['categories']) this.categories = obj.categories;
      if(obj['default']) this.default = obj.default; else this.default = false;
    }
  }
}