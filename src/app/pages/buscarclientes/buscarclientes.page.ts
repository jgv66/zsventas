import { Component } from '@angular/core';
import { NetworkengineService } from '../../services/networkengine.service';
import { FuncionesService } from '../../services/funciones.service';
import { BaselocalService } from '../../services/baselocal.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-buscarclientes',
  templateUrl: './buscarclientes.page.html',
  styleUrls: ['./buscarclientes.page.scss'],
})
export class BuscarclientesPage {

  clientes: any[] = [];
  buscando = false;
  usuario;

  constructor( private baseLocal: BaselocalService,
               private netWork: NetworkengineService,
               private funciones: FuncionesService,
               private modalCtrl: ModalController ) { }

  buscarClientes( event ) {
    if ( event.detail.value !== '' ) {
      this.aBuscarClientes( event.detail.value );
    } else {
      this.clientes = [];
    }
  }

  aBuscarClientes( pDato ) {
    if ( pDato === undefined || pDato === '' ) {
      this.funciones.msgAlert('VACIO', 'Debe indicar algún dato para buscar clientes.');
    } else {
      this.buscando = true;
      this.netWork.traeUnSP( 'ksp_buscarDeNuevoClientes',
                            { dato:    pDato,
                              codusr:  this.baseLocal.user.KOFU,
                              empresa: this.baseLocal.user.EMPRESA } )
          .subscribe( data => { this.buscando = false; this.revisaRespuesta( data ); },
                      err  => { this.buscando = false; this.funciones.msgAlert( 'ATENCION', err );  }
                    );
    }
  }

   revisaRespuesta( data ) {
    this.clientes = [];
    if ( data === undefined || data.length === 0 ) {
        this.funciones.msgAlert('ATENCION', 'Su búsqueda no tiene resultados. Intente con otros datos.');
    } else  {
      this.clientes.push( ...data );
    }
  }

  salir() {
    this.modalCtrl.dismiss();
  }

  salirConData( cliente ) {
    this.modalCtrl.dismiss( {
      dato: cliente
    } );
  }

}
