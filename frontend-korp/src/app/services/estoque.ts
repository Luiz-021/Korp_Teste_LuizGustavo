import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstoqueService { // <- Nome ajustado aqui
  // A URL do seu backend C# (A porta 5062 é do Estoque)
  private apiUrl = 'http://localhost:5062/api/Produto';

  // Injetamos o HttpClient mágico do Angular
  constructor(private http: HttpClient) { }

  // RXJS EM AÇÃO: Envia o produto para o C#
  cadastrarProduto(produto: any): Observable<any> {
    return this.http.post(this.apiUrl, produto);
  }

  // RXJS EM AÇÃO: Busca a lista de produtos do C#
  listarProdutos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}