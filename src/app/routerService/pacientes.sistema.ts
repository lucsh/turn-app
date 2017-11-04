import { Injectable } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Paciente } from '../pacientes/paciente.tipo';
import { PacientesService } from '../pacientes/pacientes.service';
import { AuthService } from '../authentication/auth.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';



import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { Subject }           from 'rxjs/Subject';

import * as Rx from 'rxjs';
@Injectable()
export class PacientesCompartidosService {

  private pacientes: any[];
  public observer: Observer<any[]>;
  pacientes$: Observable<any[]>;

  constructor(
    private pacientesService: PacientesService
  ){

    this.pacientes$ = new Observable((observer) => {
      this.observer = observer;
    });
  }
  public iniciarPacientes(pacientes){
    // console.log('INICIAR PACIENTES COMPARTIDO');
    this.pacientes = pacientes;
    // console.log(this.pacientes);
    this.getPacientes();
  }

  public addPaciente(paciente){
    if(paciente){
      this.pacientes.push(paciente);
      this.observer.next(this.pacientes);
    }
  }

  public getPacientes(){
      this.observer.next(this.pacientes);
  }

  public updatePaciente(paciente) {
    if(this.pacientes.length > 0 && paciente){
      let encontrado = -1;
      this.pacientes.forEach(function(elem,index){
        if(elem._id == paciente._id){
          console.log('Lo encontre!!');
          encontrado = index;
        }
      });
      if(encontrado > -1){
        this.pacientes[encontrado] = paciente;
      }
      this.observer.next(this.pacientes);
    }
  }

  public deletePaciente(paciente){
    if(this.pacientes.length > 0 && paciente){
      let encontrado = -1;
      this.pacientes.forEach(function(elem,index){
        if(elem._id == paciente._id){
          encontrado = index;
        }
      });
      if(encontrado > -1){
        this.pacientes.splice(encontrado, 1);
      }
      this.observer.next(this.pacientes);
    }
  }

  public existePaciente(paciente){

    let indice = this.buscarPaciente(paciente);

    if(indice > -1){
      return true;
    }
    else{
      return false;
    }
  }

  private buscarPaciente(paciente){
    let indice = -1;
    this.pacientes.forEach(function(elem,index){
      if(elem._id == paciente._id){
        indice = index;
      }
    });

    return indice;

  }
}
