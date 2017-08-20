import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import * as moment from 'moment';

import { Observable } from 'rxjs/Rx';


declare var jQuery:any;


import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnDestroy, OnInit {

  public nav:any;
  todos: string[];
  citas: string[];
  mensajes: string[];
  estadosCitas: any;
  whatTime: any;


  //Opciones de las notificiones
  public options = {
       position: ["top", "right"],
      //  timeOut: 5000,
       showProgressBar: false,
       animate: "fromRight",
       lastOnBottom: false,
   };

  constructor(private dashboardService: DashboardService,
    public _service: NotificationsService){
    this.nav = document.querySelector('nav.navbar');
    this.whatTime = Observable.interval(1000)
    .map(x => moment()).share();
  }
  aDate(turno){
    var momentDate = moment(turno);
    var fecha = momentDate.toDate();
    return fecha
  }
  claseEstadoCita(status){
    var clase = "btn-default";
    for (var i in this.estadosCitas) {
      if (status == this.estadosCitas[i].nombre){
        clase = "btn-" + this.estadosCitas[i].clase;
      }
    }

    return clase
  }


  // create() {
  //         this._service.success(
  //           'Some Title',
  //           'Some Content'
  //       )
  //   }


  public ngOnInit():any {

  //  this.getAllCitas();
    //this.getAllMensajes();
    //this.getAllEstadosCitas();
    this.nav.className += " white-bg";
  }


  public ngOnDestroy():any {
    this.nav.classList.remove("white-bg");
  }

}
