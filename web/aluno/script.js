const url = "http://localhost:3001";

const detalhes = document.querySelector("#detalhes form");
const cadastro = document.querySelector("#cadastro form");
const emprestimos = document.querySelector("#detalhes tbody");

const modalCadastro = document.getElementById("cadastro");
const modalDetalhes = document.getElementById("detalhes");
const botaoCadastro = document.getElementById("botao-cadastro");
const fecharBotoes = document.querySelectorAll(".janela > div > button");

fetch(url)
  .then((res) => res.json())
  .then((dados) => {
    document.querySelector("title").innerHTML = dados.titulo;
    document.querySelector("header h1").innerHTML = dados.titulo;
  });

botaoCadastro.addEventListener("click", () => {
  modalCadastro.classList.remove("oculto");
});

fecharBotoes.forEach((botao) => {
  botao.addEventListener("click", () => {
    modalCadastro.classList.add("oculto");
    modalDetalhes.classList.add("oculto");
  });
});

cadastro.addEventListener("submit", (e) => {
  e.preventDefault();
  const dados = {
    ra: cadastro.ra.value,
    nome: cadastro.nome.value,
    telefone: cadastro.telefone.value,
  };
  fetch(url + "/alunos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  })
    .then((res) => res.status)
    .then((status) => {
      if (status === 201) {
        window.location.reload();
      } else {
        alert("Erro ao enviar dados para a API!");
      }
    });
});

fetch(url + "/alunos")
  .then((res) => res.json())
  .then((dados) => {
    const corpo = document.querySelector("main tbody");
    dados.forEach((aluno) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td data-label="RA">${aluno.ra}</td>
        <td data-label="Nome">${aluno.nome}</td>
        <td data-label="Telefone">${aluno.telefone}</td>
        <td data-label="Detalhes">
          <button onclick="showDetalhes('${aluno.ra}')">Detalhes</button>
        </td>
      `;
      corpo.appendChild(tr);
    });
  });

function showDetalhes(ra) {
  fetch(url + "/alunos/" + ra)
    .then((res) => res.json())
    .then((dados) => {
      modalDetalhes.classList.remove("oculto"); 
      detalhes.ra.value = dados[0].ra;
      detalhes.nome.value = dados[0].nome;
      detalhes.telefone.value = dados[0].telefone;

      emprestimos.innerHTML = "";
      dados[0].emprestimos.forEach((emp) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td data-label="ID">${emp.id}</td>
          <td data-label="Título">${emp.livro.titulo}</td>
          <td data-label="Autor">${emp.livro.autor}</td>
          <td data-label="Retirada">${new Date(emp.retirada).toLocaleDateString("pt-BR")}</td>
          <td data-label="Devolução">${
            emp.devolucao ? new Date(emp.devolucao).toLocaleDateString("pt-BR") : "Emprestado"
          }</td>
        `;
        emprestimos.appendChild(tr);
      });
    });
}

detalhes.addEventListener("submit", (e) => {
  e.preventDefault();
  const dados = {
    ra: detalhes.ra.value,
    nome: detalhes.nome.value,
    telefone: detalhes.telefone.value,
  };
  fetch(url + "/alunos/" + dados.ra, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  })
    .then((res) => res.status)
    .then((status) => {
      if (status === 202) {
        window.location.reload();
      } else {
        alert("Erro ao atualizar dados na API!");
      }
    });
});

function excluir() {
  const ra = detalhes.ra.value;
  fetch(url + "/alunos/" + ra, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.status)
    .then((status) => {
      if (status === 204) {
        window.location.reload();
      } else {
        alert("Erro ao excluir aluno da API!");
      }
    });
}
