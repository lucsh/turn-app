import { Injectable } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Medico } from '../medico/medico.tipo';

import { MedicosService } from '../medico/medicos.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {VariablesGlobales} from '../variablesGlobales';

import { AuthService } from '../authentication/auth.service';

import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { Subject }           from 'rxjs/Subject';

import * as Rx from 'rxjs';
@Injectable()
export class NodeService {

  private medicos: any[];
  public observer: Observer<any[]>;
  medicos$: Observable<any[]>;

  // public medicos$: Observable<any[]>;
  // public medicos$: Observable<Medico[]>;

  constructor(
    private medicosService: MedicosService
  ){

    this.medicos$ = new Observable((observer) => {
      // console.log('ENTRE ACA');
      this.observer = observer;
    });
    // this.medicosService.getDoctores()
    // .then(medicos => {
    //   // console.log('ENTRE ACA');
    //   this.medicos = <any> medicos;
    //   // this.iniciar();
    // })
    // .catch(err => {console.log(err)})
  }

  public iniciar(medicos){
    // console.log('ME ESTOY ?INICIANDO');
    this.medicos = medicos;
    // this.medicos$ = new Observable((observer) => {
    //   // console.log('ENTRE ACA');
    //   this.observer = observer;
    //   // this.observer.next(this.medicos);
    // });

    this.getMedicos();
    // this.medicos$ = this.medicos.asObservable();

  }

  public getMedicos(){
      this.observer.next(this.medicos);
  }

  public updateMedico(medico) {
    if(this.medicos.length > 0 && medico){
      let encontrado = -1;
      this.medicos.forEach(function(elem,index){
        if(elem._id == medico._id){
          console.log('Lo encontre!!');
          encontrado = index;
        }
      });
      if(encontrado > -1){
        this.medicos[encontrado] = medico;
      }
      this.observer.next(this.medicos);
    }
  }

  // updateMedico(medico){
  //   // this.medicos.
  //
  // }
}
