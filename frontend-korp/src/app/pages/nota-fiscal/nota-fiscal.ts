import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select'; // Para o Dropdown de produtos

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
  itensTemporarios: any[] = []; // O nosso "carrinho" antes de salvar a nota

  notasFiscais = new MatTableDataSource<any>([]);
  colunasTabela: string[] = ['id', 'numero', 'status', 'qtdItens'];

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
    this.carregarProdutos(); // Busca do microsserviço 1
    this.carregarNotas();    // Busca do microsserviço 2
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

      // VALIDAÇÃO: Bloqueia se não tiver saldo
      if (formValue.quantidade > produtoSelecionado.saldo) {
        alert(`Operação negada: Estoque insuficiente! O saldo atual de ${produtoSelecionado.descricao} é apenas ${produtoSelecionado.saldo}.`);
        return; 
      }

      // OPÇÃO A (VISUAL): Subtrai o saldo da tela instantaneamente para o usuário ver
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

    // OPÇÃO B (BANCO DE DADOS): Primeiro salva a nota no Faturamento...
    this.faturamentoService.emitirNota(novaNota).subscribe({
      next: () => {
        
        // ... E se der certo, avisa o Estoque para atualizar o saldo no banco de dados!
        this.itensTemporarios.forEach(item => {
          const produtoCompleto = this.produtos.find(p => p.id === item.produtoId);
          if (produtoCompleto) {
            this.estoqueService.atualizarProduto(produtoCompleto.id, produtoCompleto).subscribe();
          }
        });

        alert('Sucesso! Nota Fiscal emitida e Estoque deduzido no banco de dados.');
        this.itensTemporarios = []; // Limpa o carrinho
        this.carregarNotas(); // Atualiza a tabela
      },
      error: (err: any) => {
        console.error(err);
        alert('Erro ao emitir nota fiscal. Veja o console (F12).');
      }
    });
  }

  calcularTotalPecas(itens: any[]): number {
    if (!itens) return 0;
    return itens.reduce((total, item) => total + item.quantidade, 0);
  }
}