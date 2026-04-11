import { Routes } from '@angular/router';
import { ProdutoComponent } from './pages/produto/produto'; // <- Nome curto!
import { NotaFiscalComponent } from './pages/nota-fiscal/nota-fiscal'; // <- Nome curto!

export const routes: Routes = [
  { path: '', redirectTo: 'produtos', pathMatch: 'full' },
  { path: 'produtos', component: ProdutoComponent },
  { path: 'notas-fiscais', component: NotaFiscalComponent }
];