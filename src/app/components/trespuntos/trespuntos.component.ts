import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { BaselocalService } from '../../services/baselocal.service';

@Component({
  selector: 'app-trespuntos',
  templateUrl: './trespuntos.component.html',
  styleUrls: ['./trespuntos.component.scss'],
})
export class TrespuntosComponent implements OnInit {

  sugerencias = [ { texto: 'Últimas Ventas',   icon: 'ios-cloud-upload' },
                  { texto: 'Últimas Compras',  icon: 'ios-cloud-download' },
                  { texto: 'NVI para reponer', icon: 'md-sync' },
                  { texto: 'Sugerencias',      icon: 'md-bulb'  },
                  { texto: 'Ficha técnica',    icon: 'attach' }/*,  -- information-circle
                  { texto: 'Compartir',        icon: 'md-share' }*/ ];

  constructor( private popoverCtrl: PopoverController,
               public  baseLocal: BaselocalService ) { }

  ngOnInit() {}

  onClick( pos: number ) {
    this.popoverCtrl.dismiss({
      opcion: this.sugerencias[pos]
    });
  }

}
