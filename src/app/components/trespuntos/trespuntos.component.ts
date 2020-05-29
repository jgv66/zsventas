import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { BaselocalService } from '../../services/baselocal.service';

@Component({
  selector: 'app-trespuntos',
  templateUrl: './trespuntos.component.html',
  styleUrls: ['./trespuntos.component.scss'],
})
export class TrespuntosComponent {

  sugerencias = [
    { texto: 'Últimas Ventas',   icon: 'cloud-upload' },
    { texto: 'Últimas Compras',  icon: 'cloud-download' },
    { texto: 'NVI para reponer', icon: 'sync' },
    { texto: 'Sugerencias',      icon: 'bulb' },
    // { texto: 'Redes Sociales',   icon: 'share' },
    { texto: 'Ficha Técnica',    icon: 'attach' },
  ];
  constructor( private popoverCtrl: PopoverController,
               public  baseLocal: BaselocalService ) { }

  onClick( pos: number ) {
    this.popoverCtrl.dismiss({
      opcion: this.sugerencias[pos]
    });
  }

}
