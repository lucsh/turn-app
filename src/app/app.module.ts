import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';

// Para usar cualquier modulo de ngx-bootstrap,
// primero hay que importar el modulo, y luego
// agregarlo al imports de @NgModule.
// http://valor-software.com/ngx-bootstrap/

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { DashboardService } from './dashboard/dashboard.service';

import { routing } from './app.routing';
import { FooterComponent } from './ui/footer.component';
import { NavigationComponent } from './ui/navigation/navigation.component';
import { TopnavbarComponent } from './ui/topnavbar/topnavbar.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    FooterComponent,
    NavigationComponent,
    TopnavbarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BsDropdownModule.forRoot(),
    routing
  ],
  providers: [
    DashboardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
