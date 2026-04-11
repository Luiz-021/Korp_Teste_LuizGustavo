import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstoqueService { 
  private apiUrl = 'http://localhost:5062/api/Produto';

  constructor(private http: HttpClient) { }

  cadastrarProduto(produto: any): Observable<any> {
    return this.http.post(this.apiUrl, produto);
  }

  listarProdutos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  atualizarProduto(id: number, produto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, produto);
  }
}