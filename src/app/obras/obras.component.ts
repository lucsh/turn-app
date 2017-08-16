import { Component, OnInit } from '@angular/core';
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

  public data;
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "email";
  public sortOrder = "asc";

  public obraSelected = null;

  obras: Obra[];
  constructor(private obrasService: ObrasService) { }

  ngOnInit() {
    this.getAllObras();
  }


  private getAllObras(): void{
    this.obrasService
    .getObras()
    .then(obras => {
        this.obras = obras;
        this.data = obras;
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
