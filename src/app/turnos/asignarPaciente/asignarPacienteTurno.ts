import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    ElementRef,
    ViewChild
} from '@angular/core';
import { ISlimScrollOptions } from 'ngx-slimscroll';
import { SelectComponent, SelectItem } from 'ng2-select';
import { elementAt } from 'rxjs/operators';


import * as _ from "lodash";
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
// import { distinctUntilChanged } from 'rxjs/operator/distinctUntilChanged';
// import { switchMap } from 'rxjs/operators/switchMap';

// Declaramos esta variable para hacer uso de Jquery con los modals de Boostrap
declare var $: any;
@Component({
    selector: 'asignacion-paciente',
    templateUrl: './asignarPacienteTurno.html',
    styleUrls: ['./asignarPacienteTurno.css']
})
export class AsignarPacienteComponent implements OnChanges {
    @Input() fechaNuevoTurno: any;
    @Input() pacientes: Array<any>;
    @Input() semanaActual: any;
    @Output() nuevaAsignacion = new EventEmitter();

    @ViewChild('closeFormCrearTurno') closeFormCrearTurno: ElementRef;
    @ViewChild('selector2') selector: ElementRef;
    @ViewChild('selector2') mySelectComponent: SelectComponent;

    public horaNuevoTurno: any;
    public diaNuevoTurno: any;
    public descripcion = '';
    public elijeParticular = false;
    public pacientesSelector: Array<any> = [];
    public actualizado = false;
    private pacienteSelected: any = {};
    private sorted = false;
    private obrasDisponibles: Array<any> = [];
    
    private searchTerms = new Subject<string>();
    private CANT_SELECTOR = 0; // TODO: aca?

    ngOnInit() {
        this.subscribeSearch();
        this.parseSemana(this.semanaActual);
        this.updateSelector(this.pacientes.slice(0,this.CANT_SELECTOR));
        this.updateFechaTurno(this.fechaNuevoTurno);
    }
    /*
    Este metodo es llamado cada vez que se cambia la fecha y/o los pacientes (inputs de este componente).
    Principalmente, se completa la variable 'pacientesSelector', para poder ser utilizados con el componente ng2-select.
    Tambien se preparan las variables de horaNuevoTurno y diaNuevoTurno para la visual del modal.
    */
    ngOnChanges(changes) {
        if (changes.semanaActual) {
            this.parseSemana(this.semanaActual);
        }
        if (changes.pacientes) {
            this.updateSelector(this.pacientes.slice(0,this.CANT_SELECTOR));
        }
        if (changes.fechaNuevoTurno) {
            this.updateFechaTurno(this.fechaNuevoTurno);
        }
    }

    // TODO: ordenar segun porcentaje
    private parseSemana(semana) {
        const yo = this;
        yo.obrasDisponibles = [];
        if (semana && semana.obrasDisponibles) {
            semana.obrasDisponibles.forEach(ob => {
                if (ob.cantDisponible > 0) {
                    const cantDispActual =
                        ob.cantDispActual === undefined ? ob.cantDisponible : ob.cantDispActual;
                    yo.obrasDisponibles.push({
                        nombre: ob.obraExpandida.nombre,
                        totalAsignadas: ob.cantDisponible,
                        cantDisponible: cantDispActual
                    });
                }
            });

            //TODO: Revisar esto =>
            //Vamos a ordenar la lista de obras sociales por nombre en forma Ascendente.
            yo.obrasDisponibles = _.orderBy(yo.obrasDisponibles, ['nombre'], ['asc']);
        }
    }

    private updateFechaTurno(fechaTurno): void {
        if (this.fechaNuevoTurno != null) {
            // Asignamos las fechas para el modal
            this.horaNuevoTurno = fechaTurno.format('HH:mm');
            this.diaNuevoTurno = fechaTurno.format('DD [de] MMMM');
            this.elijeParticular = false;
        }
    }

    private updateSelector(pacientes): void {
        const yo = this;
        if (pacientes && pacientes.length > 0) {
            yo.pacientesSelector = [];
            pacientes.forEach(function (elem, index) {
                /*
                Dado que estamos usando el componente ng2-select,
                debemos tener un arreglo en el que cada objeto TENGA:
                un atributo 'id'
                un atributo 'text'
              */
                yo.pacientesSelector[index] = elem;
                yo.pacientesSelector[index].id = elem._id;
                yo.pacientesSelector[index].text = elem.apellido + ' ' + elem.nombre + ' - ' + elem.dni;
            });
        } else {
            yo.pacientesSelector = [];
        }
    }

