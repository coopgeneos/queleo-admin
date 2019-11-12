export class Favorite {
  id: string;
  news: string;
  tags: any;

  constructor() {}

  _init(obj: any) : void {
    if(obj){
      this.id = obj.id ? obj.id : null;
      this.news = obj.news ? obj.news : null;
      this.tags = obj.tags ? obj.tags : null;
    }
  }
}