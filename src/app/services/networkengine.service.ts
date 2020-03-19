import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NetworkengineService {

  // url = 'https://api.kinetik.cl/zspwa';   /* servidor linode cliente*/
  // puerto = '443';                         /* puerto: ZSMOTOR */

  url = 'https://zsmotorapps.cl/appventas'; /* zsventas en puerto 3020   https://zsmotorapps.cl/appventas */

  constructor( private http: HttpClient ) {
    console.log('<<< NetworkengineProvider >>>');
  }

  soloEnviarCorreo( pCarro, cTo, cCc, cTextoObs, soloCotizar? )  {
    console.log('soloEnviarCorreo()->', pCarro);
    const accion = '/soloEnviarCorreo';
    const url    = this.url  + accion;
    const body   = { carro: pCarro, cTo, cCc, cObs: cTextoObs, cotizar: soloCotizar };
    return this.http.post( url, body );
  }

  traeUnSP( cSP: string, parametros?: any, pUser?: any ) {
    const accion = '/proalma';
    const url    = this.url + accion;
    const body   = { sp: cSP, datos: parametros, user: pUser, versionNueva: true };
    // console.log(url, body);
    return this.http.post( url, body );
  }

  consultaEstandar( cSP: string, parametros?: any, pUser?: any ) {
    const accion = '/' + cSP;
    const url    = this.url + accion;
    const body   = { datos: parametros, user: pUser, versionNueva: true };
    return this.http.post( url, body );
  }

  rescataSeteoCliente() {
    const accion = '/seteocliente';
    const url    = this.url  + accion;
    const body   = { x: 'ktp_configuracion' };
    return this.http.post( url, body );
  }

  grabarDocumentos( pCarro, pModalidad, cTipodoc, cTextoObs, cTextoOcc )  {
    // console.log('grabadocumentos()->', pCarro);
    const accion = '/grabadocumentos';
    const url    = this.url  + accion;
    const body   = { carro: pCarro, modalidad: pModalidad, tipodoc: cTipodoc, cObs: cTextoObs, cOcc: cTextoOcc };
    return this.http.post( url, body );
  }

}
