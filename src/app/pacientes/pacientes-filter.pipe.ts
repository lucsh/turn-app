import * as _ from 'lodash';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'dataFilter'
})
export class DataFilterPipe implements PipeTransform {

    transform(array: any[], query: string): any {
        if (query) {
            return _.filter(array, row => {
              let filas = false;
              if (row.nombre.toLowerCase().indexOf(query.toLowerCase()) > -1){
                filas = true;
              }
              else{
                if (row.apellido.toLowerCase().indexOf(query.toLowerCase()) > -1){
                  filas = true;
                }
                else{
                  if (row.email.toLowerCase().indexOf(query.toLowerCase()) > -1){
                    filas = true;
                  }
                  else{
                    if (row.numeroPaciente.toLowerCase().indexOf(query.toLowerCase()) > -1){
                      filas = true;
                    }
                  }
                }
              }
              return filas;



            });
        }
        return array;
    }
}
