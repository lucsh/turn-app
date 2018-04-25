import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'porEstado',
  pure: false
})

export class FiltroPorEstado implements PipeTransform {
  transform(items: any[], filter: string): any {

    // filter
    //   .split(',')
    //   .forEach(element => {
    //     console.log(element);
    //   });

    let condicion, estado;

    [condicion, estado] = filter.split(',', 2);

    if (condicion === 'tiene') {
      return items.filter(item => item.estado.indexOf(estado) !== -1);
    } else if (condicion === 'no tiene') {
      return items.filter(item => item.estado.indexOf(estado) === -1);
    }

  }
}
