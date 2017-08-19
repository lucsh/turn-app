import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import {Http} from "@angular/http";
import {DataFilterPipe2} from './obras-filter.pipe';
import {ObrasService} from './obras.service';

import { Obra } from './obra.tipo';
import {default as swal} from 'sweetalert2';


declare var $: any;
@Component({
  selector: 'app-obras',
  providers:[ObrasService],
  templateUrl: './obras.component.html',
  styleUrls: ['./obras.component.css']
})
export class ObrasComponent implements OnInit {
  @ViewChild('closeformCrearObra') closeformCrearObra: ElementRef;
  public data;
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "email";
  public sortOrder = "asc";

  public obraSelected = null;

  obraNueva: Obra;
  obras: Obra[];
  constructor(private obrasService: ObrasService) {
    this.obraNueva = new Obra();
  }

  ngOnInit() {
    this.getAllObras();
  }


  private getAllObras(): void{
    this.obrasService
    .getObras()
    .then(obrasObtenidas => {
        this.obras = obrasObtenidas;
        this.data = obrasObtenidas;
        ////console.log(obras);
    });
  }

  editar(obra){

    this.obraSelected = obra;
    /*
      FIX TEMPORAL: El timeout es para obligar a que el ngIf que proteje el modal,
      alcance a hacerse true.
    */
    setTimeout(()=> {
      $('#formEditarObra').modal('show');
    },
    200);
  }

  eliminar(obra){
    let yo = this;
    swal({
      title: '¿Estas seguro que queres eliminar a la obra social?',
      //text: "No seras capaz de revertir esta accion!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar!',
      cancelButtonText: 'Cancelar',
    }).then(function () {
      yo.obrasService.eliminarObra(obra._id).then(obraNueva => {
        // ////console.log("Paciente eliminado");
        // ////console.log(pac);
        var index = yo.data.indexOf(obra);
        if (index > -1) {
          yo.data.splice(index, 1);
        }
      }).catch(err => console.error(err))
    }).catch(swal.noop);
  }




  abrirFormularioCrear(){
    setTimeout(()=> {
      $('#formCrearObra').modal('show');
    },
    200);
  }

  cancelarModalCrear(){
    this.closeformCrearObra.nativeElement.click();
  }

  crearObra(iniciales,nombre){
    this.obrasService.crearObra(iniciales,nombre).then((obraCreada)=>{
      console.log("OBRA CREADAAAAAAAAAAAAAAAAAA");
      console.log(obraCreada);
      this.obras.push(obraCreada);
      // this.data.push(obraCreada);
      this.closeformCrearObra.nativeElement.click();
    })
  }

  onObraEditado(obraEditado){
    console.log('on obra Editado');
    console.log(obraEditado);

    let encontrado = -1;
    this.obras.forEach(function(elem, index){
      //console.log(elem);
      if(elem._id == obraEditado._id){
        encontrado = index;
      }
    });

    if(encontrado > 0){
      this.obras[encontrado] = Object.assign({}, obraEditado);
    }

  }



}
