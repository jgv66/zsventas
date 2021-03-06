import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Cliente } from '../../models/modelos.modelo';
import { BaselocalService } from '../../services/baselocal.service';
import { FuncionesService } from '../../services/funciones.service';
import { MovdoccliComponent } from '../../components/movdoccli/movdoccli.component';
import { PopoverController, ModalController, AlertController, IonCardContent } from '@ionic/angular';
import { BuscarclientesPage } from '../buscarclientes/buscarclientes.page';
import { NetworkengineService } from '../../services/networkengine.service';
import { ModifclientesPage } from '../modifclientes/modifclientes.page';
import { TrespuntosComponent } from '../../components/trespuntos/trespuntos.component';
import { PatentesPage } from '../patentes/patentes.page';

@Component({
  selector: 'app-menuseteo',
  templateUrl: './menuseteo.page.html',
  styleUrls: ['./menuseteo.page.scss'],
})
export class MenuseteoPage {

  cliente: Cliente;
  barraTabs;  // variable para ocultar barra de tabs
  usuario;
  config;
  buscando = false;

  // collapsed = true;
  collapsedFiltro = true;
  collapsedConfig = true;
  collapsedOrden  = true;

  @ViewChild( 'filtros', {static: false} ) filt: IonCardContent;
  @ViewChild( 'config',  {static: false} ) conf: IonCardContent;
  @ViewChild( 'orden',   {static: false} ) orde: IonCardContent;

  constructor( public baseLocal: BaselocalService,
               private router: Router,
               private modalCtrl: ModalController,
               private popoverCtrl: PopoverController,
               private alertCtrl: AlertController,
               private funciones: FuncionesService,
               private netWork: NetworkengineService ) {
      //
      this.usuario = this.baseLocal.user;
      this.cliente = this.baseLocal.cliente;
      this.config  = this.baseLocal.config;
      //
  }

  ionViewWillEnter() {
    this.barraTabs = this.funciones.hideTabs();
  }
  ionViewWillLeave() {
    this.baseLocal.guardaUltimoConfig( this.config );
    this.funciones.showTabs( this.barraTabs );
  }

  salir() {
    this.router.navigate(['/tabs']);
  }

