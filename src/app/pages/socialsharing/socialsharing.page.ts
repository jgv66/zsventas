import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { FuncionesService } from '../../services/funciones.service';
import { ActionSheetController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-socialsharing',
  templateUrl: './socialsharing.page.html',
  styleUrls: ['./socialsharing.page.scss'],
})
export class SocialsharingPage implements OnInit {

  item;

  constructor( private funciones: FuncionesService,
               private router: Router,
               private social: SocialSharing,
               private actionSheetCtrl: ActionSheetController,
               private platform: Platform,
               private parametros: ActivatedRoute ) { }

  ngOnInit() {
    this.item = JSON.parse( this.parametros.snapshot.paramMap.get('dataP') );
    this.socialporWEB();
  }

  socialporWEB() {

    let texto = '';

    alert( 'PWA -> ' + ( this.platform.is('pwa') === true ? 'si' : 'no' ) + '\n' +
           'IOS -> ' + ( this.platform.is('ios') === true ? 'si' : 'no' ) + '\n' +
           'ANDROID -> ' + ( this.platform.is('android') === true ? 'si' : 'no' ) + '\n'
     );

    if ( this.platform.is('cordova') ) {
      this.social.share(
          'Código: ' + this.item.producto.codigo,
          'Descripcion : ' + this.item.producto.descripcion,
          'vacio',
          'http://www.zsmotor.cl/img/Producto/' + this.item.producto.codigo.trim() + '/' + this.item.producto.codigo.trim() + '.jpg'
      );
    } else {

      if ( navigator['share'] ) {
          //
          texto += 'Descripcion : ' + this.item.producto.descripcion + '\n';
          if ( this.item.producto.preciomayor > 0 ) {
            texto += 'Precio ' + this.item.producto.tipolista + ' : ' + this.item.producto.preciomayor.toLocaleString() + '\n\n' ;
          }
          //
          navigator['share']( {
              title: 'Código: ' + this.item.producto.codigo,
              text: texto,
              url: 'http://www.zsmotor.cl/img/Producto/' + this.item.producto.codigo.trim() + '/' + this.item.producto.codigo.trim() + '.jpg'
          })
          .then(() => { this.funciones.msgAlert('ATENCION', 'Compartido !');
                        this.router.navigate(['/tabs/inicio']); } )
          .catch((error) => { this.funciones.msgAlert('ATENCION', error );
                              this.router.navigate(['/tabs/inicio']); } );
          //
      } else {
        this.funciones.msgAlert('ATENCION', 'No se pudo compartir porque no se soporta');
      }
    }

  }

}
