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
      this.getAllPacientes();
  }

  public toInt(num: string) {
      return +num;
  }

  getAllPacientes(): void{
    this.pacientesService
    .getPacientes()
    .then(pacientes => {
        this.pacientes = pacientes;
        console.log(pacientes);
    });
  }

  public sortByWordLength = (a: any) => {
      return a.city.length;
  }

}
