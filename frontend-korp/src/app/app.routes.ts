import { Routes } from '@angular/router';
import { ProdutoComponent } from './pages/produto/produto'; 
import { NotaFiscalComponent } from './pages/nota-fiscal/nota-fiscal';
import { HomeComponent } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: HomeComponent }, 
  { path: 'produtos', component: ProdutoComponent },
  { path: 'notas-fiscais', component: NotaFiscalComponent },
  { path: '**', redirectTo: '' } // Rota para redirecionar para Home caso a rota não seja encontrada
];