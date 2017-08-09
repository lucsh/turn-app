import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import * as moment from 'moment';

import { Observable } from 'rxjs/Rx';


declare var jQuery:any;


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

  constructor(private dashboardService: DashboardService){
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

  // getAllMensajes(){
  //   this.dashboardService.getMensajes()
  //   .subscribe(
  //     data => this.mensajes = data,
  //     error => ////console.log('Server Error')
  //   );
  // }
  // getAllEstadosCitas(){
  //   this.dashboardService.getEstadosCitas()
  //   .subscribe(
  //     data => this.estadosCitas = data,
  //     error => ////console.log('Server Error')
  //   );
  // }
  // getAllCitas(){
  //   this.dashboardService.getCitas()
  //   .subscribe(
  //     data => this.citas = data,
  //     error => ////console.log('Server Error')
  //   );
  // }
  // updateCita(cita,estado){
  //   ////console.log(cita);
  //   ////console.log(estado);
  //   cita.status=estado;
  //   this.dashboardService.updateCita(cita).subscribe(
  //     data => {
  //       this.getAllTodos();
  //     });
  //
  // }



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
