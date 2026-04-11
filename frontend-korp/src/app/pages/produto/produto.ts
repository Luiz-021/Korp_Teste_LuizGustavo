import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { EstoqueService } from '../../services/estoque';

@Component({
  selector: 'app-produto',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // Para gerenciar o formulário
    MatFormFieldModule, // Visual do campo de texto
    MatInputModule,     // Visual do input
    MatButtonModule,    // Visual do botão
    MatCardModule,      // Visual de "cartão" para agrupar as coisas
    MatTableModule      // Visual da tabela de listagems
  ],
  templateUrl: './produto.html', 
  styleUrl: './produto.css'
})
export class ProdutoComponent implements OnInit {
  produtoForm: FormGroup;
  produtos = new MatTableDataSource<any>([]);
  colunasTabela: string[] = ['id', 'codigo', 'descricao', 'saldo'];

  // Injetamos o montador de formulários e o nosso serviço de rede
  constructor(private fb: FormBuilder, private estoqueService: EstoqueService) {
    this.produtoForm = this.fb.group({
      codigo: ['', Validators.required],
      descricao: ['', Validators.required],
      saldo: [0, [Validators.required, Validators.min(0)]]
    });
  }

  // Isso roda automaticamente quando a tela abre
  ngOnInit() {
    this.carregarProdutos();
  }

  // RXJS EM AÇÃO: O "subscribe" fica ouvindo a resposta do C#
  carregarProdutos() {
  this.estoqueService.listarProdutos().subscribe({
    next: (dados) => {
      // O DataSource cuida de avisar o HTML para se atualizar na hora e sem erros!
      this.produtos.data = dados; 
    },
    error: (err) => console.error('Erro ao carregar produtos do C#:', err)
  });
}

  salvarProduto() {
    if (this.produtoForm.valid) {
      this.estoqueService.cadastrarProduto(this.produtoForm.value).subscribe({
        next: () => {
          alert('Produto cadastrado com sucesso!');
          this.produtoForm.reset({ saldo: 0 }); // Limpa a tela
          this.carregarProdutos(); // Atualiza a tabela na hora
        },
        error: (err) => {
          console.error(err);
          alert('Erro ao cadastrar produto. O backend está rodando?');
        }
      });
    }
  }
}