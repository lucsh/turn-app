import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-particulares',
  templateUrl: './particulares.component.html',
  styleUrls: ['./particulares.component.css']
})
export class ParticularesComponent implements OnInit, OnChanges {

  @Input() particulares;
  particularesForm: FormGroup;

  constructor(private fb: FormBuilder) {

    this.createForm();
   }

  ngOnInit() {
    // Convertimos las restriccionesParticulares en el formulario inicial

    if (!this.particulares) {
      const partAux = [];
      this.particularesForm.setValue(this.iniciarRestriccionesParticulares(partAux));
    } else {
      this.particularesForm.setValue(this.iniciarRestriccionesParticulares(this.particulares));
    }

  }

  ngOnChanges(changes) {

  }


  createForm() {
    this.particularesForm = this.fb.group({
      lunes: false,
      martes: false,
      miercoles: false,
      jueves: false,
      viernes: false,
      sabado: false,
    });
  }

  getValues() {
    // convertimos el formulario en las restricciones
    const restricciones = this.crearRestricciones(this.particularesForm.value);
    return restricciones;
  }

  getForm() {
    return this.particularesForm;
  }

  private iniciarRestriccionesParticulares(restricciones) {
    const diasParticulares = {
      lunes: false,
      martes: false,
      miercoles: false,
      jueves: false,
      viernes: false,
      sabado: false
    };
    // TODO: Si llegan a haber mas restricciones ademas de particular, controlar eso con un IF
    restricciones.forEach(r => {
      if (r.dia === 1) {
        diasParticulares.lunes = true;
      }
      if (r.dia === 2) {
        diasParticulares.martes = true;
      }
      if (r.dia === 3) {
        diasParticulares.miercoles = true;
      }
      if (r.dia === 4) {
        diasParticulares.jueves = true;
      }
      if (r.dia === 5) {
        diasParticulares.viernes = true;
      }
      if (r.dia === 6) {
        diasParticulares.sabado = true;
      }
    });
    return diasParticulares;
  }

  private crearRestricciones(diasParticulares) {
    const restricciones = [];

    // TODO: Cambiar obrasPermitidas:'Particular' segun el objecto Obra que venga como parametro.

    if (diasParticulares.lunes) {
      restricciones.push({
        dia: 1,
        restriccion: { obrasPermitidas: ['Particular'] }
      });
    }
    if (diasParticulares.martes) {
      restricciones.push({
        dia: 2,
        restriccion: { obrasPermitidas: ['Particular'] }
      });
    }
    if (diasParticulares.miercoles) {
      restricciones.push({
        dia: 3,
        restriccion: { obrasPermitidas: ['Particular'] }
      });
    }
    if (diasParticulares.jueves) {
      restricciones.push({
        dia: 4,
        restriccion: { obrasPermitidas: ['Particular'] }
      });
    }
    if (diasParticulares.viernes) {
      restricciones.push({
        dia: 5,
        restriccion: { obrasPermitidas: ['Particular'] }
      });
    }
    if (diasParticulares.sabado) {
      restricciones.push({
        dia: 6,
        restriccion: { obrasPermitidas: ['Particular'] }
      });
    }
    return restricciones;
  }

}
