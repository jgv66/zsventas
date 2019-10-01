import { Component, OnInit } from '@angular/core';
import { FuncionesService } from 'src/app/services/funciones.service';
import { AlertController, IonInfiniteScroll, PopoverController } from '@ionic/angular';
import { BaselocalService } from '../../services/baselocal.service';
import { NetworkengineService } from '../../services/networkengine.service';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Router } from '@angular/router';
import { TrespuntosComponent } from '../../components/trespuntos/trespuntos.component';

@Component({
  selector: 'app-tabinicio',
  templateUrl: './tabinicio.page.html',
  styleUrls: ['./tabinicio.page.scss'],
})
export class TabinicioPage implements OnInit {
  //
  // @ViewChild( 'Content' ) content: Content;
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
  filtrosVarios   = false;
  tipoTarjeta     = true;
  codSuperFam     = '';
  filtroFamilias  = false;
  codFamilias     = '';
  // get's
  listaProductos  = [];
  pProd           = '';
  pDesc           = '';
  pFami           = '';
  // familias zsmotor   jgv 01-05-2018
  listaFamilias: any = [{ cod: 'NEUM', descrip: 'Neumáticos'            },
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
               private baseLocal: BaselocalService,
               public  funciones: FuncionesService,
               private alertCtrl: AlertController,
               private router: Router,
               private popoverCtrl: PopoverController,
               private barcode: BarcodeScanner ) {
    this.filtrosVarios = false;
    this.codproducto   = '';
    this.descripcion   = '';
    this.codSuperFam   = '';
    this.usuario       = this.baseLocal.user;
    this.inicializa();
    this.cliente      = this.funciones.initCliente();
    this.firstcall     = true;
  }

  ionViewDidLoad() {
  }
  ionViewWillEnter() {
    if ( !this.firstcall ) {
      this.funciones.obtenUltimoCliente().then( (data: any) => this.cliente = data ) ;
    } else {
      this.firstcall = false;
      this.funciones.guardaUltimoCliente( this.cliente );
    }
    this.baseLocal.obtenUltimoConfig().then( (data: any) => this.config = data );
  }
  ionViewWillLeave() {
  }


  ngOnInit() {
    this.usuario = this.baseLocal.user;
    this.cliente = this.funciones.initCliente();
    this.config  = this.baseLocal.initConfig();
    this.config.imagenes = true;
  }


  inicializa() {
    this.cliente = this.funciones.initCliente();
    this.baseLocal.obtenUltimoConfig().then( data => this.config = data );
  }

  verImagen() {
    this.config.imagenes = !this.config.imagenes;
  }

  loadDefaultImg( event ) {
    event.target.src = 'assets/imgs/no-img.png';
  }

