import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { BaselocalService } from '../../services/baselocal.service';

@Component({
  selector: 'app-trespuntos',
  templateUrl: './trespuntos.component.html',
  styleUrls: ['./trespuntos.component.scss'],
})
export class TrespuntosComponent {

  constructor( private popoverCtrl: PopoverController,
               public  baseLocal: BaselocalService ) { }

  onClick( pos: number ) {
    this.popoverCtrl.dismiss({
      opcion: pos
    });
  }

}
