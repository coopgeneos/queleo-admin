import { Pipe, PipeTransform } from '@angular/core';
const EN_ES = {
  title: "título",
  description: "descripción",
  image: "imagen",
  data: "datos"
};

@Pipe({
  name: 'translate'
})
export class TranslatorPipe implements PipeTransform {

  transform(word: string, dictionary?: string) : string {
    try {
      let dict = eval(dictionary);
      return dict[word];
    } catch(err) {
      return word;
    }
  }

}
