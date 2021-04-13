import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'maxString',
})
export class MaxStringPipe implements PipeTransform {
  
  transform(str: string, max: number) {
    return str.slice(0, max);
  }
}
