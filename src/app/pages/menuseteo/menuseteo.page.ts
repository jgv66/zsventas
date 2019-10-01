import { Component, OnInit } from '@angular/core';
import { Cliente } from '../../models/modelos.modelo';
import { ActivatedRoute, Router } from '@angular/router';
import { BaselocalService } from '../../services/baselocal.service';
import { FuncionesService } from '../../services/funciones.service';

@Component({
  selector: 'app-menuseteo',
  templateUrl: './menuseteo.page.html',
  styleUrls: ['./menuseteo.page.scss'],
})
export class MenuseteoPage implements OnInit {

  cliente: Cliente;
  barraTabs;  // variable para ocultar barra de tabs
  usuario;
  config;

  constructor( private router: Router,
               private funciones: FuncionesService,
               private baseLocal: BaselocalService ) {
      this.usuario = this.baseLocal.user;
      if ( !this.cliente ) {
        this.cliente = this.funciones.initCliente();
      }
      if ( !this.config  ) {
        this.config  = this.baseLocal.initConfig();
      }
      //
  }

  ngOnInit() {}

  ionViewDidLoad() {
  }
  ionViewWillEnter() {
    this.funciones.obtenUltimoCliente().then( data => this.cliente = data ) ;
    this.baseLocal.obtenUltimoConfig().then(  data => this.config = data  ) ;
    this.barraTabs  = this.funciones.hideTabs();
    // console.log(this.usuario);
  }
  ionViewWillLeave() {
    // console.log(this.usuario);
    this.baseLocal.guardaUltimoConfig( this.config );
    this.funciones.showTabs( this.barraTabs );
  }

  salir() {
    this.router.navigate(['/tabs']);
  }

  buscarOtroCliente() {
    // this.navCtrl.push( BuscarClientesPage, { callback: this.retornaDataCliente, usuario: this.usuario });
  }

  retornaDataCliente = ( data ) => {
    return new Promise( (resolve, reject) => {
          this.cliente = data;
          // console.log(data);
          this.funciones.guardaUltimoCliente( data );
          if ( data.listaprecios !== this.usuario.LISTAMODALIDAD ) {
            this.usuario.LISTACLIENTE = data.listaprecios;
          }
          resolve();
       });
  }

  consultarImpagos( cliente ) {
      // console.log('consultarImpagos()',cliente,this.usuario);
      if ( cliente === null || cliente === undefined || cliente.codigo === '' ) {
        this.funciones.muestraySale('ATENCION : Código de cliente no puede estar vacío', 2);
      } else {
        // this.navCtrl.push( TabmensajePage, { cliente: cliente, usuario: this.usuario } );
      }
  }

}
