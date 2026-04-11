import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FaturamentoService {
  private apiUrl = 'http://localhost:5265/api/NotaFiscal';

  constructor(private http: HttpClient) { }

  emitirNota(nota: any): Observable<any> {
    return this.http.post(this.apiUrl, nota);
  }

  listarNotas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}