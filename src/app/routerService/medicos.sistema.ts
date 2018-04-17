import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Medico } from '../medico/medico.tipo';

import { MedicosService } from '../medico/medicos.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


import { AuthService } from '../authentication/auth.service';

import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

import * as Rx from 'rxjs';
@Injectable()
export class MedicosCompartidosService {

  private medicos: any[];
  public observer: Observer<any[]>;
  medicos$: Observable<any[]>;

  constructor(
    private medicosService: MedicosService
  ) {

    this.medicos$ = new Observable((observer) => {
      this.observer = observer;
    });

    this.findMedicos();
  }

  private findMedicos() {
    // TODO: actualmente se esta usando el http service. Posteriormente posiblemente se haga con sockets como obras.sistema.ts
    this.medicosService.getDoctores()
      .then(docs => {
        console.log('Voy a enviar los medicos');
        this.medicos = docs;
        if (this.observer) {
          this.observer.next(this.medicos);
        }

      })
      .catch(err => console.error(err))
  }

  public set(medicos) {
    this.medicos = medicos;
    this.observer.next(this.medicos);
  }


  public addMedico(medico) {
    if (medico) {
      this.medicos.push(medico);
      this.observer.next(this.medicos);
    }
  }

  public getMedicos() {
    if(this.medicos !== undefined){
      this.observer.next(this.medicos);
    }
  }

  public updateMedico(medico) {
    if (this.medicos.length > 0 && medico) {
      let encontrado = -1;
      this.medicos.forEach(function (elem, index) {
        if (elem._id == medico._id) {
          encontrado = index;
        }
      });
      if (encontrado > -1) {
        this.medicos[encontrado] = medico;
      }
      this.observer.next(this.medicos);
    }
  }

  public actualizarSemana(medicoCambiado) {


    let i = -1;
    this.medicos.forEach(function (med, index) {
      if (med._id.toString() == medicoCambiado._id) {
        i = index;
      }
    });
    if (i > -1) {
      this.medicos[i].semanaEsquema = medicoCambiado.semanaEsquema;
    }

    this.observer.next(this.medicos);

  }

  public deleteMedico(medico) {
    if (this.medicos.length > 0 && medico) {
      let encontrado = -1;
      this.medicos.forEach(function (elem, index) {
        if (elem._id == medico._id) {
          encontrado = index;
        }
      });
      if (encontrado > -1) {
        this.medicos.splice(encontrado, 1);
      }
      this.observer.next(this.medicos);
    }
  }

  // updateMedico(medico){
  //   // this.medicos.
  //
  // }
}
