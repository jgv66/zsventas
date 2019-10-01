import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-trespuntos',
  templateUrl: './trespuntos.component.html',
  styleUrls: ['./trespuntos.component.scss'],
})
export class TrespuntosComponent implements OnInit {

  sugerencias = [ { texto: 'Caro' },
                  { texto: 'Barato' },
                  { texto: 'Malo' },
                  { texto: 'Quiebre Stock' },
                  { texto: 'NVI para reponer' } ];

  constructor( private popoverCtrl: PopoverController ) { }

  ngOnInit() {}

  onClick( pos: number ) {
    console.log(pos);
    this.popoverCtrl.dismiss({
      opcion: this.sugerencias[pos]
    });
  }
}
