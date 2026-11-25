let produtos = JSON.parse(localStorage.getItem("discosCadastrados")) || [];
let indiceEdicao = -1;
let indiceExclusao = -1;

const imagens = {
    abbey: "AbbeyRoad.png",
    please: "PleasePleaseMe.png",
    xmas: "ElvisChristmasAlbum.png",
    love: "LoveSongs.png",
    lauryn: "TheMiseducation.png",
    bad: "Bad.png",
    offwall: "OffTheWall.png",
    diamond: "DiamondLife.png",
    deluxe: "LoveDeluxe.png"
};

function salvarDados() {
    localStorage.setItem("discosCadastrados", JSON.stringify(produtos));
}

function mostrarTela(tela) {
    document.getElementById("telaCadastroDisco").hidden = true;
    document.getElementById("telaListaDiscos").hidden = true;
    document.getElementById("telaExcluirDisco").hidden = true;
    document.getElementById(tela).hidden = false;
}

function gerarCodigo() {
    let codigo = "";
    let caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let repetido;

    do {
        codigo = "";

        for (let i = 0; i < 4; i++) {
            codigo += caracteres[Math.floor(Math.random() * caracteres.length)];
        }

        repetido = false;

        for (let i = 0; i < produtos.length; i++) {
            if (produtos[i].codigo === codigo) {
                repetido = true;
            }
        }
    } while (repetido);

    return codigo;
}

function limparFormulario() {
    document.getElementById("formularioDisco").reset();
    document.getElementById("tituloFormulario").innerText = "Cadastro de produtos";
    document.getElementById("botaoSalvar").innerText = "Cadastrar produto";
    document.getElementById("mensagemErro").innerText = "";
    indiceEdicao = -1;
}

document.getElementById("formularioDisco").addEventListener("submit", function(event) {
    event.preventDefault();

    let nome = document.getElementById("nomeDisco").value.trim();
    let descricao = document.getElementById("descricaoDisco").value.trim();
    let preco = document.getElementById("precoDisco").value.trim().replace(",", ".");
    let imagem = document.getElementById("nomeImagem").value.trim().toLowerCase();
    let erro = document.getElementById("mensagemErro");

    if (!nome || !descricao || !preco || !imagem) {
        erro.innerText = "Preencha todos os campos!";
    } else if (nome.length < 5) {
        erro.innerText = "O nome precisa ter pelo menos 5 caracteres.";
    } else if (isNaN(Number(preco)) || Number(preco) <= 0) {
        erro.innerText = "Digite um preço válido.";
    } else if (imagem.length > 10 || !imagens[imagem]) {
        erro.innerText = "Digite um nome de imagem válido.";
    } else {
        let codigo;

        if (indiceEdicao === -1) {
            codigo = gerarCodigo();
        } else {
            codigo = produtos[indiceEdicao].codigo;
        }

        let produto = { codigo, nome, descricao, preco, imagem };

        if (indiceEdicao === -1) {
            produtos.push(produto);
            salvarDados();
            limparFormulario();
            mostrarTela("telaCadastroDisco");
        } else {
            produtos[indiceEdicao] = produto;
            salvarDados();
            mostrarLista();
        }
    }
});

function mostrarLista() {
    let lista = document.getElementById("listaDiscos");
    lista.innerHTML = "";

    for (let i = 0; i < produtos.length; i++) {
        let p = produtos[i];

        lista.innerHTML += `
            <tr>
                <td>${p.codigo}</td>
                <td>
                    <img class="imagem-produto" src="imagens/${imagens[p.imagem]}" alt="${p.nome}">
                    <br>${p.nome}<br>R$ ${p.preco}
                </td>
                <td>${p.descricao}</td>
                <td class="acoes-tabela">
                    <button class="botao-editar" onclick="editarProduto(${i})">Editar</button>
                    <button class="botao-excluir" onclick="confirmarExclusao(${i})">Excluir</button>
                </td>
            </tr>`;
    }

    if (produtos.length === 0) {
        lista.innerHTML = '<tr><td colspan="4">Nenhum produto cadastrado.</td></tr>';
    }

    mostrarTela("telaListaDiscos");
}

function editarProduto(i) {
    let p = produtos[i];
    indiceEdicao = i;

    document.getElementById("nomeDisco").value = p.nome;
    document.getElementById("descricaoDisco").value = p.descricao;
    document.getElementById("precoDisco").value = p.preco;
    document.getElementById("nomeImagem").value = p.imagem;
    document.getElementById("tituloFormulario").innerText = "Alterar produto";
    document.getElementById("botaoSalvar").innerText = "Salvar alterações";
    document.getElementById("mensagemErro").innerText = "";

    mostrarTela("telaCadastroDisco");
}

function confirmarExclusao(i) {
    indiceExclusao = i;
    let p = produtos[i];

    document.getElementById("detalhesDisco").innerHTML = `
        <img src="imagens/${imagens[p.imagem]}" alt="${p.nome}">
        <p><b>Código:</b> ${p.codigo}</p>
        <p><b>Produto:</b> ${p.nome}</p>
        <p><b>Descrição:</b> ${p.descricao}</p>
        <p><b>Preço:</b> R$ ${p.preco}</p>`;

    mostrarTela("telaExcluirDisco");
}

document.getElementById("botaoExcluir").addEventListener("click", function() {
    if (indiceExclusao !== -1 && confirm("Deseja realmente excluir este produto?")) {
        produtos.splice(indiceExclusao, 1);
        salvarDados();
        indiceExclusao = -1;
        mostrarLista();
    }
});

document.getElementById("botaoVoltar").addEventListener("click", function() {
    indiceExclusao = -1;
    mostrarLista();
});

document.getElementById("botaoNovo").addEventListener("click", function() {
    limparFormulario();
    mostrarTela("telaCadastroDisco");
});

document.getElementById("botaoCancelar").addEventListener("click", function() {
    limparFormulario();
    mostrarLista();
});

document.getElementById("botaoVerLista").addEventListener("click", mostrarLista);

limparFormulario();