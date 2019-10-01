import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { ExpandheaderComponent } from './expandheader/expandheader.component';
import { FlashCardComponent } from './flash-card/flash-card.component';
import { CardprodComponent } from './cardprod/cardprod.component';
import { ListprodComponent } from './listprod/listprod.component';
import { TrespuntosComponent } from './trespuntos/trespuntos.component';

@NgModule({
  declarations: [ CardprodComponent, ListprodComponent, ExpandheaderComponent, FlashCardComponent, TrespuntosComponent ],
  exports:      [ CardprodComponent, ListprodComponent, ExpandheaderComponent, FlashCardComponent, TrespuntosComponent ],
  imports:      [ CommonModule, IonicModule ]
})

export class ComponentsModule { }
