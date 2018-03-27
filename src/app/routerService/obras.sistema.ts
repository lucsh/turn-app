import { Injectable } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { Obra } from '../shared/models/obra.tipo';
import { ObrasService } from 'app/shared/services/obras.service';
import { AuthService } from '../authentication/auth.service';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { environment } from '../../environments/environment';

import { Observer } from 'rxjs/Observer';
import { Subscription, AnonymousSubscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import * as Rx from 'rxjs';

// Librerias de feathers
import { Feathers } from '../authentication/feathers.service';

@Injectable()
export class ObrasCompartidasService {

  private obras: any[];
  private particular: any;
  public observer: Observer<any[]>;
  obras$: Observable<any[]>;

  // Refresh por socket
  private feathersService;
  private obrasSocketService;

  // Refresh manual por tiempo
  // private timerSubscription: AnonymousSubscription;

  constructor(
    private obrasService: ObrasService,
    private feathersAuthenticated: Feathers
  ){
    // Si quisieramos hacerel refresh manual: this.refreshData();

    // Socket way
    this.subscribeToServer();

    this.obras$ = new Observable((observer) => {
      this.observer = observer;
    });

    this.findObras(); // Buscamos por primera vez las obras
  }

  public findObras(){
    this.obrasSocketService.find()
    .then(obras => {

      const obrasSinParticular = this.removerObraParticularVista(obras);
      this.obras = obrasSinParticular;

      if (this.observer){
        this.observer.next(this.obras);
      }
    });
  }

  public createObra(iniciales, obra){
    return new Promise((resolve, reject) => {
      this.obrasSocketService.create({iniciales: iniciales, nombre: obra})
      .then(nuevaObra => resolve(nuevaObra))
      .catch(err => {console.error('Error al crear la obra', err); reject(err); });
    });
  }

  public iniciarObras(obras){
    this.obras = this.removerObraParticularVista(obras);
    this.getObras();
  }

  public addObra(obra){
    const encontrado = this.searchObra(obra);

    // Solo agregamos si no existia
    if (encontrado < 0){
      this.obras.push(obra);
      this.observer.next(this.obras);
    }
  }

  public getObras(){
      this.observer.next(this.obras);
  }

  public updateObra(obra) {
    const encontrado = this.searchObra(obra);

    if (encontrado > -1){
      this.obras[encontrado] = obra;
      this.observer.next(this.obras);
    }
  }

  public deleteObra(obra){
    const encontrado = this.searchObra(obra);

    if (encontrado > -1){
      this.obras.splice(encontrado, 1);
      this.observer.next(this.obras);
    }
  }

  private searchObra(obraBuscada){

    let encontrado = -1;

    if (this.obras.length > 0 && obraBuscada){
      this.obras.forEach(function(elem, index){
        if (elem._id == obraBuscada._id){
          encontrado = index;
        }
      });
    }
    return encontrado;
  }

  /*
    Quitamos la obra 'Particular' de la lista de obras elegibles por los administrativos / medicos.
  */

  private removerObraParticularVista(obras){

    let obrasSinParticular = [];
    let indexParticular = -1;

    obras.forEach(function(elem, index){
      if (elem.nombre == 'Particular'){
        indexParticular = index;
      }
    });

    obrasSinParticular = obras;

    // Removemos la obra 'Particular'
    if (indexParticular > -1) {
      this.particular =  Object.assign({}, obrasSinParticular[indexParticular]); // guardamos el particular
      obrasSinParticular.splice(indexParticular, 1);
    }

    return obrasSinParticular;

  }

  public getParticular() {
    if (this.particular) {
      return this.particular;
    } else {
      // TODO: Buscar en la base de datos la obra 'Particular'
      return null;
    }
  }

/*
  Refresh por Sockets
*/
public subscribeToServer(){

  //Estamos usando el Service de Feathers, pues el que tiene la autenticacion del login
  this.feathersService = this.feathersAuthenticated.devolverFeathers();
  //Obtenemos el service que queremos
  this.obrasSocketService =   this.feathersService.service('obras');


  //Registramos eventos
  this.obrasSocketService.on('created', (obra) => this.onCreated(obra));
  this.obrasSocketService.on('updated', (obra) => this.onUpdated(obra));
  this.obrasSocketService.on('removed', (obra) => this.onRemoved(obra));
  this.obrasSocketService.on('patched', (obra) => this.onPatched(obra));
}

private onCreated(obra){
  this.addObra(obra);
}

private onUpdated(obra){
  this.updateObra(obra);
}

private onRemoved(obra){
  this.deleteObra(obra);
}

private onPatched(obra){
  this.updateObra(obra);
}


/*
  NO BORRAR Refresh manual
*/
  // public refreshData(){
  //   this.obrasService.getObras()
  //   .then(obras => {
  //       this.obras = obras;
  //       this.subscribeToData();
  //   })
  //   .catch(err => console.error('Error al recargar las obras', err))
  // }

// Cada 1 minuto refrescar los datos manualmente
  // private subscribeToData(){
  //   this.timerSubscription = Observable.timer(60000).first().subscribe(() => this.refreshData());
  // }
}
