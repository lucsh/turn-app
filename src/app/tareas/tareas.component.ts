import { Component, OnInit } from '@angular/core';
import {TareasService} from './tareas.service';
import {Tarea} from './tarea.tipo';

@Component({
  selector: 'app-tareas',
  providers:[TareasService],
  templateUrl: './tareas.component.html',
  styleUrls: ['./tareas.component.css']
})
export class TareasComponent implements OnInit {


  todos: Tarea[];

  public todoActual : {
    algo: any
  } = {
    algo: null
  };
  constructor(private tareasService: TareasService) { }

  ngOnInit() {
    this.getAllTodos();
  }


  getAllTodos(){
    this.tareasService.getTodos().then((allTODOS) => {
      this.todos = allTODOS;

    });
  }
  createTodo(descripcion : string){

    this.tareasService.createTodo(descripcion).subscribe(
      data => {
        this.todoActual = {
          algo: null
        };;
        this.todos.push(data.json());
      });
      this.todoActual.algo = '';
  }
  updateTodo(todoId:string, todo:string, newStatus:boolean){
    this.tareasService.updateTodo(todoId,todo,newStatus).subscribe(
      data => {
        this.getAllTodos();
      });
  }
  deleteTodo(todoId : string){

    this.tareasService.deleteTodo(todoId).subscribe(
     data => {
        this.getAllTodos();
      });
  }

}
