import { Component, OnInit, Input, Output,EventEmitter,OnChanges, ElementRef, ViewChild } from '@angular/core';
import { Obra } from '../../obras/obra.tipo';
import {ConfiguracionMedicoService} from '../../configuracion-medico/configuracion-medico.service';

import { MedicosCompartidosService } from '../../routerService/medicos.sistema';
import { Subscription } from 'rxjs/Subscription';

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
  @Input() obrasRecibidas: any[];
  @Output() medicoEditado = new EventEmitter();
  @Output() medicoEliminado = new EventEmitter();

  @ViewChild('closeFormEditarMedico') closeFormEditarMedico: ElementRef;

  public obraSelected: Obra = null;
  public obras: Obra[];

  public modeloMedico = null;

  private medicosSubscription: Subscription;

  public actualizado: boolean = false;
  public obrasSelector: Array<any> = [];
  public options: Select2Options;
  public value: any[] = [];
  public current: string;

  private _disabledV:string = '0';
  private disabled:boolean = false;
  constructor(
    private configuracionMedicoService: ConfiguracionMedicoService,
    private medicosCompartidos: MedicosCompartidosService
  ){
    this.modeloMedico = {};
  }


  /*
  */
  ngOnInit() {
    this.modeloMedico = Object.assign({}, this.medicoSeleccionado); //clonamos el medico
    this.obras = this.obrasRecibidas;
    this.actualizarSelector();
  }

  public actualizarSelector(){
    if(this.obras!=null){
      let yo = this;
      this.obrasSelector = []; // IMPORTANTE: tenemos que inicializarlo, sino no se re-inicia el selector
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

      yo.medicoSeleccionado.nombre = nombre;
      yo.medicoSeleccionado.apellido = apellido;
      yo.medicoSeleccionado.duracion = medicoNuevo.duracion;
      yo.medicoSeleccionado.email = medicoNuevo.email;
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

    this.obrasSelector.forEach(function(elem,index){
      for (let i = 0; i < yo.value.length; i++) {

        if(elem.id.toString() == yo.value[i]){
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
    this.obras = this.obrasRecibidas;
    this.actualizarSelector();
    this.modeloMedico = Object.assign({}, this.medicoSeleccionado); //clonamos el medico
  }

  /*

  */
  public cancelar(){

    //Cerramos el modal
    this.obraSelected = null;
    this.closeFormEditarMedico.nativeElement.click();
  }


  //---------------------------------------------------------------------------
  //Metodos originales del componente


  changed(data: {value: string[]}) {
    this.current = data.value.join(' | ');
    this.value = data.value;
  }


  private get disabledV():string {
    return this._disabledV;
  }

  private set disabledV(value:string) {
    this._disabledV = value;
    this.disabled = this._disabledV === '1';
  }
  public selected(value:any):void {
  }

  public removed(value:any):void {
  }

  public typed(value:any):void {
  }

  public refreshValue(value:any):void {
    this.value = value;
  }


}
