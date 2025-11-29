const API_URL =
  "https://script.google.com/macros/s/AKfycbyxlxmbhTxTFlgjfGmKQ2pkv3hkAUF7gZiSzU5i-jm34IGGz7huJADFCuJt3KUfQejO/exec";

/* Alternar abas */
function openTab(name) {
  document
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.remove("active"));
  document
    .querySelectorAll(".content")
    .forEach((c) => c.classList.remove("active"));
  document
    .querySelector(`.tab[onclick="openTab('${name}')"]`)
    .classList.add("active");
  document.getElementById(name).classList.add("active");
}

/* 🌙 Modo escuro + troca da logo */
function toggleDark() {
  document.body.classList.toggle("dark");

  const preto = document.querySelector(".logo-preto");
  const branco = document.querySelector(".logo-branco");

  if (document.body.classList.contains("dark")) {
    preto.style.opacity = "0";
    branco.style.opacity = "1";
  } else {
    preto.style.opacity = "1";
    branco.style.opacity = "0";
  }
}
/* Enviar pedido */
async function enviarPedido() {
  let nome = document.getElementById("nome").value.trim();
  const pedido = document.getElementById("pedido").value.trim();

  if (!pedido) {
    alert("Escreva seu pedido de oração.");
    return;
  }

  if (!nome) nome = "Anônimo";

  document.getElementById("status").innerText = "Enviando...";

  try {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ nome, pedido }),
      cache: "no-store",
    });

    document.getElementById("status").innerText = "🙏 Pedido enviado!";
    document.getElementById("nome").value = "";
    document.getElementById("pedido").value = "";

    carregarPedidos();
    openTab("lista");
  } catch {
    document.getElementById("status").innerText = "Erro ao enviar.";
  }
}

/* Carregar pedidos */
async function carregarPedidos() {
  const container = document.getElementById("listaContainer");
  container.innerHTML = "<p>Carregando...</p>";

  try {
    const res = await fetch(API_URL + "?nocache=" + Date.now(), {
      cache: "no-store",
    });
    const dados = await res.json();

    container.innerHTML = "";

    // Se não houver pedidos
    if (!dados || dados.length === 0) {
      container.innerHTML = `
                <p style="text-align:center; opacity:0.7; margin-top:20px;">
                    Ainda não há pedidos 🙏
                </p>`;
      return;
    }

    // Renderizar pedidos
    dados.forEach((item) => {
      container.innerHTML += `
                <div class="card">
                    <h3>${item.nome}</h3>
                    <p>${item.pedido}</p>
                    <div class="date">${item.data}</div>
                </div>`;
    });
  } catch (e) {
    container.innerHTML = `
            <p style="text-align:center; color:gray;">
                Ainda não há pedidos.
            </p>`;
  }
}

carregarPedidos();

/* 🔄 Atualização automática */
let ultimoTotal = 0;

// Verifica novos pedidos a cada 10 segundos
setInterval(async () => {
  try {
    const res = await fetch(API_URL + "?check=" + Date.now(), {
      cache: "no-store",
    });
    const dados = await res.json();

    if (dados.length !== ultimoTotal) {
      ultimoTotal = dados.length;
      carregarPedidos(); // Atualiza a tela automaticamente
    }
  } catch {
    console.log("Erro ao verificar novos pedidos.");
  }
}, 10000);

// Fim do script.js
