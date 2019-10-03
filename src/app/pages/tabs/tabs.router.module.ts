import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      { path: 'inicio' ,   children: [ { path: '', loadChildren: '../../pages/tabinicio/tabinicio.module#TabinicioPageModule'    }] },
      { path: 'filtros',   children: [ { path: '', loadChildren: '../../pages/tabfiltros/tabfiltros.module#TabfiltrosPageModule' }] },
      { path: 'salida',    children: [ { path: '', loadChildren: '../../pages/tabsalida/tabsalida.module#TabsalidaPageModule'    }] },
      { path: '', redirectTo: '/tabs/(inicio:inicio)', pathMatch: 'full' },
    ]
  },
  { path: '',
    redirectTo: '/tabs/inicio',
    pathMatch: 'full'
  },
  { path: 'menuseteo', children: [ { path: '', loadChildren: '../../pages/menuseteo/menuseteo.module#MenuseteoPageModule'    }] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
