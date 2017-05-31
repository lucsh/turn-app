import { Component, OnDestroy, OnInit } from '@angular/core';

declare var jQuery:any;


@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnDestroy, OnInit {
	
  public nav:any;
  public todos: any;

  public constructor() {
    this.nav = document.querySelector('nav.navbar');
    this.todos = [
      {name: "Buy a milk", completed: true},
      {name: "Go to shop and find some products.", completed: false},
      {name: "Send documents to Mike ", completed: false, time: 1},
      {name: "Go to the doctor dr Smith", completed: false},
      {name: "Plan vacation", completed: true},
      {name: "Create new stuff", completed: false},
      {name: "Call to Anna for dinner", completed: false},
    ];
  }

  public ngOnInit():any {
    this.nav.className += " white-bg";
  }


  public ngOnDestroy():any {
    this.nav.classList.remove("white-bg");
  }

}
