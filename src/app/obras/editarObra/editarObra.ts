import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ElementRef, ViewChild } from '@angular/core';


import { Obra } from '../../shared/models/obra.tipo';
import { ObrasService } from 'app/shared/services/obras.service';

import {default as swal} from 'sweetalert2';
import { AlertService } from 'app/shared/services/alerts.service';

@Component({
  selector: 'editar-obra',
  templateUrl: './editarObra.html',
  styleUrls: ['./editarObra.css']
})
export class EditarObraComponent implements OnInit, OnChanges{

  // @Input() fechaNuevoTurno: any;
  @Input() obra: any;
  @Output() obraEditada = new EventEmitter();
  @Output() obraEliminada = new EventEmitter();

  @ViewChild('closeFormEditarObra') closeFormEditarObra: ElementRef;

  // private obras: Obra[];
  // private obraSelected: Obra = null;

  public modeloObra = null;

  constructor(
    private obrasService: ObrasService,
    private alertService: AlertService
  ){

  }

  /*
  */
  ngOnInit() {
    // this.obrasService.getObras().then(
    //   obras =>{
    //     console.log('Tengo las obras!!');
    //     this.obras = obras;
    //     this.modeloPaciente = Object.assign({}, this.paciente); //clonamos el paciente
    //
    //     console.log(this.paciente);
    //   }
    // ).catch(error=>{console.log(error)})
  }

  /*
  */
  ngOnChanges(changes) {
    // changes.prop contains the old and the new value...
    this.modeloObra = Object.assign({}, this.obra); //clonamos el paciente
  }

  /*

  */
  public editarObra(){
    ////console.log('Entre a agregar Paciente');
    //  let obraId = this.obraSelected._id;

    console.log('this.modeloObra');
    console.log(this.modeloObra);

    this.obrasService.actualizarObra(this.modeloObra._id, this.modeloObra)
    .then(obraEdit => {
      this.obraEditada.next(obraEdit);


      //Cerramos el modal y limpiamos variables
      //this.modeloPaciente = null;
      // this.obraSelected = null;
      this.closeFormEditarObra.nativeElement.click();

    }).catch(err => {console.log(err); });
  }


  /*

  */
  public cancelar(){
    //Limpiamos variables
    //this.value = {};

    //Cerramos el modal
    // this.obraSelected = null;
    this.closeFormEditarObra.nativeElement.click();
  }

  eliminar(obra){
    const yo = this;

    const eliminarObra = function () {
      yo.obrasService.eliminarObra(obra._id).then(obraEliminada => {
        yo.obraEliminada.next(obraEliminada);
        //Cerramos el modal y limpiamos variables
        // this.modeloPaciente = null;
        // this.obraSelected = null;
        yo.closeFormEditarObra.nativeElement.click();
      }).catch(err => console.error(err));
    };

    // this.alertService.warningCallbacks('¿Estas seguro que queres eliminar a la obra social?', 'Si, Eliminar!', true, eliminarObra );
    this.alertService.warning('¿Estas seguro que queres eliminar a la obra social?', 'Si, Eliminar!', true )
    .then(() => eliminarObra())
    .catch(err => console.error(err))
    .catch(swal.noop);
  }



}
