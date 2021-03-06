import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Paciente } from '../pacientes/paciente.tipo';
import { PacientesService } from '../pacientes/pacientes.service';
import { AuthService } from '../authentication/auth.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { environment } from '../../environments/environment';

import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import * as Rx from 'rxjs';

// Librerias de feathers
import { Feathers } from '../authentication/feathers.service';
@Injectable()
export class PacientesCompartidosService {

  private pacientes: any[];
  public observer: Observer<any[]>;
  pacientes$: Observable<any[]>;

  // Refresh por socket
  private feathersService;
  private pacientesSocketService;

  constructor(
    private pacientesService: PacientesService,
    private feathersAuthenticated: Feathers
  ) {
    // Conectamos con servidor Featherjs
    this.subscribeToServer();

    this.pacientes$ = new Observable((observer) => {
      this.observer = observer;
    });
  }
  public iniciarPacientes(pacientes) {
    this.pacientes = pacientes;
    this.getPacientes();
  }

  public addPaciente(paciente) {

    const existePaciente = this.existePaciente(paciente);

    // Solo agregamos si no existia el paciente
    if (!existePaciente) {
      this.pacientes.push(paciente);
      this.observer.next(this.pacientes);
    }
  }

  public getPacientes() {
    this.observer.next(this.pacientes);
  }

  public updatePaciente(paciente) {

    const encontrado = this.searchPaciente(paciente);

    if (encontrado > -1) {
      this.pacientes[encontrado] = paciente;
      this.observer.next(this.pacientes);
    }

  }

  public deletePaciente(paciente) {

    const encontrado = this.searchPaciente(paciente);
    if (encontrado > -1) {
      this.pacientes.splice(encontrado, 1);
      this.observer.next(this.pacientes);
    }
  }

  public existePaciente(paciente) {

    const indice = this.searchPaciente(paciente);

    if (indice > -1) {
      return true;
    }
    else {
      return false;
    }
  }

  public subscribeToServer() {

    // Estamos usando el Service de Feathers, pues el que tiene la autenticacion del login
    this.feathersService = this.feathersAuthenticated.devolverFeathers();
    // Obtenemos el service que queremos
    this.pacientesSocketService = this.feathersService.service('pacientes');

    // Registramos eventos
    this.pacientesSocketService.on('created', (paciente) => this.onCreated(paciente));
    this.pacientesSocketService.on('updated', (paciente) => this.onUpdated(paciente));
    this.pacientesSocketService.on('removed', (paciente) => this.onRemoved(paciente));
    this.pacientesSocketService.on('patched', (paciente) => this.onPatched(paciente));
  }

  private onCreated(paciente) {
    this.addPaciente(paciente);
  }

  private onUpdated(paciente) {
    this.updatePaciente(paciente);
  }

  private onRemoved(paciente) {
    this.deletePaciente(paciente);
  }

  private onPatched(paciente) {
    if (paciente.eliminado) {
      this.deletePaciente(paciente);
    } else {
      this.updatePaciente(paciente);
    }
  }

  private searchPaciente(paciente) {
    let indice = -1;
    if (paciente && this.pacientes.length > 0) {
      this.pacientes.forEach(function (elem, index) {
        if (elem._id == paciente._id) {
          indice = index;
        }
      });
    }
    return indice;

  }
}
