import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { AlertController, IonInfiniteScroll, PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';

import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';

import { FuncionesService } from 'src/app/services/funciones.service';
import { BaselocalService } from '../../services/baselocal.service';
import { NetworkengineService } from '../../services/networkengine.service';
import { TrespuntosComponent } from '../../components/trespuntos/trespuntos.component';

@Component({
  selector: 'app-tabinicio',
  templateUrl: './tabinicio.page.html',
  styleUrls: ['./tabinicio.page.scss'],
})
export class TabinicioPage implements OnInit {
  //
  @ViewChild( IonContent, {static: true} ) content: IonContent;
  //
  headerHeight    = 150;
  newheaderHeight: any;
  //
  lScrollInfinito = false;
  offset          = 0;
  scrollSize      = 20;
  codproducto     ;
  descripcion     ;
  usuario         ;
  cliente         ;
  Carro           = [];
  config: any;
  Importados      = [];
  nombreEmpresa   = '';
  firstcall       = false;
  tipoTarjeta     = true;
  codSuperFam     = '';
  filtroFamilias  = false;
  codFamilias     = '';
  // get's
  listaProductos  = [];
  pProd           = '';
  pDesc           = '';
  pFami           = '';
  buscando        = false;
  // familias zsmotor   jgv 01-05-2018
  listaFamilias: any = [ { cod: 'NEUM', descrip: 'Neumáticos'            },
                         { cod: 'LLAN', descrip: 'Llantas'               },
                         { cod: 'AEXT', descrip: 'Accesorios exterior'   },
                         { cod: 'AINT', descrip: 'Accesorios interior'   },
                         { cod: 'ACCL', descrip: 'Accesorios llantas'    },
                         { cod: 'DET ', descrip: 'Detailing'             },
                         { cod: 'ILUM', descrip: 'Iluminación'           },
                         { cod: '4X4 ', descrip: 'Off Road'              },
                         { cod: 'SEGU', descrip: 'Protección y seguridad'},
                         { cod: 'THUL', descrip: 'Thule'                 },
                         { cod: 'TUNI', descrip: 'Tunning'               } ];

  constructor( private netWork: NetworkengineService,
               public baseLocal: BaselocalService,
               public  funciones: FuncionesService,
               private alertCtrl: AlertController,
               private router: Router,
               private popoverCtrl: PopoverController,
               private barcode: BarcodeScanner ) {
    this.filtroFamilias = false;
    this.codproducto   = '';
    this.descripcion   = '';
    this.codSuperFam   = '';
    this.usuario       = this.baseLocal.user;
    this.inicializa();
    this.cliente       = this.baseLocal.initCliente();
    this.firstcall     = true;
  }

  ngOnInit() {
    if ( !this.baseLocal.user ) {
      this.router.navigateByUrl('/login');
    }
    this.usuario = this.baseLocal.user;
    this.cliente = this.baseLocal.initCliente();
    this.config  = this.baseLocal.initConfig();
    this.funciones.initCarro();
  }
  ionViewDidLoad() {
    // console.log('ionViewDidLoad 22222222');
  }
  ionViewDidEnter() {
    // console.log('ionViewDidEnter 33333');
    // console.log(this.cliente);
    // console.log(this.baseLocal.cliente);
  }
  ionViewWillEnter() {
    // console.log('ionViewWillEnter 11111');
    this.cliente = this.baseLocal.cliente;
    this.config  = this.baseLocal.config;
  }
  ionViewWillLeave() {
    // console.log('ionViewWillLeave 444444');
  }

  inicializa() {
    this.cliente = this.baseLocal.initCliente();
    this.baseLocal.obtenUltimoConfig()
        .then( data => this.config = data );
    this.config = this.baseLocal.config;
  }

  // verImagen() {
  //   this.config.imagenes = !this.config.imagenes;
  // }

  // movimientos arriba y abajo
  // logScrollStart()    { console.log( 'logScrollStart : When Scroll Starts'); this.ScrollToTop();    }
  // logScrolling()      { console.log('logScrolling : When Scrolling');       }
  // logScrollEnd()      { console.log('logScrollEnd : When Scroll Ends');      this.ScrollToBottom(); }
  // ScrollToBottom()    { this.content.scrollToBottom(1500);    }
  // ScrollToPoint(X,Y)  { this.content.scrollToPoint(X,Y,1500); }
  ScrollToTop()       { this.content.scrollToTop(1500);       }

  loadDefaultImg( event ) {
    event.target.src = 'assets/imgs/no-img.png';
  }

  aBuscarProductos( pProducto?, pDescripcion?, pCodFamilias?, xdesde?, infiniteScroll? ) {
    if ( pProducto === '' && pDescripcion === '' && pCodFamilias === '' ) {
      this.funciones.msgAlert('DATOS VACIOS', 'Debe indicar algún dato para buscar...');
    } else {
      //
      if ( xdesde === 1 ) {
        this.buscando = true;
        this.offset          = 0 ;
        this.listaProductos  = [];
        this.pProd           = pProducto ;
        this.pDesc           = pDescripcion ;
        this.pFami           = pCodFamilias ;
        this.lScrollInfinito = true;
      } else {
        this.offset += this.scrollSize ;
        pProducto    = this.pProd ;
        pDescripcion = this.pDesc ;
        pCodFamilias = this.pFami ;
      }
      //
      if ( pCodFamilias === this.listaProductos ) {
        pCodFamilias = '';
      }
      // console.log(this.usuario);
      this.netWork.traeUnSP( 'ksp_buscarProductos_v8',
                            {  codproducto:   pProducto,
                               descripcion:   pDescripcion,
                               bodega:        this.baseLocal.user.BODEGA,
                               offset:        this.offset.toString(),
                               listaprecio:   (( this.baseLocal.user.LISTACLIENTE && this.baseLocal.user.LISTACLIENTE !== this.baseLocal.user.LISTAMODALIDAD ))
                                              ? this.baseLocal.user.LISTACLIENTE
                                              : this.baseLocal.user.LISTAMODALIDAD,
                               soloconstock:  ( this.baseLocal.config.soloconstock ? true : false ),
                               ordenar:       ( this.baseLocal.config.ordenar ? this.baseLocal.config.ordenar : '' ) ,
                               familias:      pCodFamilias,
                               soloverimport: ( this.baseLocal.config.soloverimport ? this.baseLocal.config.soloverimport : false ),
                               empresa:       this.baseLocal.user.EMPRESA,
                               usuario:       this.baseLocal.user.KOFU })
          .subscribe( data => { this.buscando = false;
                                this.revisaExitooFracaso( data, xdesde, infiniteScroll );
                              },
                      err  => { this.buscando = false;
                                this.funciones.msgAlert( 'ATENCION', err );
                              }
                    );
    }
  }
  revisaExitooFracaso( data, xdesde, infiniteScroll ) {
    // console.log(data);
    if ( data === undefined || data.length === 0 ) {
      this.funciones.msgAlert('ATENCION', 'Su búsqueda no tiene resultados. Intente con otros datos.');
    } else if ( data.length > 0 ) {
      //
      // this.listaProductos = ( this.offset === 0 ) ? rs : this.listaProductos.concat(rs);
      this.listaProductos.push( ...data  );
      //
      if ( infiniteScroll ) {
        infiniteScroll.target.complete();
      }
      //
      if ( data.length < this.scrollSize ) {
        this.lScrollInfinito = false ;
      } else if ( xdesde === 1 ) {
        this.lScrollInfinito = true ;
      }
    }
  }
  masDatos( infiniteScroll: any ) {
    this.aBuscarProductos( this.pProd, this.pDesc, this.pFami, 0, infiniteScroll );
  }

  CeroBlanco( valor ) {
    if ( valor === 0 ) {
        return '';
    } else {
        return '      (' + valor.toLocaleString('es-ES') + '%)';
    }
  }

  cargaListas( producto ) {
    this.funciones.cargaEspera();
    this.netWork.traeUnSP( 'ksp_ListasProducto',
                           { codproducto: producto.codigo, usuario: this.usuario, empresa: '01' },
                           {codigo: this.usuario.KOFU, nombre: this.usuario.NOKOFU } )
        .subscribe( data => { this.funciones.descargaEspera(); this.revisaEoFLP( producto, data ); },
                    err  => { this.funciones.descargaEspera(); this.funciones.msgAlert( 'ATENCION' , err );  }
                  );
  }
  revisaEoFLP( producto, data ) {
    const rs    = data;
    const largo = data.length;
    if ( rs === undefined || largo === 0 ) {
      this.funciones.msgAlert('ATENCION',
                              'Producto sin asignacion a listas de precio o usted no tiene permiso para revisar todas las listas.' +
                              ' Intente con otros datos.');
    } else if ( largo > 0 ) {
      this.seleccionarLista( producto, rs );
    }
  }
  async seleccionarLista( producto, listas ) {
    if ( listas.length ) {
      //
      const listasConst = [];
      listas.forEach( element => {
        listasConst.push( { name: element.listaprecio,
                            type: 'radio',
                            label: '(' + element.metodolista + '/' + element.listaprecio + ') -> ' +
                                    element.monedalista.trim() + '   ' +
                                    element.precio1.toLocaleString('es-ES') + this.CeroBlanco(element.descuentomax1),
                            value: element });
      });
      //
      const alert = await this.alertCtrl.create({
            header: 'Precios para : ' + producto.codigo,
            inputs: listasConst,
            buttons: [ {  text: 'Cancelar',
                          role: 'cancel',
                          cssClass: 'secondary',
                          handler: () => {}
                        },
                        { text: 'Ok',
                          handler: data => { this.cambiaListaProductos( data, producto, 2 ); }
                        }
                      ]} );
      await alert.present();
      //
    } else {
        this.funciones.msgAlert('ATENCION',
                                'Producto sin stock o sin asignación a listas o sin permiso para revisar todas las listas.' +
                                ' Intente con otros datos.' );
    }
  }
  cargaBodegas( producto ) {
    this.funciones.cargaEspera();
    this.netWork.traeUnSP( 'ksp_BodegaProducto',
                          { codproducto: producto.codigo, usuario: this.usuario, empresa: '01' },
                          {codigo: this.usuario.KOFU, nombre: this.usuario.NOKOFU } )
        .subscribe( data => { this.funciones.descargaEspera(); this.revisaEoFBP( producto, data ); },
                    err  => { this.funciones.descargaEspera(); this.funciones.msgAlert( 'ATENCION', err );  }
                  );
  }
  revisaEoFBP( producto, data ) {
    if ( data === undefined || data.length === 0 ) {
      this.funciones.msgAlert('ATENCION',
                              'Producto sin stock, sin asignación a bodegas o usted no tiene permiso para revisar todas las bodegas.');
    } else if ( data.length > 0 ) {
      this.seleccionarBodega( producto, data );
    }
  }
  async seleccionarBodega( producto, bodegas ) {
    if ( bodegas.length ) {
        const bodconst = [];
        //
        bodegas.forEach( element => {
          bodconst.push( { name: element.bodega,
                           type: 'radio',
                           label: 'Stock: ' + element.stock_ud1.toString() + ' [ ' + element.nombrebodega.trim() + ' ]' ,
                           value: element });
        });
        //
        const alert = await this.alertCtrl.create({
          header: 'Bodegas con stock para : ' + producto.codigo,
          inputs: bodconst,
          buttons: [ {  text: 'Cancelar',
                        role: 'cancel',
                        cssClass: 'secondary',
                        handler: () => { console.log('Confirm Cancel'); }
                      },
                      { text: 'Ok',
                        handler: data => { this.cambiaListaProductos( data, producto, 1 ); }
                      }
                    ]} );

        await alert.present();
    } else {
        this.funciones.msgAlert('ATENCION',
                                'Producto sin stock o sin asignación a bodegas o sin permiso para revisar todas las bodegas.' );
    }
  }
  cambiaListaProductos( data, producto, caso ) {
    let i = 0;
    /* deberia mejorarla con un filter... */
    if ( caso === 1 ) {
      this.listaProductos.forEach( element => {
        if ( this.listaProductos[i].codigo === producto.codigo ) {
            producto.stock_ud1    = data.stock_ud1;
            producto.bodega       = data.bodega;
            producto.sucursal     = data.sucursal;
            producto.nombrebodega = data.nombrebodega;
            producto.apedir       = 1;
        }
        ++i;
      });
    } else if ( caso === 2 ) {
      this.listaProductos.forEach( element => {
        if ( this.listaProductos[i].codigo === producto.codigo ) {
            producto.precio       = data.precio1;
            producto.preciomayor  = data.preciomayor1;
            producto.montolinea   = data.montolinea1;
            producto.descuentomax = data.descuentomax1;
            producto.dsctovalor   = data.dsctovalor1;
            producto.tipolista    = data.tipolista;
            producto.metodolista  = data.metodolista;
            producto.listaprecio  = data.listaprecio;
          }
        ++i;
      });
    }
  }

  agregarAlCarro( producto ) {
    this.funciones.pideCantidad( producto );
  }

  ConfiguracionLocal() {
    this.router.navigate(['/tabs/menuseteo']);
  }
  masOpciones() {
    // console.log('masOpciones()', this.filtroFamilias);
    this.filtroFamilias = !this.filtroFamilias ;
    if ( !this.filtroFamilias ) {
      this.codFamilias = '';
    }
  }

  async limpiarCliente() {
    const confirm = await this.alertCtrl.create({
      header: 'Limpiar datos',
      message: 'Iniciará búsquedas sin mencionar a cliente y no podrá agregar al carro sin este dato.' +
               ' Desea limpiar los datos del cliente activo?',
      buttons: [
                  { text: 'No, gracias', handler: () => {} },
                  { text: 'Sí, limpiar', handler: () => { this.cliente = this.baseLocal.initCliente();
                                                          this.baseLocal.user.LISTACLIENTE = '';
                                                          this.baseLocal.cliente = this.cliente;
                                                          this.funciones.guardaUltimoCliente( this.cliente ); } }
               ]
    });
    await confirm.present();
  }

  largoListaProductos() {
    return this.listaProductos.length;
  }
  scrollToTop() {
    // this.content.scrollToTop();
  }

  async cambiaDescuento( producto ) {
    if ( !this.usuario.puedemodifdscto ) {
      this.funciones.muestraySale('Ud. no posee permiso para hacer esta modificación.', 2 );
    } else {
      const dmax   = producto.descuentomax;
      const prompt = await this.alertCtrl.create({
        header:  'Descto. Máximo : ' + producto.descuentomax.toString() + '%',
        message: 'Ingrese el nuevo descuento máximo a utilizar.',
        inputs:  [ { name: 'dmax', placeholder: dmax } ],
        buttons: [
          { text: 'Salir',     handler: () => {} },
          { text: 'Cambiar !', handler: data => {
            if ( data.dmax < 0 || data.dmax > 100 ) {
              this.funciones.msgAlert('ATENCION', 'Descuento digitado está incorrecto. Intente con otro valor.');
            } else {
              producto.descuentomax = data.dmax;
              producto.preciomayor  = Math.round((producto.precio - ( producto.precio * data.dmax / 100)));
              producto.dsctovalor   = producto.precio - producto.preciomayor;
            }
          } }
        ]
      });
      await prompt.present();
    }
  }
  cargaDatoImportado( codigoprod ) {
    this.funciones.cargaEspera();
    this.netWork.traeUnSP( 'ksp_EnImportaciones',
                           { codproducto: codigoprod,
                             usuario: this.baseLocal.user.KOFU,
                             empresa: this.baseLocal.user.EMPRESA },
                           { codigo: this.usuario.KOFU,
                             nombre: this.usuario.NOKOFU } )
        .subscribe( (data: any) => { this.funciones.descargaEspera();
                                     this.Importados = data;
                                     this.muestraImportados( codigoprod ); },
                    (err: any) => { this.funciones.descargaEspera();
                                    this.funciones.msgAlert( 'ATENCION', err ); }
                  );
  }
  async muestraImportados( codproducto ) {
    if ( this.Importados.length ) {
      //
      const impconst: any = [];
      this.Importados.forEach( element => {
        impconst.push( {  type: 'radio',
                          label: 'Cant: ' + element.cantidad.toString() + '  [ Llegada: ' + element.fecha + ' ]',
                          value: element } );
      });
      //
      const alert = await this.alertCtrl.create({
        header: 'Importaciones : ' + codproducto,
        inputs: impconst,
        buttons:  [ { text: 'Ok', handler: (data: any) => {} } ]} );
      await alert.present();
    } else {
        this.funciones.msgAlert('ATENCION', 'Producto sin importaciones. Intente con otros datos.' );
    }
  }

  async opcionPuntos( event, codigoProducto ) {
      const popover = await this.popoverCtrl.create({
        component: TrespuntosComponent,
        event,
        mode: 'ios',
        translucent: false
      });
      await popover.present();

      const { data } = await popover.onDidDismiss();
      let dataParam = '';
      // console.log('data', data.opcion.texto);
      switch (data.opcion.texto) {
        //
        case 'Ultimas Ventas':
          dataParam = JSON.stringify({tipo: 'V', codigo: codigoProducto });
          this.router.navigate(['/tabs/ultmovs', dataParam]);
          break;
        //
        case 'Ultimas Compras':
          if ( !this.usuario.puedevercosto ) {
            this.funciones.msgAlert('ATENCION', 'Ud. no posee autorización paras ver esta informacion.' );
          } else {
            dataParam = JSON.stringify({tipo: 'C', codigo: codigoProducto });
            this.router.navigate(['/tabs/ultmovs', dataParam]);
          }
          break;
        //
        case 'Sugerencias':
          dataParam = JSON.stringify({ codigo: codigoProducto });
          this.router.navigate(['/tabs/sugerencias', dataParam]);
          break;
        //
        case 'NVI para reponer':
          console.log('NVI para reponer');
          break;
        //
        default:
          console.log('vacio');
          break;
      }
  }

  // PresionaryCopiar( event, producto ) {
  //   //
  //   let texto = '';
  //   // console.log(this.tap);
  //   if ( ++this.tap >= 3 ) {

  //       texto += 'Código : '+producto.codigo+'\n';
  //       texto += 'Descripcion : '+producto.descripcion+'\n' ;
  //       texto += 'Bodega ('+producto.bodega.trim()+') : '+producto.nombrebodega+'\n' ;
  //       //
  //       if ( producto.preciomayor > 0 ) {
  //         texto += 'Precio '+producto.tipolista+' : '+producto.preciomayor.toLocaleString()+'\n\n' ;
  //       }
  //       //
  //       texto +='http://www.zsmotor.cl/img/Producto/'+producto.codigo.trim()+'/'+producto.codigo.trim()+'.jpg'+'\n' ;
  //       //
  //       this.clipboard.copy( texto );
  //       //
  //       this.tap = 0 ;
  //       //
  //       this.funciones.muestraySale('Copiado al porta-papeles...',1,'middle');
  //       //
  //     }
  // }

  // async scanBarcode() {
  //   try {
  //     await this.barcode.scan()
  //               .then( barcodeData => {
  //                     this.codproducto = barcodeData.text.trim();
  //                     this.descripcion = '';
  //                     this.aBuscarProductos( this.codproducto, '', '', 1 );
  //               }, (err) => {
  //                   // An error occurred
  //               });
  //   } catch (error) { console.error(error); }
  // }

  scanBarcode() {
    const options:
          BarcodeScannerOptions = { preferFrontCamera:     true,
                                    showFlipCameraButton:  true,
                                    showTorchButton:       true,
                                    torchOn:               false,
                                    prompt:                'Encierre el código en el area de camara',
                                    resultDisplayDuration: 500,
                                    formats:               'QR_CODE,PDF_417 ',
                                    orientation:           'landscape',
                                  };
    this.barcode.scan(options)
      .then(barcodeData => {
        console.log('Barcode data', barcodeData);
        // this.scannedData = barcodeData;
      })
      .catch(err => {
        console.log('Error', err);
      });
  }

  // goToCreateCode() {
  //   this.barcode.encode(this.barcode.Encode.TEXT_TYPE, this.encodeData)
  //     .then((encodedData) => {
  //           console.log(encodedData);
  //           // this.encodedData = encodedData;
  //     }, (err) => { console.log('Error occured : ' + err);
  //     });
  // }
}
