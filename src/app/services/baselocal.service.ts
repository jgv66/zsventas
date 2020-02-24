import { Injectable } from '@angular/core';
import { Usuario, Cliente } from '../models/modelos.modelo';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class BaselocalService {

  user: Usuario;
  cliente: Cliente;
  listaComunas = []; /* si se pide una vez no se vuelve a buscar */
  config: any;
  empresa: number;

  constructor( private storage: Storage) {
    console.log('<<< BaseLocalProvider >>>');
  }

  initUsuario() {
    return {  KOFU: '',
              NOKOFU: '',
              RTFU: '',
              MODALIDAD: null,
              EMAIL: null,
              BODEGA: null,
              LISTAMODALIDAD: null,
              LISTACLIENTE: null,
              SUCURSAL: null,
              EMPRESA: null,
              usuario: '',
              nombre: '',
              modalidad: '',
              KOSU: '',
              sucursal: '',
              bodega: '',
              listamodalidad: '',
              nombrelista: '',
              empresa: '',
              razonsocial: '',
              NOKOBO: '',
              nombresuc: '',
              nombrebod: '',
              krpt: false,
              esuncliente: true,
              puedecrearcli: false,
              puedemodifdscto: false,
              kconcecionario: false,
              puedemoddesc: false,
              puedeverprov: false,
              puedevercosto: false,
              puedecrearnvi: false };
  }

  initCliente() {
    this.cliente = {codigo: '',
                    sucursal: '',
                    razonsocial: '',
                    direccion: '',
                    ciudad: '',
                    comuna: '',
                    vendedor: '',
                    nombrevendedor: '',
                    listaprecios: '',
                    nombrelista: '',
                    email: '',
                    LISTACLIENTE: ''};
    return this.cliente;
  }

  initConfig() {
    return { soloconstock:          false,
             usarlistacli:          false,
             ordenar:               '',
             imagenes:              false,
             ocultardscto:          false,
             puedevercosto:         false,
             puedemoddscto:         false,
             adq_imagenes:          true,
             adq_gps:               false,
             adq_enviarcorreolocal: false,
             adq_nvv_transitoria:   true,
             adq_ver_importaciones: false };
  }

  initTareaEncaDeta() {
    return [{ id_registro: 0,
              empresa: 0,
              codigousr: '',
              fechareg: null,
              obs: '',
              codigorol: '',
              roldescrip: '',
              id_detalle: 0,
              codigolabor: '',
              labdescrip: '',
              sino: false,
              fecha: null,
              cantidad: 0,
              obs_deta: '',
              textosino: '',
              textocantidad: '',
              textofecha: '',
              textoobs: '' }];
  }

  initMensajes() {
    return [{ from: '',
              emailfrom: '',
              to: '',
              emailto: '',
              descripcion: '',
              fecha: null,
              oculto: false,
              eliminado: false,
              leido: false,
              respondido: false,
              fecharesp: null }];
  }

  guardaUltimoUsuario( data ) {
    // console.log('guardaUltimoUsuario()', data );
    if ( data.LISTACLIENTE === undefined ) {
      data.LISTACLIENTE = '';
    }
    this.user = data;
    this.storage.set( 'ktp_ultimo_usuario',  this.user );
  }
  obtenUltimoUsuario() {
    return this.storage.get('ktp_ultimo_usuario')
      .then( pUsuario => {
          // console.log('obtenUltimoUsuario()',pUsuario);
          this.user = pUsuario == null ? this.initUsuario() : pUsuario;
          if ( this.user.LISTACLIENTE === undefined ) {
            this.user.LISTACLIENTE = '';
          }
          return this.user;
      });
  }

  guardaUltimoConfig( data ) {
    // console.log('guardaUltimoConfig()', data );
    this.config = data;
    this.storage.set( 'ktp_ultimo_config',  this.config );
  }
  obtenUltimoConfig() {
    return this.storage.get('ktp_ultimo_config')
      .then( pConfig => {
        if ( pConfig !== null && pConfig !== undefined ) {
          this.config = pConfig;
        } else {
          this.config = this.initConfig();
        }
        return this.config;
    });
  }

  actualizarConfig( pConfigp ) {
    // console.log( 'actualizarConfig()', pConfigp );
    // console.log(this.config);
    if ( this.config ) {
      this.config.adq_imagenes            = pConfigp.adq_imagenes;
      this.config.adq_gps                 = pConfigp.adq_gps;
      this.config.adq_enviarcorreolocal   = pConfigp.adq_correo;
      this.config.adq_nvv_transitoria     = pConfigp.adq_nvv_transitoria;
      this.config.adq_ver_importaciones   = pConfigp.adq_ver_importaciones;
      //
      this.guardaUltimoConfig( this.config );
    }
    //
  }

}
