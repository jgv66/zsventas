import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tabsalida',
  templateUrl: './tabsalida.page.html',
  styleUrls: ['./tabsalida.page.scss'],
})
export class TabsalidaPage {

  norecordar = false;

  constructor( private router: Router,
               private storage: Storage ) { }

  salirDelSistema() {
    // no recordar
    if ( this.norecordar ) {
      this.storage.remove( 'ktp_ultimo_config' );
      this.storage.remove( 'ktp_ultimo_usuario' );
      this.storage.remove( 'ktp_ultimo_cliente' );
    }
    //
    this.router.navigate( ['/home' ]);
  }

}