    public asignarTurno() {
        let pacienteAsignado = null;
        const yo = this;

        const desc = this.descripcion;

        this.pacientesSelector.forEach(function (elem, index) {
            if (elem.id == yo.pacienteSelected.id) {
                pacienteAsignado = Object.assign({}, elem); //clonamos el elemento
                pacienteAsignado.descripcion = desc;
            }
        });

        if (this.elijeParticular) {
            pacienteAsignado.elijeParticular = true;
        } else {
            pacienteAsignado.elijeParticular = false;
        }

        // Quitamos los atributos agregados para el selector del clone
        // delete pacienteAsignado['id'];
        // delete pacienteAsignado['text'];
        // ////console.log(pacienteAsignado);
        // Cerramos el modal
        this.closeFormCrearTurno.nativeElement.click();

        // Enviamos la eleccion al componente padre
        this.nuevaAsignacion.next(pacienteAsignado);
    }

    /*
  
    */
    public cancelar() {
        // Limpiamos variables
        // this.pacienteSelected = {};

        // Cerramos el modal
        this.closeFormCrearTurno.nativeElement.click();
    }

    /*
      Este metodo reserva un turno SIN paciente para un medico
    */
    public reservar() {
        const turnoReserva = {
            esReserva: true
        };

        // Cerramos el modal
        this.closeFormCrearTurno.nativeElement.click();

        // Enviamos la eleccion al componente padre
        this.nuevaAsignacion.next(turnoReserva);
    }

    /*
  
    */
    public agregarPaciente() {
        $('#formAgregarPaciente').modal('show');
    }

    // TODO: Revisar esto. Es necesario?
    public onPacienteAgregado(pacienteNuevo) {
        if (this.pacientesSelector.length > 0) {
            this.pacientesSelector = [];
        }

        if (pacienteNuevo != null && pacienteNuevo.aprobado) {
            this.pacientes.push(pacienteNuevo); // No se si es necesario hacerlo con pacientes

            // Reiniciamos el selector
            const yo = this;
            this.pacientes.forEach(function (elem, index) {
                yo.pacientesSelector[index] = elem;
                yo.pacientesSelector[index].id = elem._id;
                yo.pacientesSelector[index].text = elem.apellido + ' ' + elem.nombre + ' - ' + elem.dni;
                // Si es el que agregamos lo dejamos seleccionado
                if (elem._id === pacienteNuevo._id) {
                    yo.pacienteSelected.id = elem._id;
                    yo.pacienteSelected.text = elem.apellido + ' ' + elem.nombre + ' - ' + elem.dni;
                    // con esto lo seteamos en visual tambien
                    yo.mySelectComponent.active = [
                        { id: elem._id, text: elem.apellido + ' ' + elem.nombre + ' - ' + elem.dni }
                    ];
                }
            });

            // refreshValue(value);
        }

        if (this.selector !== undefined) {
            /*
            IMPORTANTE: Workaround para que se actualice segun obrasSelector
            Sacado de:
            https://github.com/valor-software/ng2-select/issues/635#issuecomment-281094377
            */
            (<any>this.selector).open();
        }
    }


    /**
     * Metodo para buscar un termino dentro de la lista de pacientes
     * @param termino 
     */
    private searchByTerm(termino: string): any[] {
        let pacientesFiltrados = [];
        if (termino.length < 5) {
            pacientesFiltrados = this.pacientes.filter((paciente) => {
            const cadena = (paciente.apellido +  paciente.dni + paciente.nombre).toLowerCase();
            // console.log('cadena: ', cadena);
            return cadena.includes(termino);
            });
        }
        return pacientesFiltrados;
      }

    /**
     * Metodo para actualizar el selector cada vez que escriben.
     */
    private subscribeSearch(): void {
        const yo = this;
        this.searchTerms.pipe(
            distinctUntilChanged(),
            // debounceTime(100),
        ).subscribe(term => {
            let pacientesFiltrados = yo.searchByTerm(term);
            yo.updateSelector(pacientesFiltrados);
          
        });
    }

    // ---------------------------------------------------------------------------
    
    // Metodo invocado por el evento de tipeo de ng2-select2
    public typed(value: string): void {
        if (!(!value.trim() || this.pacientes.length < 1)) {
            let termino = value.trim().replace(/\s/g,'').toLowerCase();
            if (termino.length >= 3) {
                if (termino.length < 5) {
                    // Push a search term into the observable stream.
                    this.searchTerms.next(termino);
                }
            } else {
                this.updateSelector([]);
            }
        }
    }

    public refreshValue(value: any): void {
        const pacienteOriginal = this.pacientes.find(el => el.id === value.id);
        this.pacienteSelected = value;
        this.pacienteSelected.obra = pacienteOriginal.obra.iniciales;
    }
}
