import { Routes } from '@angular/router';
import { ProdutoComponent } from './pages/produto/produto'; 
import { NotaFiscalComponent } from './pages/nota-fiscal/nota-fiscal';

export const routes: Routes = [
  { path: '', redirectTo: 'produtos', pathMatch: 'full' },
  { path: 'produtos', component: ProdutoComponent },
  { path: 'notas-fiscais', component: NotaFiscalComponent }
];