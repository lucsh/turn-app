import { Component } from '@angular/core';
import { FooterComponent } from './ui/footer.component';
import { detectBody } from './app.helpers';

declare var jQuery:any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public ngOnInit():any {
    detectBody();
  }

  public onResize(){
    detectBody();
  }
}