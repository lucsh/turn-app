import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Http } from '@angular/http';
import {DataFilterPipe2 } from './obras-filter.pipe';
import { ObrasService } from '../../shared/services/obras.service';

import { Obra } from '../../shared/models/obra.tipo';
import {default as swal} from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { AlertService } from 'app/shared/services/alerts.service';


declare var $: any;
@Component({
  selector: 'app-obras',
  providers: [],
  templateUrl: './obras.component.html',
  styleUrls: ['./obras.component.css']
})
export class ObrasComponent implements OnInit {

  constructor() {
 
  }

  ngOnInit() {
  }


}
