import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MenuseteoPage } from './menuseteo.page';
import { ComponentsModule } from '../../components/components.module';
import { MovdoccliComponent } from '../../components/movdoccli/movdoccli.component';
import { BuscarclientesPage } from '../buscarclientes/buscarclientes.page';
import { BuscarclientesPageModule } from '../buscarclientes/buscarclientes.module';
import { ModifclientesPage } from '../modifclientes/modifclientes.page';
import { ModifclientesPageModule } from '../modifclientes/modifclientes.module';

const routes: Routes = [
  {
    path: '',
    component: MenuseteoPage
  }
];

@NgModule({
  entryComponents: [ MovdoccliComponent, BuscarclientesPage, ModifclientesPage ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    BuscarclientesPageModule,
    ModifclientesPageModule
  ],
  declarations: [MenuseteoPage]
})
export class MenuseteoPageModule {}
