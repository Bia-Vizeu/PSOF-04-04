const url = "http://localhost:3001";

const formCadastro = document.querySelector("#cadastro form");
const formDetalhes = document.querySelector("#detalhes form");
const tabelaEmprestimos = document.querySelector("#detalhes tbody");
const tabelaLivros = document.querySelector("#lista-livros");
const botaoAbrirCadastro = document.querySelector("#botao-cadastro");
const modalCadastro = document.querySelector("#cadastro");
const modalDetalhes = document.querySelector("#detalhes");

botaoAbrirCadastro.addEventListener("click", () => {
  modalCadastro.classList.remove("oculto");
});

document.querySelectorAll(".fechar").forEach(botao => {
  botao.addEventListener("click", () => {
    modalCadastro.classList.add("oculto");
    modalDetalhes.classList.add("oculto");
  });
});

fetch(url)
  .then(resposta => resposta.json())
  .then(dados => {
    document.title = dados.titulo;
    document.querySelector("header h1").textContent = dados.titulo;
  });

formCadastro.addEventListener("submit", (e) => {
  e.preventDefault();

  const novoLivro = {
    titulo: formCadastro.titulo.value,
    autor: formCadastro.autor.value,
    prateleira: formCadastro.prateleira.value
  };

  fetch(url + "/livros", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novoLivro)
  })
    .then(res => res.status)
    .then(status => {
      if (status === 201) {
        window.location.reload(); 
      } else {
        alert("Erro ao cadastrar o livro.");
      }
    });
});

fetch(url + "/livros")
  .then(res => res.json())
  .then(livros => {
    livros.forEach(livro => {
      const linha = document.createElement("tr");
      linha.innerHTML = `
        <td>${livro.id}</td>
        <td>${livro.titulo}</td>
        <td>${livro.autor}</td>
        <td>${livro.prateleira}</td>
        <td><button onclick="mostrarDetalhes(${livro.id})">Detalhes</button></td>
      `;
      tabelaLivros.appendChild(linha);
    });
  });

function mostrarDetalhes(id) {
  fetch(url + "/livros/" + id)
    .then(res => res.json())
    .then(dados => {
      const livro = dados[0];
      formDetalhes.id.value = livro.id;
      formDetalhes.titulo.value = livro.titulo;
      formDetalhes.autor.value = livro.autor;
      formDetalhes.prateleira.value = livro.prateleira;

      tabelaEmprestimos.innerHTML = "";
      livro.emprestimos.forEach(emp => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
          <td>${emp.id}</td>
          <td>${emp.aluno.ra}</td>
          <td>${emp.aluno.nome}</td>
          <td>${emp.aluno.telefone}</td>
          <td>${new Date(emp.retirada).toLocaleDateString("pt-BR")}</td>
          <td>${emp.devolucao ? new Date(emp.devolucao).toLocaleDateString("pt-BR") : "Emprestado"}</td>
        `;
        tabelaEmprestimos.appendChild(linha);
      });

      modalDetalhes.classList.remove("oculto");
    });
}

formDetalhes.addEventListener("submit", (e) => {
  e.preventDefault();

  const livroAtualizado = {
    titulo: formDetalhes.titulo.value,
    autor: formDetalhes.autor.value,
    prateleira: formDetalhes.prateleira.value
  };

  fetch(url + "/livros/" + formDetalhes.id.value, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(livroAtualizado)
  })
    .then(res => res.status)
    .then(status => {
      if (status === 202) {
        window.location.reload();
      } else {
        alert("Erro ao atualizar o livro.");
      }
    });
});

function excluir() {
  const id = formDetalhes.id.value;

  fetch(url + "/livros/" + id, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" }
  })
    .then(res => res.status)
    .then(status => {
      if (status === 204) {
        window.location.reload();
      } else {
        alert("Erro ao excluir o livro.");
      }
    });
}
