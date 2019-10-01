import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';


@Injectable({
  providedIn: 'root'
})
export class NetworkengineService {

  url = 'https://api.kinetik.cl/zspwa';   /* servidor linode cliente*/
  puerto = '443';                         /* puerto: ZSMOTOR */

  constructor( private http: HttpClient ) {
    console.log('<<< NetworkengineProvider >>>');
  }

  soloEnviarCorreo( pCarro, cTo, cCc, cTextoObs )  {
    console.log('soloEnviarCorreo()->', pCarro);
    const accion = '/soloEnviarCorreo';
    const url    = this.url  + accion;
    const body   = { carro: pCarro, cTo, cCc, cObs: cTextoObs };
    return this.http.post( url, body );
  }

  sendMail( rutocorreo: string ) {
    const accion = '/sendmail';
    const url    = this.url  + accion;
    const body   = { rutocorreo };
    return this.http.post( url, body );
  }

  traeUnSP( cSP: string, parametros?: any, pUser?: any ) {
    const accion = '/proalma';
    const url    = this.url + accion;
    const body   = { sp: cSP, datos: parametros, user: pUser };
    return this.http.post( url, body );
  }

  rescataSeteoCliente() {
    const accion = '/seteocliente';
    const url    = this.url  + accion;
    const body   = { x: 'ktp_configuracion' };
    return this.http.post( url, body );
  }

  grabarDocumentos( pCarro, pModalidad, cTipodoc, cTextoObs, cTextoOcc )  {
    console.log('grabadocumentos()->', pCarro);
    const accion = '/grabadocumentos';
    const url    = this.url  + accion;
    const body   = { carro: pCarro, modalidad: pModalidad, tipodoc: cTipodoc, cObs: cTextoObs, cOcc: cTextoOcc };
    return this.http.post( url, body );
  }

}
