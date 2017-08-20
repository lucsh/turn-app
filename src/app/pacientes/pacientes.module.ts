import { NgModule }      from '@angular/core';
import { CommonModule }      from '@angular/common';
import { FormsModule } from "@angular/forms";
import { DataTableModule } from "angular2-datatable";
import { HttpModule } from "@angular/http";

import { PacientesComponent }   from './pacientes.component';
import { DataFilterPipe }   from './pacientes-filter.pipe';

@NgModule({
  imports:      [
    CommonModule,
    DataTableModule,
    FormsModule,
    HttpModule
  ],
  declarations: [],
  exports: []
})

export class PacientesModule{}


/*
Copyright 2016 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
