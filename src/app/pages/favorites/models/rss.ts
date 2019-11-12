export class RSS {
  category: string;
  source: string;
  url: string;

  constructor() {}

  _init(obj: any) {
    if(obj) {
      if(obj['url']) this.url = obj.url;
      if(obj['source']) this.source = obj.source;
      if(obj['category']) this.category = obj.category;
    }
  }
}