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
    alunoRa: cadastro.alunoRa.value,
    livroId: Number(cadastro.livroId.value),
  };
  fetch(url + "/emprestimos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  })
    .then((res) => res.status)
    .then((status) => {
      if (status === 201) {
        window.location.reload();
      } else {
        alert("Erro ao cadastrar empréstimo!");
      }
    });
});

fetch(url + "/emprestimos")
  .then((res) => res.json())
  .then((dados) => {
    const corpo = document.querySelector("main tbody");
    dados.forEach((emp) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td data-label="ID">${emp.id}</td>
        <td data-label="RA">${emp.alunoRa}</td>
        <td data-label="Livro ID">${emp.livroId}</td>
        <td data-label="Retirada">${new Date(emp.retirada).toLocaleDateString("pt-BR")}</td>
        <td data-label="Devolução">${
          emp.devolucao ? new Date(emp.devolucao).toLocaleDateString("pt-BR") : "Emprestado"
        }</td>
        <td data-label="Multa">${emp.multa ?? 0}</td>
        <td data-label="Detalhes">
          <button onclick="showDetalhes(${emp.id})">Detalhes</button>
        </td>   
        
      `;
      corpo.appendChild(tr);
    });
  });

function showDetalhes(id) {
  fetch(url + "/emprestimos/" + id)
    .then((res) => res.json())
    .then((dados) => {
      const emp = dados[0];

      modalDetalhes.classList.remove("oculto");

      detalhes.id.value = emp.id;
      detalhes.alunoRa.value = emp.alunoRa;
      detalhes.livroId.value = emp.livroId;
      detalhes.retirada.value = emp.retirada?.slice(0, 16);
      detalhes.devolucao.value = emp.devolucao ? emp.devolucao.slice(0, 16) : "";
      detalhes.multa.value = emp.multa ?? 0;
      detalhes.aluno.value = emp.aluno.nome;
      detalhes.livro.value = emp.livro.titulo;

      emprestimos.innerHTML = "";
    });
}

detalhes.addEventListener("submit", (e) => {
  e.preventDefault();
  const dados = {
    alunoRa: detalhes.alunoRa.value,
    livroId: Number(detalhes.livroId.value),
    retirada: new Date(detalhes.retirada.value),
  };
  if (detalhes.devolucao.value !== "") {
    dados.devolucao = new Date(detalhes.devolucao.value);
  }
  if (detalhes.multa.value != 0) {
    dados.multa = Number(detalhes.multa.value);
  }

  fetch(url + "/emprestimos/" + detalhes.id.value, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  })
    .then((res) => res.status)
    .then((status) => {
      if (status === 202) {
        window.location.reload();
      } else {
        alert("Erro ao atualizar empréstimo!");
      }
    });
});

function excluir() {
  const id = detalhes.id.value;
  fetch(url + "/emprestimos/" + id, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.status)
    .then((status) => {
      if (status === 204) {
        window.location.reload();
      } else {
        alert("Erro ao excluir empréstimo!");
      }
    });
}
