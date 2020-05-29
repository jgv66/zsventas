import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FuncionesService } from '../../services/funciones.service';
import { BaselocalService } from '../../services/baselocal.service';
import { NetworkengineService } from '../../services/networkengine.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-sugerencias',
  templateUrl: './sugerencias.page.html',
  styleUrls: ['./sugerencias.page.scss'],
})
export class SugerenciasPage implements OnInit {

  enviando = false;
  sistema: any;
  prodbueno = false;
  prodregular = false;
  prodmalo = false;
  preciomuybarato = false;
  preciocorrecto = false;
  preciomuycaro = false;
  prodconstock = false;
  prodstockirreg = false;
  prodconquiebre = false;
  observaciones = '';

  constructor( private funciones: FuncionesService,
               public baseLocal: BaselocalService,
               private netWork: NetworkengineService,
               private alertCtrl: AlertController,
               private router: Router,
               private parametros: ActivatedRoute) {
      this.sistema = JSON.parse( this.parametros.snapshot.paramMap.get('dataP') );
  }

  ngOnInit() {
    if ( !this.baseLocal.user ) {
      this.router.navigateByUrl('/login');
    }
  }

  limpiar() {
    this.prodbueno        = false;
    this.prodregular      = false;
    this.prodmalo         = false;
    this.preciomuybarato  = false;
    this.preciocorrecto   = false;
    this.preciomuycaro    = false;
    this.prodconstock     = false;
    this.prodstockirreg   = false;
    this.prodconquiebre   = false;
    this.observaciones    = '';
  }

  async enviar() {
    const alert = await this.alertCtrl.create({
      // header: 'ATENCION',
      subHeader: 'Confirme Envío',
      message: 'Este mensaje será enviado a Casa Matriz con las sugerencias y observaciones para el producto : ' + this.sistema.codigo,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {}
        },
        {
          text: 'Ok, enviar',
          handler: () => { this.enviarSugerencia(); }
        }
      ]
    });
    await alert.present();
  }
  enviarSugerencia() {
    this.enviando = true;
    this.netWork.consultaEstandar(  'ksp_enviarSugerencias',
                                    { sucursal:        this.baseLocal.user.KOSU,
                                      usuario:         this.baseLocal.user.KOFU,
                                      observac:        this.observaciones,
                                      codprod:         this.sistema.codigo,
                                      cantidad:        0,
                                      prodbueno:       this.prodbueno,
                                      prodregular:     this.prodregular,
                                      prodmalo:        this.prodmalo,
                                      preciomuybarato: this.preciomuybarato,
                                      preciocorrecto:  this.preciocorrecto,
                                      preciomuycaro:   this.preciomuycaro,
                                      prodconstock:    this.prodconstock,
                                      prodstockirreg:  this.prodstockirreg,
                                      prodconquiebre:  this.prodconquiebre },
                                    { codigo: this.baseLocal.user.KOFU,
                                      nombre: this.baseLocal.user.NOKOFU } )
        .subscribe( data => { this.revisa( data );           },
                    err  => { this.funciones.msgAlert( '', err ); });
  }
  revisa( data ) {
    this.enviando = false;
    if ( data === undefined ) {
      this.funciones.muestraySale(' : Sugerencia presenta problemas al intentar grabación', 2 );
    } else {
      if ( data[0].resultado === 'ok' ) {
        this.limpiar();
      }
      this.funciones.msgAlert( '', data[0].mensaje );
    }
  }

}