  aBuscarProductos( pProducto?, pDescripcion?, pCodFamilias?, xdesde?, infiniteScroll? ) {
    if ( pProducto === '' && pDescripcion === '' && pCodFamilias === '' ) {
      this.funciones.msgAlert('DATOS VACIOS', 'Debe indicar algún dato para buscar...');
    } else {
      //
      if ( xdesde === 1 ) {
        this.funciones.cargaEspera();
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
      this.netWork.traeUnSP( 'ksp_buscarProductos_v7', {  codproducto:   pProducto,
                                                          descripcion:   pDescripcion,
                                                          bodega:        this.usuario.BODEGA,
                                                          offset:        this.offset.toString(),
                                                          usuario:       this.usuario,
                                                          soloconstock:  this.config.soloconstock,
                                                          ordenar:       this.config.ordenar,
                                                          soloverimport: this.config.soloverimport,
                                                          familias:      pCodFamilias } )
          .subscribe( data => { if ( xdesde === 1 ) { this.funciones.descargaEspera(); }
                                this.revisaExitooFracaso( data, xdesde, infiniteScroll );
                              },
                      err  => { this.funciones.descargaEspera();
                                this.funciones.msgAlert( 'ATENCION', err );
                              }
                    );
    }
  }

  private revisaExitooFracaso( data, xdesde, infiniteScroll ) {
    // console.log(data);
    const rs    = data;
    const largo = data.length;
    if ( rs === undefined || largo === 0 ) {
      this.funciones.msgAlert('ATENCION', 'Su búsqueda no tiene resultados. Intente con otros datos.');
    } else if ( largo > 0 ) {
      //
      // this.listaProductos = ( this.offset === 0 ) ? rs : this.listaProductos.concat(rs);
      this.listaProductos.push( ...rs  );
      //
      if ( infiniteScroll ) {
        infiniteScroll.target.complete();
      }
      //
      if ( largo < this.scrollSize ) {
        this.lScrollInfinito = false ;
      } else if ( xdesde === 1 ) {
        this.lScrollInfinito = true ;
      }
    }
  }

  masDatos( infiniteScroll: any ) {
    this.aBuscarProductos( this.pProd, this.pDesc, this.pFami, 0, infiniteScroll );
  }

  async scanBarcode() {
    try {
      await this.barcode.scan()
                .then( barcodeData => {
                      this.codproducto = barcodeData.text.trim();
                      this.descripcion = '';
                      this.aBuscarProductos( this.codproducto, '', '', 1 );
                }, (err) => {
                    // An error occurred
                });
    } catch (error) { console.error(error); }
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

  private revisaEoFLP( producto, data ) {
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
        const alert = await this.alertCtrl.create();
        alert.header = 'Precios para : ' + producto.codigo ;
        //
        listas.forEach( element => {
          alert.inputs.push( {
              type: 'radio',
              label: '(' + element.metodolista + '/' + element.listaprecio + ') -> ' +
                           element.monedalista.trim() + '   ' +
                           element.precio1.toLocaleString('es-ES') + this.CeroBlanco(element.descuentomax1),
              value: element } );
        });
        //
        alert.buttons.push( 'Cancelar' );
        alert.buttons.push({ text: 'Ok', handler: (data: any) => this.cambiaListaProductos( data, producto, 2 ) });
        //
        alert.present()
          .then(  () => {} )
          .catch( () => {} );
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

  private revisaEoFBP( producto, data ) {
    const rs    = data;
    const largo = rs.length;
    if ( rs === undefined || largo === 0 ) {
      this.funciones.msgAlert('ATENCION',
                              'Producto sin stock, sin asignación a bodegas o usted no tiene permiso para revisar todas las bodegas.');
    } else if ( largo > 0 ) {
      this.seleccionarBodega( producto, rs );
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

  agregarAlCarro( producto, cliente ) {
    this.funciones.pideCantidad( producto, cliente, this.usuario );
  }

  totalDelPedido() {
    this.funciones.msgAlert( 'ATENCION', 'La suma hasta ahora de su pedido es de : $ ' + this.funciones.sumaCarrito() );
  }

  ConfiguracionLocal() {
    this.router.navigate( ['/menuseteo'] );
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
                  { text: 'Sí, limpiar', handler: () => { this.cliente = this.funciones.initCliente();
                                                          this.usuario.LISTACLIENTE = '';
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

  cargaDatoImportado( codproducto ) {
    this.funciones.cargaEspera();
    this.netWork.traeUnSP( 'ksp_EnImportaciones',
                           { codproducto, usuario: this.usuario, empresa: '01' },
                           { codigo: this.usuario.KOFU, nombre: this.usuario.NOKOFU } )
        .subscribe( (data: any) => { this.funciones.descargaEspera();
                                     this.Importados = data;
                                     this.muestraImportados( codproducto ); },
                    (err: any) => { this.funciones.descargaEspera();
                                    this.funciones.msgAlert( 'ATENCION', err ); }
                  );
  }

  async muestraImportados( codproducto ) {
    if ( this.Importados.length ) {
      //
      const impconst: any = {};
      this.Importados.forEach( element => {
        impconst.push( {  type: 'checkbox',
                          label: 'Q: ' + element.cantidad.toString() + '  [ Fecha: ' + element.fecha + ' ]',
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

  async opcionPuntos( event ) {
      const popover = await this.popoverCtrl.create({
        component: TrespuntosComponent,
        event,
        mode: 'ios',
        translucent: false
      });
      return await popover.present();

      const { data } = await popover.onDidDismiss();
      console.log('data', data);
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
  //         //texto += 'Precio '+producto.tipolista+' : '+this.funciones.numberFormat(producto.preciomayor)+'\n\n' ;
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

}
