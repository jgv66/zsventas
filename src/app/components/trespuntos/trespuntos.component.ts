import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { BaselocalService } from '../../services/baselocal.service';

@Component({
  selector: 'app-trespuntos',
  templateUrl: './trespuntos.component.html',
  styleUrls: ['./trespuntos.component.scss'],
})
export class TrespuntosComponent implements OnInit {

  sugerencias = [ { texto: 'Ultimas Ventas'   },
                  { texto: 'Ultimas Compras'  },
                  { texto: 'Sugerencias'      },
                  { texto: 'NVI para reponer' } ];

  constructor( private popoverCtrl: PopoverController,
               public  baseLocal: BaselocalService ) { }

  ngOnInit() {}

  onClick( pos: number ) {
    this.popoverCtrl.dismiss({
      opcion: this.sugerencias[pos]
    });
  }

}
