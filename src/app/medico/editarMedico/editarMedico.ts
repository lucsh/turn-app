import { Component, OnInit, Input, Output,EventEmitter,OnChanges, ElementRef, ViewChild } from '@angular/core';

// import { Paciente } from '../paciente.tipo';
// import { PacientesService } from '../pacientes.service';

import { Obra } from '../../obras/obra.tipo';
import {ConfiguracionMedicoService} from '../../configuracion-medico/configuracion-medico.service';

import { ObrasCompartidasService } from '../../routerService/obras.sistema';
import { MedicosCompartidosService } from '../../routerService/medicos.sistema';
import { Subscription } from 'rxjs/Subscription';

// import { ObrasService } from '../../obras/obras.service';

import {default as swal} from 'sweetalert2';
declare var $: any;
@Component({
  selector: 'editar-medico',
  templateUrl: './editarMedico.html',
  styleUrls: ['./editarMedico.css']
})
export class EditarMedicoComponent implements OnInit, OnChanges{

  // @Input() fechaNuevoTurno: any;
  @Input() medicoSeleccionado: any;
  @Output() medicoEditado = new EventEmitter();
  @Output() medicoEliminado = new EventEmitter();

  @ViewChild('closeFormEditarMedico') closeFormEditarMedico: ElementRef;

  public obraSelected: Obra = null;
  public obras: Obra[];

  public modeloMedico = null;

  private medicosSubscription: Subscription;
  private obrasSubscription: Subscription;

  public actualizado: boolean = false;
  public obrasSelector: Array<any> = [];
  public options: Select2Options;
  public value: any[] = [];
  public current: string;

  private _disabledV:string = '0';
  private disabled:boolean = false;
  constructor(
    private configuracionMedicoService: ConfiguracionMedicoService,
    private medicosCompartidos: MedicosCompartidosService,
    private obrasCompartidas: ObrasCompartidasService
  ){
    this.modeloMedico = {};
  }


  /*
  */
  ngOnInit() {
    this.modeloMedico = Object.assign({}, this.medicoSeleccionado); //clonamos el medico
    this.observarObras();
  }

  observarObras(){
    /*
      Subscribimos a los obras, para que tengan una correspondencia
      con los obras del navigator
    */
    if(this.obrasCompartidas.obras$){
      this.obrasSubscription = this.obrasCompartidas.obras$.subscribe((obras) => {

          this.obras = obras;
          this.actualizarSelector();
        // this.ref.markForCheck();
      }, (err) => {
        console.log('Error en observarObras de tablaObras');
        console.error(err);
      });

      // Obtenemos los pacientes compartidos
      this.obrasCompartidas.getObras();
    }
  }

  public actualizarSelector(){
    if(this.obras!=null){
      ////console.log('Entre a Ng on Changes del modal configurar semana');


      let yo = this;

      // Actualizamos las obras posibles
      this.obras.forEach(function(elem,index){
        /*
        Dado que estamos usando el componente ng2-select,
        debemos tener un arreglo en el que cada objeto TENGA:
        un atributo 'id'
        un atributo 'text'
        */
        yo.obrasSelector[index] = elem;
        yo.obrasSelector[index].id = elem._id;
        yo.obrasSelector[index].text = elem.nombre;
      });

      this.iniciarSelectorObras();


      if(yo.obrasSelector.length > 0){
        ////console.log('TRUE');
        this.actualizado = true;
      }
    }
  }

  private iniciarSelectorObras(){

    this.options = {
      multiple: true
    }

    this.current = this.value.join(' | ');

    // Hacemos que el selector empiece con las obras del medico seleccionadas
    let listaAux = [];
    if(this.medicoSeleccionado.obras){
      // console.log(this.medicoSeleccionado.obras);
      this.medicoSeleccionado.obras.forEach(function(elem,index){
        listaAux.push(elem._id);
      });
      this.value = listaAux;
    }
  }

  public actualizarDatos(nombre,apellido,email,duracionTurno){
    let id = this.medicoSeleccionado._id;
    let idUsuario = this.medicoSeleccionado._idUsuario;
    let emailMedico = email.toLowerCase();

    let yo = this;

    let obrasAsignadas = this.asignarObras();

    this.configuracionMedicoService.actualizarMedico(id,nombre,apellido,emailMedico, duracionTurno,obrasAsignadas, idUsuario).then(medicoNuevo =>{

      // let id = medicoNuevo._id;
      // let index = this.getIndex();

      yo.medicoSeleccionado.nombre = nombre;
      yo.medicoSeleccionado.apellido = apellido;
      yo.medicoSeleccionado.duracion = medicoNuevo.duracion;
      yo.medicoSeleccionado.email = medicoNuevo.email;
      // console.log(medicoNuevo.obras);
      yo.medicoSeleccionado.obras = medicoNuevo.obras;

      //Actualizamos los medicos compartidos (para el navigator)
      yo.medicosCompartidos.updateMedico(medicoNuevo);

      yo.closeFormEditarMedico.nativeElement.click();
      yo.medicoEditado.next(medicoNuevo);

    });
  }

  public asignarObras(){

    let obrasAsignadas = [];
    let yo = this;

    // console.log('yo.value');
    // console.log(yo.value);

    this.obrasSelector.forEach(function(elem,index){
      for (let i = 0; i < yo.value.length; i++) {

        if(elem.id.toString() == yo.value[i]){
          // console.log('****************************************');
          // console.log('encontre!');
          obrasAsignadas.push(elem._id); //clonamos el elemento
        }
      }

    });

    //Quitamos los atributos agregados para el selector del clone
    // delete pacienteAsignado['id'];
    // delete pacienteAsignado['text'];
    // ////console.log(pacienteAsignado);

    return obrasAsignadas;
  }



  /*
  */
  ngOnChanges(changes) {
    // changes.prop contains the old and the new value...
    this.iniciarSelectorObras();
    this.modeloMedico = Object.assign({}, this.medicoSeleccionado); //clonamos el medico
  }




  // eliminar(paciente){
  //   let yo = this;
  //   swal({
  //     title: '¿Estas seguro que queres habilitar al paciente?',
  //     //text: "No seras capaz de revertir esta accion!",
  //     type: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Si, Eliminar!',
  //     cancelButtonText: 'Cancelar',
  //   }).then(function () {
  //     console.log('paciente');
  //     console.log(paciente);
  //     yo.pacientesService.eliminarPaciente(paciente._id).then(pac => {
  //       // ////console.log("Paciente eliminado");
  //       // ////console.log(pac);
  //       yo.pacienteEliminado.next(pac);
  //
  //       yo.obraSelected = null;
  //       yo.closeFormEditarPaciente.nativeElement.click();
  //     }).catch(err => console.error(err))
  //   }).catch(swal.noop);
  // }


  /*

  */
  public cancelar(){
    //Limpiamos variables
    //this.value = {};

    //Cerramos el modal
    this.obraSelected = null;
    this.closeFormEditarMedico.nativeElement.click();
  }


  //---------------------------------------------------------------------------
  //Metodos originales del componente


  changed(data: {value: string[]}) {
    this.current = data.value.join(' | ');
    this.value = data.value;
    //console.log(this.current);
  }


  private get disabledV():string {
    return this._disabledV;
  }

  private set disabledV(value:string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
  }
  public selected(value:any):void {
    ////console.log('Selected value is: ', value);
  }

  public removed(value:any):void {
    ////console.log('Removed value is: ', value);
  }

  public typed(value:any):void {
    ////console.log('New search input: ', value);
  }

  public refreshValue(value:any):void {
    this.value = value;
  }


}
