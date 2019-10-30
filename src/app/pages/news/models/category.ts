export class Category {
  id: string;
  name: string;

  constructor() {}

  _init(obj: any) {
    try {
      this.id = obj.key ? obj.key : null;
      this.name = obj.payload ? obj.payload.val() : null;
    } catch(err) {
      throw err;
    }
  }
}