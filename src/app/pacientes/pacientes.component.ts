import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import {DataFilterPipe} from './pacientes-filter.pipe';
import {PacientesService} from './pacientes.service';
import {Paciente} from './paciente.tipo';

@Component({
  selector: 'app-pacientes',
  providers:[PacientesService],
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.css']
})
export class PacientesComponent implements OnInit {

  public data;
  public filterQuery = "";
  public rowsOnPage = 10;
  public sortBy = "email";
  public sortOrder = "asc";

  pacientes: Paciente[];

  constructor(private http: Http, private pacientesService: PacientesService) {
  }

  ngOnInit(): void {
      // this.http.get("./data.json")
      //     .subscribe((data)=> {
      //         setTimeout(()=> {
      //             this.data = data.json();
      //         }, 1000);
      //     });
      // this.getAllPacientes();
      this.getAllPacientesActivados();
  }

  public toInt(num: string) {
      return +num;
  }

  getAllPacientes(): void{
    this.pacientesService
    .getPacientes()
    .then(pacientes => {
        this.pacientes = pacientes;
        this.data = pacientes;
        console.log(pacientes);
    });
  }

  getAllPacientesActivados(): void{
    this.pacientesService
    .getPacientesActivos()
    .then(pacientes => {
        this.pacientes = pacientes;
        this.data = pacientes;
        console.log("PACIENTES ACTIVOS: ");
        console.log(pacientes);
    });
  }
  public sortByWordLength = (a: any) => {
      return a.city.length;
  }

  buscarPaciente(id:string){
    console.log("Entre al buscar paciente");
    this.pacientesService.buscarPaciente(id).then(paciente => {
      //console.log("el nuevo paciente quedo..");
      console.log(paciente);
    });
  }


  editar(paciente){
    if (confirm("¿Estas seguro que queres editar al paciente?")) {
      this.pacientesService.actualizarPaciente(paciente._id,paciente).then(pac => {
        console.log("el nuevo paciente quedo..");
        console.log(pac);
        paciente = pac;
      });
    }
    //let nuevosDatos = "nombre=ramon";
    //console.log("ENTRE A EDITAR");
    //console.log(paciente);
    //paciente.nombre="RAMON";
    //console.log(paciente);



  }

  sancionar(paciente){
    if (confirm("¿Estas seguro que queres sancionar al paciente?")) {
      this.pacientesService.sancionarPaciente(paciente._id).then(pac => {
        console.log("Paciente sancionado");
        console.log(pac);
        paciente.sancion = true;
      });
    }
  }

  habilitar(paciente){
    if (confirm("¿Estas seguro que queres habilitar al paciente?")) {
      this.pacientesService.habilitarPaciente(paciente._id).then(pac => {
        console.log("Paciente habilitado");
        console.log(pac);
        paciente.sancion = false;
      });
    }

  }

  eliminar(paciente){
    if (confirm("¿Estas seguro que queres eliminar el paciente?")) {
      let yo = this;
      this.pacientesService.eliminarPaciente(paciente._id).then(pac => {
        console.log("Paciente eliminado");
        console.log(pac);
        var index = yo.data.indexOf(paciente);
        if (index > -1) {
          yo.data.splice(index, 1);
        }
        paciente.eliminado = true;
      });
    }
  }



}
