import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaselocalService } from '../../services/baselocal.service';
import { FuncionesService } from '../../services/funciones.service';
import { NetworkengineService } from '../../services/networkengine.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  rutocorreo: string;
  clave: string;
  autoArriba: any;
  autoAbajo: any;
  buscando = false;

  constructor(private router: Router,
              private baseLocal: BaselocalService,
              private funciones: FuncionesService,
              private netWork: NetworkengineService) {
    // console.log('<<< LoginPage >>>');
    this.rutocorreo  = '';
    this.clave       = '';
    // aleatorios para cambiar imagenes
    this.autoArriba = Math.trunc( (Math.random() * 7) + 1 );
    this.autoAbajo  = Math.trunc( (Math.random() * 7) + 1 );
    if ( this.autoArriba === this.autoAbajo ) {
      this.autoAbajo  = Math.trunc( (Math.random() * 7) + 1 );
    }
  }

  ngOnInit() {
    this.baseLocal.obtenUltimoUsuario()
        .then( pUsuario => {
          // console.log(pUsuario);
          try {
            this.rutocorreo = pUsuario.EMAIL;
            this.clave      = pUsuario.RTFU;
            this.clave      = this.clave.slice( 0, 5 );
          } catch (error) {
            this.rutocorreo = '';
            this.clave      = '';
          }
        })
        .catch( err => console.log( 'Lectura de usuario con error->', err ) );
  }

  salir() {
    this.router.navigate(['/home']);
  }

  // importante, rescata la configuracion
  rescataConfiguracion() {
    // console.log( '<<< rescataConfiguracion() >>>' );
    this.netWork.rescataSeteoCliente()
        .subscribe( (data: any) => this.baseLocal.actualizarConfig( data.configp ),
                    (err: any)  => { this.funciones.msgAlert( 'ATENCION' , 'Ocurrió un error -> ' + err ); }
                  );
  }

  logearme() {
    if ( this.rutocorreo === '' || this.clave === '' ) {
      this.funciones.msgAlert('Código vacío', 'Debe digitar usuario y clave para ingresar.');
    } else {
    this.buscando = true;
    this.netWork.traeUnSP('ksp_buscarUsuario',
                          { rutocorreo: this.rutocorreo, clave: this.clave },
                          { codigo: this.rutocorreo , nombre: this.rutocorreo } )
        .subscribe( data => { this.revisaExitooFracaso( data ); },
                    err  => { this.funciones.msgAlert( 'ATENCION' , 'Ocurrió un error -> ' + err ); }
                  );
    }
  }
  revisaExitooFracaso( data ) {
    this.buscando = false;
    const rs = data[0];
    if ( rs.length === 0 ) {
        this.funciones.msgAlert('ATENCION', 'Los datos ingresados no coinciden con usuarios registrados. Corrija y reintente.');
    } else {
        console.log(rs);
        this.rescataConfiguracion();
        //
        if ( rs.esvendedor === true ) {
          rs.LISTACLIENTE = '';
        }
        //
        this.funciones.muestraySale( 'Hola ' + rs.NOKOFU.trim() + ', ' + this.funciones.textoSaludo(), 0.7 );
        this.baseLocal.guardaUltimoUsuario( rs );
        this.baseLocal.user = rs;
        this.router.navigate(['/tabs/inicio']);
    }
  }

}
