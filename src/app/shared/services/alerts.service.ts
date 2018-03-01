import { Injectable } from '@angular/core';

import { default as swal } from 'sweetalert2';
declare var $: any;

@Injectable()
export class AlertService {

    constructor() { }

    success(titulo: string, mensaje: string, timer?: number, funcionExito?, funcionDismiss?) {
        if (timer) {

            swal({
                title: titulo,
                text: mensaje,
                type: 'success',
                timer: timer
            }).then(
                function () { },
                // handling the promise rejection
                function (dismiss) {
                    if (dismiss === 'timer') {

                    }
                }
                );
        } else {

            swal({
                title: titulo,
                text: mensaje,
                type: 'success'
            }).then(
                function () { },
                // handling the promise rejection
                function (dismiss) {
                }
                );
        }

    }

    warningCallbacks(titulo, textoConfirmar, showCancel, funcionExito?, funcionError?) {

        swal({
            title: titulo,
            type: 'warning',
            showCancelButton: showCancel,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: textoConfirmar,
            cancelButtonText: 'Cancelar',
        }).then(function () {
    
            if (funcionExito) {
                funcionExito();
            }

        }).catch(err => {
            if (funcionError) {
                funcionError(err);
            } else {
                console.error(err)
            }
        }).catch(swal.noop);

    }
    warning(titulo, textoConfirmar, showCancel, mensaje?) {
        return new Promise( (resolve, reject) => {
            if (!mensaje) {
                swal({
                    title: titulo,
                    type: 'warning',
                    showCancelButton: showCancel,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: textoConfirmar,
                    cancelButtonText: 'Cancelar',
                })
                .then(() => {
                    resolve();
                })
                .catch(err => {
                    reject(err);
                });
            } else {
                swal({
                    title: titulo,
                    text: mensaje,
                    type: 'warning',
                    showCancelButton: showCancel,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: textoConfirmar,
                    cancelButtonText: 'Cancelar',
                })
                .then(() => {
                    resolve();
                })
                .catch(err => {
                    reject(err);
                });
            }
          

        });

    }

    input(titulo: string, placeholder: string, showCancel ) {
        
        return new Promise((resolve, reject) => {
            swal({
                title: titulo,
                input: 'text',
                inputPlaceholder: placeholder,
                showCancelButton: showCancel,
                inputValidator: function (value) {
    
                    return new Promise<void>(function (resolve, reject) {
                    if (value) {
                        resolve();
                    } else {
                        reject('No puede estar vacía!');
                    }
                    });
                }
            })
            .then(function(valorIngresado) {
                console.log('Valor ingresado: ', valorIngresado);
                resolve(valorIngresado);
            })
            .catch(err => {
                reject(err);
            });
        });

       
    }

    error(titulo:string, mensaje: string) {
        swal(
            titulo,
            mensaje,
            'error'
          );
    }

    private handleError(error: any): Promise<any> {
        console.error('Ocurrio un error en servicio de alerts: ', error);
        return Promise.reject(error.message || error);
    }
}
