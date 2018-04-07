import { Component, OnInit } from "@angular/core";
import { TurnosDelMedicoService } from "./turnos-del-medico.service";
import { Subscription } from "rxjs/Subscription";
import { Turno } from "../turnos/turno.tipo";
import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnDestroy
} from "@angular/core";
import * as moment from "moment";
import { NotificationsService } from "angular2-notifications";

@Component({
  selector: "app-turnos-del-medico",
  providers: [TurnosDelMedicoService, NotificationsService],
  templateUrl: "./turnos-del-medico.component.html",
  styleUrls: ["./turnos-del-medico.component.css"]
})
export class TurnosDelMedicoComponent implements OnInit {
  private subscription: Subscription;
  public ordenados = false;
  estadosTurnos: any[] = [
    {
      id: 1,
      nombre: "en espera",
      clase: "warning"
    },
    {
      id: 2,
      nombre: "pendiente",
      clase: "default"
    },
    {
      id: 3,
      nombre: "finalizado",
      clase: "danger"
    },
    {
      id: 4,
      nombre: "activo",
      clase: "success"
    },
    {
      id: 5,
      nombre: "otro",
      clase: "info"
    },
    {
      id: 6,
      nombre: "en estudio",
      clase: "info"
    }
  ];
  turnos: Turno[];
  reservas: Turno[];
  private miMatricula: String;
  private medicoId: String;

  // Opciones de las notificiones
  public options = {
    position: ["top", "right"],
    //  timeOut: 5000,
    showProgressBar: false,
    animate: "fromRight",
    lastOnBottom: false
  };
  constructor(
    private turnosDelMedicoService: TurnosDelMedicoService,
    private ref: ChangeDetectorRef,
    private notificacionesService: NotificationsService
  ) {}

  /* Metodo para asignar la visual de los desplegables de la visual */
  claseEstadoTurno(status) {
    let clase = "btn-default";
    for (const i in this.estadosTurnos) {
      if (status == this.estadosTurnos[i].nombre) {
        clase = "btn-" + this.estadosTurnos[i].clase;
      }
    }

    return clase;
  }

  /* Metodo para armar un objeto fechas. tiene las alternativas de ambos SO trabajados en el desarrollo */
  aDate(turno) {
    // En Windows:
    // var momentDate = moment(turno);

    // En Linux: UTC
    const momentDate = moment(turno, "YYYY-MM-DDTHH:mm:ss");
    const fecha = momentDate.toDate();
    return fecha;
  }

  updateTurno(turno, estado) {
    turno.estado = estado;

    this.turnosDelMedicoService.updateTurno(turno, estado);
  }

  public llamarPaciente(turno) {
    this.turnosDelMedicoService.updateTurno(turno, "activo");
  }

  public finalizarTurno(turno) {
    this.turnosDelMedicoService.updateTurno(turno, "finalizado");
  }

  public ponerEnEstudio(turno) {
    this.turnosDelMedicoService.updateTurno(turno, "en estudio");
  }

  public comprobarEstado(turno): Boolean {
    let bandera = false;
    if (turno.estado === "en espera" || turno.estado === "en estudio") {
      bandera = true;
    }
    return bandera;
  }

  ngOnInit() {
    const medico: any = JSON.parse(localStorage.getItem("user"));
    this.ordenados = false;
    if (medico.clase === "medico") {
      this.miMatricula = medico.matricula;
      this.medicoId = medico._idMedico;

      this.turnosDelMedicoService.asignarNotificaciones(
        this.notificacionesService
      );

      this.subscription = this.turnosDelMedicoService.turnos$.subscribe(
        turnos => {
          this.turnos = turnos;
          this.turnos.filter(t => {
            if (t.descripcionReserva) {
              t.descripcion = t.descripcionReserva;
            }
            return t;
          });

          this.ref.markForCheck();
          this.turnos.sort(function(a, b) {
            const c = new Date(a.horaInicial);
            const d = new Date(b.horaInicial);
            const comparacion = c.getTime() - d.getTime();

            return comparacion;
          });
          this.ordenados = true;
        },
        err => {
          console.error(err);
        }
      );

      this.turnosDelMedicoService.buscarTurnos(this.miMatricula, this.medicoId);
    }
  }

  /**
   * Este metodo ahora no esta en uso. Sin embargo, posiblemente sea util a futuro para separar las vistas
   * de reservas y de consultas medicas
   */
  private separarReservas(turnos) {
    // Protegemos que sean turnos y no turnos-reservas de los medicos
    const consultasMedicas = turnos.filter(t => {
      return !t.esReserva;
    });
    const reservas = turnos.filter(t => {
      return t.esReserva;
    });

    // la variable 'dataStore' tiene turnos normales y reservas.
    this.turnos = consultasMedicas;
    this.reservas = reservas;

    // TODO: cambiar MODELO de Turno en BackEnd para tener 1 sola descripcion en vez de dos.
    this.reservas.filter(t => {
      console.log("EL TURNO T ES: ");
      console.log(t);
      t.descripcion.length == 0 ? (t.descripcion = t.descripcionReserva) : (t.descripcion = t.descripcion);
    });
  }
}
