import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabcarritoPage } from './tabcarrito.page';
import { BuscarvendedorPage } from '../buscarvendedor/buscarvendedor.page';
import { ComponentsModule } from '../../components/components.module';
import { BuscarvendedorPageModule } from '../buscarvendedor/buscarvendedor.module';

const routes: Routes = [
  {
    path: '',
    component: TabcarritoPage
  }
];

@NgModule({
  entryComponents: [ BuscarvendedorPage ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    BuscarvendedorPageModule
  ],
  declarations: [TabcarritoPage]
})
export class TabcarritoPageModule {}
