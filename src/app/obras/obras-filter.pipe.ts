import * as _ from 'lodash';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'dataFilter2'
})
export class DataFilterPipe2 implements PipeTransform {

    transform(array: any[], query: string): any {
        if (query) {
            return _.filter(array, row => {
              let filas = false;
              if (row.nombre.toLowerCase().indexOf(query.toLowerCase()) > -1){
                filas = true;
              }
              else{
                if (row.iniciales.toLowerCase().indexOf(query.toLowerCase()) > -1){
                  filas = true;
                }
              }
              return filas;
            });
        }
        return array;
    }
}