  async buscarOtroCliente() {
    const modal = await this.modalCtrl.create({
      component: BuscarclientesPage,
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if ( data ) {
      this.cliente = data.dato;
      this.baseLocal.cliente = data.dato;
      //
      if ( data.listaprecios !== this.usuario.LISTAMODALIDAD ) {
        this.usuario.LISTACLIENTE = data.listaprecios;
        this.baseLocal.user       = this.usuario;
      }
    }
  }

  crearClientes() {
    if ( !this.baseLocal.user.puedecrearcli ) {
      this.funciones.msgAlert('ATENCION', 'Ud. no posee permisos para esta acción');
    } else {
      this.router.navigate(['/tabs/crearclientes']);
    }
  }

  consultarImpagos( cliente ) {
    if ( cliente === null || cliente === undefined || cliente.codigo === '' ) {
      this.funciones.muestraySale('ATENCION : Código de cliente no puede estar vacío', 1);
    } else {
      this.router.navigate(['/tabs/ctacteclientes']);
    }
  }

  async ultimosDocs( event ) {
    const popover = await this.popoverCtrl.create({
      component: MovdoccliComponent,
      event,
      mode: 'ios',
      translucent: false
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();
    if ( data ) {
      const tido = this.funciones.derecha( data.opcion.texto, 3 ); // === 'Ultimas 15 NVV') ? 'NVV' : 'FCV' );
      this.router.navigate(['/tabs/ultimosdocs/' + tido ]);
    }
  }

  cambiarBodega() {
    this.buscando = true;
    this.netWork.traeUnSP( 'ksp_BodegaMias',
                          { empresa: this.baseLocal.user.EMPRESA },
                          { codigo: this.baseLocal.user.KOFU,
                            nombre: this.baseLocal.user.NOKOFU } )
        .subscribe( bodegas => { this.revisaEoFBM( bodegas ); },
                    err     => { this.buscando = false;
                                 this.funciones.msgAlert( 'ATENCION', err );  }
                  );
  }
  revisaEoFBM( bodegas ) {
    this.buscando = false;
    if ( bodegas === undefined || bodegas.lenght === 0 ) {
      this.funciones.msgAlert('ATENCION', 'Usted no tiene permiso para revisar todas las bodegas. Intente con otros datos.');
    } else {
      this.seleccionarBodega( bodegas );
    }
  }
  async seleccionarBodega( bodegas ) {
    if ( bodegas.length ) {
        //
        const nBodegas = [];
        bodegas.forEach( element => {
          nBodegas.push( { type: 'radio', label: element.bodega + ' - ' + element.nombrebodega.trim(), value: element } );
        });
        //
        const alertBod = await this.alertCtrl.create({
          header: 'Bodegas',
          message: 'Disponibles según sus permisos',
          inputs: nBodegas,
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary',
              handler: (blah) => {}
            },
            {
              text: 'Ok',
              handler: (data) => { this.usuario.BODEGA    = data.bodega;
                                   this.usuario.nombrebod = data.nombrebodega;
                                   this.usuario.KOSU      = data.sucursal;
                                   this.usuario.nombresuc = data.nombresucursal;
                                   this.baseLocal.user   = this.usuario; }
            }
          ]
        });
        await alertBod.present();
        //
    } else {
        this.funciones.msgAlert('ATENCION', 'Producto sin stock o sin asignación a bodegas o sin permiso para revisar todas las bodegas. Intente con otros datos.' );
    }
  }
  cambiarLista() {
    this.buscando = true;
    this.netWork.traeUnSP( 'ksp_ListasMias',
                           { empresa: this.baseLocal.user.EMPRESA },
                           { codigo:  this.baseLocal.user.KOFU,
                             nombre:  this.baseLocal.user.NOKOFU } )
        .subscribe( listas => { this.revisaEoFLP( listas ); },
                    err    => { this.buscando = false;
                                this.funciones.msgAlert( 'ATENCION', err );  }
                  );
  }
  revisaEoFLP( listas ) {
    this.buscando = false;
    if ( listas === undefined || listas.length === 0 ) {
      this.funciones.msgAlert('ATENCION', 'Usted no tiene permiso para revisar todas las listas. Intente con otros datos.');
    } else {
      this.seleccionarLista( listas );
    }
  }
  async seleccionarLista( listas ) {
    if ( listas.length ) {
        //
        const nListas = [];
        listas.forEach( element => {
          nListas.push( { type: 'radio', label: element.listaprecio + '/' + element.tipolista + ' - ' + element.nombrelista.trim(), value: element } );
        });
        //
        const alertLis = await this.alertCtrl.create({
          header: 'Listas de Precio',
          message: 'Disponibles según sus permisos',
          inputs: nListas,
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary',
              handler: (blah) => {}
            },
            {
              text: 'Ok',
              handler: (data) => { this.usuario.LISTAMODALIDAD = data.listaprecio;
                                   this.usuario.listamodalidad = data.listaprecio;
                                   this.usuario.nombrelista    = data.nombrelista;
                                   this.usuario.NOKOLT         = data.nombrelista;
                                   this.usuario.nokolt         = data.nombrelista;
                                   this.baseLocal.user         = this.usuario; }
            }
          ]
        });
        await alertLis.present();
        //
    } else {
        this.funciones.msgAlert('ATENCION', 'Sin permiso para revisar todas las listas de precio. Intente con otros datos.' );
    }
  }

  modifCliente = async () => {
    const modal = await this.modalCtrl.create({
      component: ModifclientesPage,
    });
    await modal.present();
    //
    const { data } = await modal.onDidDismiss();
    if ( data ) {
      this.cliente.email = data.email;
      this.cliente.telefonos = data.nrocelu;
      //
      this.baseLocal.cliente.email = data.email;
      this.baseLocal.cliente.telefonos = data.nrocelu;
    }
  }

  crearPatente = async () => {
    const modal = await this.modalCtrl.create({
      component: PatentesPage,
    });
    await modal.present();
    //
    const { data } = await modal.onDidDismiss();
    if ( data ) {
      this.cliente.email = data.email;
      this.cliente.telefonos = data.nrocelu;
      //
      this.baseLocal.cliente.email = data.email;
      this.baseLocal.cliente.telefonos = data.nrocelu;
    }
  }

  async opcionPuntos( event ) {
    //
    if ( this.baseLocal.cliente.codigo !== '') {
      const popover = await this.popoverCtrl.create({
        component: TrespuntosComponent,
        componentProps: { escliente: true },
        event,
        mode: 'ios',
        translucent: false
      });
      await popover.present();
      //
      const { data } = await popover.onDidDismiss();
      if ( data ) {
        switch (data.opcion.texto) {
          //
          case 'Actualizar datos':
            this.modifCliente();
            break;
          //
          case 'Agregar Patente':
            this.crearPatente();
            break;
          //
          default:
            console.log('vacio');
            break;
        }
      }
    }
  }

  toggleAccordion( caso ) {
    if ( caso === 1 ) {
      this.collapsedFiltro = ! this.collapsedFiltro;
    } else if ( caso === 2 ) {
      this.collapsedConfig = ! this.collapsedConfig;
    } else if ( caso === 3 ) {
      this.collapsedOrden = ! this.collapsedOrden;
    }
  }

}
