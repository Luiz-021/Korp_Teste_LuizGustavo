import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select'; 

import { FaturamentoService } from '../../services/faturamento';
import { EstoqueService } from '../../services/estoque';

@Component({
  selector: 'app-nota-fiscal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatSelectModule
  ],
  templateUrl: './nota-fiscal.html',
  styleUrl: './nota-fiscal.css'
})
export class NotaFiscalComponent implements OnInit {
  itemForm: FormGroup;
  produtos: any[] = [];
  itensTemporarios: any[] = []; 

  notasFiscais = new MatTableDataSource<any>([]);
  colunasTabela: string[] = ['numero', 'status', 'resumo', 'qtdItens', 'acoes'];
  imprimindoId: number | null = null;
  constructor(
    private fb: FormBuilder,
    private faturamentoService: FaturamentoService,
    private estoqueService: EstoqueService
  ) {
    this.itemForm = this.fb.group({
      produtoId: ['', Validators.required],
      quantidade: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.carregarProdutos(); 
    this.carregarNotas();    
  }

  carregarProdutos() {
    this.estoqueService.listarProdutos().subscribe({
      next: (dados: any[]) => {
        this.produtos = dados;
      },
      error: (err) => console.error('Erro ao carregar produtos:', err)
    });
  }

  carregarNotas() {
    this.faturamentoService.listarNotas().subscribe({
      next: (dados: any[]) => {
        this.notasFiscais.data = dados;
      },
      error: (err) => console.error('Erro ao carregar notas:', err)
    });
  }

  adicionarItem() {
    if (this.itemForm.valid) {
      const formValue = this.itemForm.value;
      const produtoSelecionado = this.produtos.find(p => p.id === formValue.produtoId);

      if (formValue.quantidade > produtoSelecionado.saldo) {
        alert(`Operação negada: Estoque insuficiente! O saldo atual de ${produtoSelecionado.descricao} é apenas ${produtoSelecionado.saldo}.`);
        return; 
      }

      produtoSelecionado.saldo -= formValue.quantidade;

      this.itensTemporarios.push({
        produtoId: formValue.produtoId,
        quantidade: formValue.quantidade,
        descricao: produtoSelecionado?.descricao 
      });

      this.itemForm.patchValue({ quantidade: 1, produtoId: '' });
    }
  }

  emitirNota() {
    if (this.itensTemporarios.length === 0) return;

    const novaNota = {
      itens: this.itensTemporarios.map(item => ({
        produtoId: item.produtoId,
        quantidade: item.quantidade
      }))
    };

    this.faturamentoService.emitirNota(novaNota).subscribe({
      next: () => {
        alert('Sucesso! Nota Fiscal criada. O status inicial é Aberta.');
        this.itensTemporarios = []; 
        this.carregarNotas();
        this.carregarProdutos();
      },
      error: (err: any) => {
        console.error(err);
        alert('Erro ao emitir nota fiscal. O Servico de Estoque pode estar offline!');
      }
    });
  }

  calcularTotalPecas(itens: any[]): number {
    if (!itens) return 0;
    return itens.reduce((total, item) => total + item.quantidade, 0);
  }

  obterResumoItens(itens: any[]): string {
    if (!itens || itens.length === 0) return 'Sem itens';

    return itens.map(item => {
      // Procura o produto na lista que já baixamos do Estoque
      const produto = this.produtos.find(p => p.id === item.produtoId);
      const nome = produto ? produto.descricao : `Produto #${item.produtoId}`;
      return `${item.quantidade}x ${nome}`;
    }).join(', '); // Junta tudo com vírgula
  }

  acionarImpressao(nota: any) {
    this.imprimindoId = nota.id; // Liga o indicador de processamento (Loading) na tela

    this.faturamentoService.imprimirNota(nota.id).subscribe({
      next: () => {
        alert(`Nota ${nota.numero} impressa com sucesso! O estoque foi deduzido.`);
        this.imprimindoId = null; // Desliga o loading
        this.carregarNotas(); // Atualiza a tabela (o status vai mudar para Fechada)
        this.carregarProdutos(); // Atualiza os saldos no dropdown
      },
      error: (err: any) => {
        console.error(err);
        const mensagemDoBackend = typeof err.error === 'string' ? err.error : 'O serviço de estoque pode estar offline.';
        alert(`Falha na Impressão:\n${mensagemDoBackend}`);
        this.imprimindoId = null; // Desliga o loading
      }
    });
  }
}