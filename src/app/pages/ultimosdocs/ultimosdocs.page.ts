import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BaselocalService } from '../../services/baselocal.service';
import { NetworkengineService } from '../../services/networkengine.service';
import { FuncionesService } from '../../services/funciones.service';

@Component({
  selector: 'app-ultimosdocs',
  templateUrl: './ultimosdocs.page.html',
  styleUrls: ['./ultimosdocs.page.scss'],
})
export class UltimosdocsPage implements OnInit {

  buscando   = false;
  documentos = [];
  td;

  constructor( public baseLocal: BaselocalService,
               private router: Router,
               private parametros: ActivatedRoute,
               private netWork: NetworkengineService,
               private funciones: FuncionesService ) {
      this.td = this.parametros.snapshot.paramMap.get('td');
  }

  ngOnInit() {
    this.buscando = true;
    this.netWork.traeUnSP(  'ksp_traeUltimosDocs',
                            { cliente: this.baseLocal.cliente.codigo,
                              empresa: this.baseLocal.user.EMPRESA,
                              tipo:    this.td },
                              { codigo: this.baseLocal.user.KOFU,
                                nombre: this.baseLocal.user.NOKOFU } )
        .subscribe( data => { this.revisa( data );           },
                    err  => { this.funciones.msgAlert( 'ATENCION', err ); });
  }
  revisa( data ) {
    this.buscando = false;
    const rs = data;
    if ( data === undefined || data.length === 0 ) {
      this.funciones.muestraySale('ATENCION : Cliente no presenta documentos', 2 );
    } else {
      this.documentos.push( ...data );
    }
  }

  muestraID( id ) {
    this.router.navigate( ['/tabs/documento/' + id.toString() ]);
  }

}
