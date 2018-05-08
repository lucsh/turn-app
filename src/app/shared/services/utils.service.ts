import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { environment } from '../../../environments/environment';

import { AuthService } from '../../authentication/auth.service';

@Injectable()
export class UtilsService {

    private headers = new Headers({ 'Content-Type': 'application/json' });

    constructor(private http: Http, private authService: AuthService) { }

    // TODO: Podemos cambiar esto a que llame a un service del Server, para evitar UTC 
    public getWeekNumber(d) {
        d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
        d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        const weekNo = Math.ceil((((d - <any>yearStart) / 86400000) + 1) / 7);
        return [d.getUTCFullYear(), weekNo];
    };

    // ---------------------------------------------------------------------------
    private handleError(error: any): Promise<any> {
        console.error('Ocurrio un error en servicio de Pacientes: ', error);
        // alert(error.json().error);
        return Promise.reject(error.message || error);
    }

}


