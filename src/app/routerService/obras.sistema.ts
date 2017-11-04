import { Injectable } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Obra } from '../obras/obra.tipo';
import { ObrasService } from '../obras/obras.service';
import { AuthService } from '../authentication/auth.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';



import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { Subject }           from 'rxjs/Subject';

import * as Rx from 'rxjs';
@Injectable()
export class ObrasCompartidasService {

  private obras: any[];
  public observer: Observer<any[]>;
  obras$: Observable<any[]>;

  constructor(
    private obrasService: ObrasService
  ){

    this.obras$ = new Observable((observer) => {
      this.observer = observer;
    });
  }
  public iniciarObras(obras){
    // console.log('INICIAR PACIENTES COMPARTIDO');
    this.obras = obras;
    // console.log(this.obras);
    this.getObras();
  }

  public addObra(paciente){
    if(paciente){
      this.obras.push(paciente);
      this.observer.next(this.obras);
    }
  }

  public getObras(){
      this.observer.next(this.obras);
  }

  public updateObra(paciente) {
    if(this.obras.length > 0 && paciente){
      let encontrado = -1;
      this.obras.forEach(function(elem,index){
        if(elem._id == paciente._id){
          console.log('Lo encontre!!');
          encontrado = index;
        }
      });
      if(encontrado > -1){
        this.obras[encontrado] = paciente;
      }
      this.observer.next(this.obras);
    }
  }

  public deleteObra(obra){
    if(this.obras.length > 0 && obra){
      let encontrado = -1;
      this.obras.forEach(function(elem,index){
        if(elem._id == obra._id){
          console.log('Lo encontre!!');
          encontrado = index;
        }
      });
      if(encontrado > -1){
        this.obras.splice(encontrado, 1);
      }
      this.observer.next(this.obras);
    }
  }
}
