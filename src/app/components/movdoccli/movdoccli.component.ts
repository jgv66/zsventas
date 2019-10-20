import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-movdoccli',
  templateUrl: './movdoccli.component.html',
  styleUrls: ['./movdoccli.component.scss'],
})
export class MovdoccliComponent {

  sugerencias = [ { texto: 'Ultimas 15 NVV' },
                  { texto: 'Ultimas 15 FCV' } ];

  constructor( private popoverCtrl: PopoverController ) { }

  onClick( pos: number ) {
    this.popoverCtrl.dismiss({
      opcion: this.sugerencias[pos]
    });
  }

}
