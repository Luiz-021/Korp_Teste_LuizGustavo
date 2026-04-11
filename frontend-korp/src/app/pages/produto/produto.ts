import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    ReactiveFormsModule, 
    MatFormFieldModule, 
    MatInputModule,     
    MatButtonModule,    
    MatCardModule,      
    MatTableModule      
  ],
  templateUrl: './produto.html', 
  styleUrl: './produto.css'
})
export class ProdutoComponent implements OnInit {
  produtoForm: FormGroup;
  produtos = new MatTableDataSource<any>([]);
  colunasTabela: string[] = ['id', 'codigo', 'descricao', 'saldo'];

  constructor(private fb: FormBuilder, private estoqueService: EstoqueService, private cdr: ChangeDetectorRef) {
    this.produtoForm = this.fb.group({
      codigo: ['', Validators.required],
      descricao: ['', Validators.required],
      saldo: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    this.carregarProdutos();
  }

  carregarProdutos() {
  this.estoqueService.listarProdutos().subscribe({
    next: (dados) => {
      this.produtos.data = dados;
      this.cdr.detectChanges(); 
    },
    error: (err) => console.error('Erro ao carregar produtos do C#:', err)
  });
}

  salvarProduto() {
    if (this.produtoForm.valid) {
      this.estoqueService.cadastrarProduto(this.produtoForm.value).subscribe({
        next: () => {
          alert('Produto cadastrado com sucesso!');
          this.produtoForm.reset({ saldo: 0 }); 
          this.carregarProdutos();
        },
        error: (err) => {
          console.error(err);
          alert('Erro ao cadastrar produto. O backend está rodando?');
        }
      });
    }
  }
}