   // ---- utilidades ----
    const jurosTexto = {
    carne:  'CARNÊ TX A.M 6,9%  TX A.A 122,71%',
    cartao: 'CARTÃO TX A.M 2,92%  TX A.A 41,25%',
    virado: 'CARNÊ E CARTÃO TX A.M 2,92%  TX A.A 41,25%'
  };

  // máscara do campo código (apenas números e "/")
  const codigoTel = document.querySelector('input[type="tel"]');
  if (codigoTel) {
    codigoTel.addEventListener('input', () => {
      codigoTel.value = codigoTel.value.replace(/[^0-9\/]/g, '');
    });
  }

  const brl = n => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(+n || 0);

  function formatDateISOToBR(iso) {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
  }

  function fitTextToWidth(el, { minPx = 12 } = {}) {
    if (!el) return;
    const cs = getComputedStyle(el);
    let size = parseFloat(cs.fontSize) || 12;
    const maxLoops = 300; let loops = 0;
    while ((el.scrollWidth > el.clientWidth) && size > minPx && loops < maxLoops) {
      size -= 1;
      el.style.fontSize = size + 'px';
      loops++;
    }
  }

  const selectJuros = document.getElementById("juros");
const grupoCampanha = document.getElementById("grupo-campanha");

selectJuros.addEventListener("change", () => {
  if (selectJuros.value === "virado") {
    grupoCampanha.style.display = "block"; // mostra
  } else {
    grupoCampanha.style.display = "none"; // esconde
    document.getElementById("campanha").value = ""; // limpa se não for usado
  }
});

  // scroll do carrossel
  function scrollNext() {
    const container = document.getElementById("previews");
    container.scrollBy({ left: container.clientWidth, behavior: "smooth" });
  }
  function scrollPrev() {
    const container = document.getElementById("previews");
    container.scrollBy({ left: -container.clientWidth, behavior: "smooth" });
  }
  window.scrollNext = scrollNext;
  window.scrollPrev = scrollPrev;

  // validação de limite de 35 chars da descrição
  const descricaoInput = document.getElementById("descricao");
  const descricaoErro  = document.getElementById("descricao-erro");
  if (descricaoInput) {
    descricaoInput.addEventListener("input", () => {
      if (descricaoInput.value.length > 35) {
        descricaoErro.style.display = "block";
        descricaoInput.style.borderColor = "red";
      } else {
        descricaoErro.style.display = "none";
        descricaoInput.style.borderColor = "";
      }
    });
  }

  // habilita/desabilita o campo "parcela" conforme método
function updateMetodo() {
  const metodo = document.getElementById("metodo").value;
  const parcelaInputEl = document.getElementById("parcela");
  const jurosSelect = document.getElementById("juros");

  // Bloquear ou liberar campo de parcela
  if (metodo === "R$" || metodo === "5x" || metodo === "3x") {
    parcelaInputEl.disabled = true;
    parcelaInputEl.required = false;
    parcelaInputEl.value = "";
  } else {
    parcelaInputEl.disabled = false;
    parcelaInputEl.required = true;
  }


  if (metodo === "3x" || metodo === "5x" || metodo === "R$" || metodo === "10x") {
    if (jurosSelect) {
      jurosSelect.disabled = true;
      try { jurosSelect.selectedIndex = 0; } catch(e) { /* ignora */ }
    }
  } else {
    if (jurosSelect) {
      jurosSelect.disabled = false;
    }
  }
}

  // mostra/esconde campos extras conforme juros
  function updateExtras() {
    const tipo = document.getElementById('juros').value; 
    const campanhaGroup    = document.getElementById('campanha').closest('.input-group');
    const validadeGroup    = document.getElementById('validade').closest('.input-group');
    const autorizacaoGroup = document.getElementById('autorizacao').closest('.input-group');

    [campanhaGroup, validadeGroup, autorizacaoGroup].forEach(g => {
      g.style.display = 'none';
      const inp = g.querySelector('input');
      if (inp) inp.required = false;
    });

    if (tipo === 'cartao') {
      campanhaGroup.style.display = 'block';
      validadeGroup.style.display = 'block';
      campanhaGroup.querySelector('input').required = true;
      validadeGroup.querySelector('input').required = true;
    } else if (tipo === 'virado') {
  campanhaGroup.style.display = 'block';
  autorizacaoGroup.style.display = 'block';
  
  campanhaGroup.querySelector('input').required = false; // opcional
  autorizacaoGroup.querySelector('input').required = false; // opcional
}
  }

  document.getElementById("metodo").addEventListener("change", updateMetodo);
  document.getElementById("juros").addEventListener("change", updateExtras);
  window.addEventListener("DOMContentLoaded", () => {
    updateMetodo();
    updateExtras();
  });

  // ---- adicionar preview ----
function adicionarProduto() {
  const codigo  = document.getElementById("codigo").value.trim();
  const descricao = document.getElementById("descricao").value.trim().toUpperCase();
  const marca   = document.getElementById("marca").value.trim().toUpperCase();
  const metodo  = document.getElementById("metodo").value;
  const tipo    = document.getElementById("juros").value;

  const parcelaInput = parseMoney(document.getElementById("parcela").value);
  let avista  = parseMoney(document.getElementById("avista").value);
  const campanha = (document.getElementById("campanha").value || '').trim().toUpperCase();
  const validade = (document.getElementById("validade").value || '').trim();
  const autorizacao = (document.getElementById("autorizacao").value || '').trim().toUpperCase();

  const g12 = parseMoney(document.getElementById("garantia12").value);
  const g24 = parseMoney(document.getElementById("garantia24").value);
  const g36 = parseMoney(document.getElementById("garantia36").value);

  const garantia12 = { cheio: g12 };
  const garantia24 = { cheio: g24 };
  const garantia36 = { cheio: g36 };

  // ---- VALIDAÇÕES BÁSICAS ----
  if (!codigo || !descricao || !marca) {
    mostrarAvisoComBarra("Insira código, descrição e marca válidos!", 5000);
    return;
  }
if ((metodo === "10x" || metodo === "12x") && parcelaInput <= 0) {
    mostrarAvisoComBarra("Informe o valor da parcela!", 5000, "#f44336", "#b71c1c");
    document.getElementById("parcela").focus();
    return;
  }
  if ((metodo === "R$" || metodo === "5x") && avista <= 0) {
    mostrarAvisoComBarra("Informe o valor à vista!", 5000, "#f44336", "#b71c1c");
    document.getElementById("avista").focus();
    return;
  }


  const garantiasPresentes = g12 > 0 || g24 > 0 || g36 > 0;

  // ---- FUNÇÃO PRINCIPAL PARA CRIAR O PREVIEW ----
  function criarPreview(cartazSelecionado = "cartaz1") {
    const fator = (tipo === "carne" || tipo === "virado") ? 0.1252 : 0.1000;
    const calcGarantia = valor => valor ? valor * fator : 0;

    garantia12.parcela = calcGarantia(g12);
    garantia12.total = garantia12.parcela * 12;
    garantia24.parcela = calcGarantia(g24);
    garantia24.total = garantia24.parcela * 12;
    garantia36.parcela = calcGarantia(g36);
    garantia36.total = garantia36.parcela * 12;

    let parcela = parcelaInput;
    let prazoTexto = "";
    let mostrarJuros = true;

    if (metodo === "5x") {
      parcela = avista / 5;
      prazoTexto = avista < 180 ? "SEM JUROS!" : `Total à prazo: ${brl(parcela * 5)}`;
    } else if (metodo === "10x") {
      if (!avista) avista = parcela * 10; 
      prazoTexto = `SEM JUROS!`;
    } else if (metodo === "12x") {
      if (!avista) avista = parcela * 12;
      prazoTexto = `Total à prazo: ${brl(parcela * 12)}`;
    } else if (metodo === "R$") {
      parcela = avista;
      prazoTexto = "";
      mostrarJuros = false;
    }

    const titulo = `${codigo} – ${descricao} – ${marca}`;
    const taxa1 = tipo === "carne" ? "6,9"   : "2,92";
    const taxa2 = tipo === "carne" ? "122,71": "41,25";

    let garantiasHTML = "";
    if (garantia12.cheio > 0) {
      garantiasHTML += `
        <div class="g12-numero">12</div>
        <div class="g12-parcela">${formatNumber(garantia12.parcela)}</div>
        <div class="g12-total">${formatNumber(garantia12.total)}</div>
        <div class="g12-cheio">${formatNumber(garantia12.cheio)}</div>
        <div class="g12-taxa1">${taxa1}</div>
        <div class="g12-taxa2">${taxa2}</div>
      `;
    }
    if (garantia24.cheio > 0) {
      garantiasHTML += `
        <div class="g24-numero">12</div>
        <div class="g24-parcela">${formatNumber(garantia24.parcela)}</div>
        <div class="g24-total">${formatNumber(garantia24.total)}</div>
        <div class="g24-cheio">${formatNumber(garantia24.cheio)}</div>
        <div class="g24-taxa1">${taxa1}</div>
        <div class="g24-taxa2">${taxa2}</div>
      `;
    }
    if (garantia36.cheio > 0) {
      garantiasHTML += `
        <div class="g36-numero">12</div>
        <div class="g36-parcela">${formatNumber(garantia36.parcela)}</div>
        <div class="g36-total">${formatNumber(garantia36.total)}</div>
        <div class="g36-cheio">${formatNumber(garantia36.cheio)}</div>
        <div class="g36-taxa1">${taxa1}</div>
        <div class="g36-taxa2">${taxa2}</div>
      `;
    }

    // ---- CRIAÇÃO DO PREVIEW ----
    const wrapper = document.createElement("div");
    wrapper.className = "doc-wrapper";
    wrapper.style.position = "relative";

    const div = document.createElement("div");
    div.className = "doc";
    div.innerHTML = `
      ${campanha ? `<div class="out-campanha">${campanha}</div>` : ""}
      <div class="out-titulo">${titulo}</div>
      ${validade ? `<div class="out-validade">Validade: ${formatDateISOToBR(validade)}</div>` : ""}
      ${autorizacao ? `<div class="out-autorizacao">${autorizacao}</div>` : ""}
      <div class="out-metodo">${metodo}</div>
      <div class="out-parcela">${parcela ? parcela.toLocaleString("pt-BR", { minimumFractionDigits: 2 }) : ""}</div>
      ${prazoTexto ? `<div class="out-prazo">${prazoTexto}</div>` : ""}
      <div class="out-avista">${metodo === "R$" ? "À Vista" : (avista ? brl(avista) + " À Vista" : "À Vista")}</div>
      ${mostrarJuros ? `<div class="out-juros">${jurosTexto[tipo]}</div>` : ""}
      ${garantiasHTML}
    
    `;

    // ---- BOTÃO EXCLUIR ----
    const btnExcluir = document.createElement("button");
    btnExcluir.innerHTML = `<i class="fa-solid fa-trash"></i>`;
    Object.assign(btnExcluir.style, {
      position: "absolute",
      top: "10px",
      right: "10px",
      background: "#ff4d4d",
      border: "none",
      borderRadius: "50%",
      color: "white",
      fontSize: "18px",
      cursor: "pointer",
      width: "48px",
      height: "48px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
      transition: "all 0.3s ease"
    });
    btnExcluir.addEventListener("click", () => wrapper.remove());
    

    div.appendChild(btnExcluir);
    wrapper.appendChild(div);
    document.getElementById("previews").appendChild(wrapper);
    aplicarPosicoesGarantias(wrapper, cartazSelecionado);

    // ---- AJUSTES DE TEXTO ----
    fitTextToWidth(div.querySelector('.out-parcela'), { minPx: 60 });
    fitTextToWidth(div.querySelector('.out-titulo'),  { minPx: 12 });
    fitTextToWidth(div.querySelector('.out-campanha'),{ minPx: 12 });
    fitTextToWidth(div.querySelector('.out-avista'),  { minPx: 12 }); 
    fitTextToWidth(div.querySelector('.out-prazo'),   { minPx: 12 });

    // ---- RESET INPUTS ----
    ["codigo","descricao","marca","parcela","avista","campanha","validade","autorizacao",
     "garantia12","garantia24","garantia36"]
      .forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; });
    document.getElementById("garantia24").disabled = true;
    document.getElementById("garantia36").disabled = true;

    // ---- LIMITE DE CARTAZES ----
    const total = document.getElementById("previews").children.length;
    if (total >= 16) {
      mostrarAvisoComBarra(
        "⚠️ Você atingiu o limite de 16 cartazes! Gerando PDF automaticamente...",
        6000,
        "#ff9800",
        "#e65100",
        false,
        null,
        "top"
      );
      setTimeout(() => {
        gerarPDF();
        document.getElementById("previews").innerHTML = "";
      }, 1500);
    }
  }

  if (garantiasPresentes) {
  abrirPopupCartaz(cartazSelecionado => {
    criarPreview(cartazSelecionado); 
  });
} else {
  criarPreview(); 
}
}

function abrirPopupCartaz(callback) {
  // Criar overlay
  const overlay = document.createElement("div");
  overlay.id = "popup-overlay";
  Object.assign(overlay.style, {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  });

  // Criar modal
  const modal = document.createElement("div");
  Object.assign(modal.style, {
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    minWidth: "320px"
  });

  const titulo = document.createElement("h3");
  titulo.innerText = "Escolha o cartaz para as garantias";
  modal.appendChild(titulo);

  const cartazes = [
    { nome: "Azul padrão", img: "Imagens/cartazes-1.png", id: "cartaz1" },
    { nome: "Promocional", img: "Imagens/cartazes-2.png", id: "cartaz2" },
    { nome: "MegaFeirão", img: "Imagens/cartazes-3.png", id: "cartaz3" }
  ];

  const container = document.createElement("div");
  Object.assign(container.style, {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
    marginTop: "15px"
  });

  cartazes.forEach(c => {
    const btn = document.createElement("button");
    Object.assign(btn.style, {
      border: "1px solid #ccc",
      borderRadius: "6px",
      padding: "5px",
      cursor: "pointer",
      background: "#f9f9f9",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "90px",
      overflow: "hidden"
    });

    const img = document.createElement("img");
    img.src = c.img;
    img.alt = c.nome;
    Object.assign(img.style, {
      width: "100%",
      height: "110px",
      objectFit: "cover",
      borderRadius: "4px",
      marginBottom: "5px"
    });

    const label = document.createElement("span");
    label.innerText = c.nome;
    Object.assign(label.style, {
      fontSize: "12px",
      color: "#333"
    });

    btn.appendChild(img);
    btn.appendChild(label);

    btn.addEventListener("click", () => {
      callback(c.id); // <-- aqui chamamos o callback com o cartaz escolhido
      document.body.removeChild(overlay); // fecha popup
    });

    container.appendChild(btn);
  });

  modal.appendChild(container);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

function aplicarPosicoesGarantias(wrapper, cartazSelecionado) {
  const posicoesExtras = {
   cartaz2: {
  "g12-numero": ["250.9px", "996.9px"],
  "g12-parcela": ["315.6px", "996.9px"],
  "g12-total": ["315.6px", "1013.6px"],
  "g12-cheio": ["415.7px", "996.9px"],
  "g12-taxa1": ["387.2px", "1014.8px"],
  "g12-taxa2": ["435.8px", "1014.8px"],

  "g24-numero": ["250.9px", "1040.2px"],
  "g24-parcela": ["315.6px", "1040.2px"],
  "g24-total": ["315.6px", "1054.9px"],
  "g24-cheio": ["411.6px", "1040.2px"],
  "g24-taxa1": ["387.2px", "1057.3px"],
  "g24-taxa2": ["435.8px", "1057.3px"],

  "g36-numero": ["523.5px", "1015.1px"],
  "g36-parcela": ["581.6px", "1015.1px"],
  "g36-total": ["581.6px", "1032.1px"],
  "g36-cheio": ["680.3px", "1015.1px"],
  "g36-taxa1": ["661.2px", "1032.5px"],
  "g36-taxa2": ["706.8px", "1032.5px"]
},

cartaz3: {
  "g12-numero": ["230.7px", "1001.6px"],
  "g12-parcela": ["302.4px", "1001.6px"],
  "g12-total": ["302.4px", "1013.6px"],
  "g12-cheio": ["408.7px", "1001.6px"],
  "g12-taxa1": ["394.9px", "1019.9px"],
  "g12-taxa2": ["445.6px", "1019.9px"],

  "g24-numero": ["230.7px", "1047.2px"],
  "g24-parcela": ["296.8px", "1047.2px"],
  "g24-total": ["296.8px", "1059.7px"],
  "g24-cheio": ["408.7px", "1049.5px"],
  "g24-taxa1": ["386.7px", "1069.2px"],
  "g24-taxa2": ["438.0px", "1069.2px"],

  "g36-numero": ["536.4px", "1023.3px"],
  "g36-parcela": ["596.3px", "1023.3px"],
  "g36-total": ["596.3px", "1035.5px"],
  "g36-cheio": ["708.6px", "1023.3px"],
  "g36-taxa1": ["690.4px", "1035.5px"],
  "g36-taxa2": ["744.8px", "1035.0px"]
}

  };

  // Reseta para padrão (cartaz1)
  if (cartazSelecionado === "cartaz1") {
    wrapper.querySelectorAll("[class*='g12-'], [class*='g24-'], [class*='g36-']").forEach(el => {
      el.style.left = "";
      el.style.top = "";
    });
    return;
  }

  // Aplica os ajustes do cartaz selecionado
  const ajustes = posicoesExtras[cartazSelecionado];
  for (const cls in ajustes) {
    wrapper.querySelectorAll(`.${cls}`).forEach(el => {
      el.style.left = ajustes[cls][0];
      el.style.top = ajustes[cls][1];
    });
  }
}


function contarCartazes() {
  const container = document.getElementById("previews");
  const total = container.children.length;

  // ⚠️ aviso geral
  if (total >= 10 && (total === 10 || (total - 10) % 5 === 0)) {
    mostrarAvisoComBarra(
      `⚠️ Você já adicionou ${total} cartazes! Imprimir essa quantidade pode causar erro.`,
      6000,
      "#ff9800",
      "#e65100",
      false,
      null,
      "top"
    );
  }


  if (total >= 16) {
    mostrarAvisoComBarra(
      `📄 Limite atingido! Gerando PDF automaticamente com ${total} cartazes.`,
      5000,
      "#2196f3",
      "#0d47a1"
    );
    gerarPDF(); 
    return false; 
  }

  return true; 
}


function mostrarAvisoComBarra(
  msg,
  duracao = 5000,
  cor = "#4caf50",
  corBarra = "#2e7d32",
  incluirUndo = false,
  callbackUndo = null,
  posicao = "bottom" // "bottom" ou "top"
) {
  const aviso = document.createElement("div");
  aviso.innerHTML = incluirUndo
    ? `<span class="msg">${msg}</span> <button class="undo-btn" type="button">Desfazer</button>`
    : `<span class="msg">${msg}</span>`;

  Object.assign(aviso.style, {
    position: "fixed",
    left: "50%",
    transform: "translateX(-50%) translateY(20px)",
    background: cor,
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "8px",
    fontWeight: "bold",
    zIndex: 1000,
    textAlign: "center",
    opacity: 0,
    minWidth: "300px",
    maxWidth: "400px",
    boxShadow: "0 8px 24px rgba(0,0,0,.2)",
    overflow: "hidden",
    transition: "opacity .35s ease, transform .35s ease",
    ...(posicao === "top" ? { top: "20px" } : { bottom: "20px" })
  });

  const barra = document.createElement("div");
  Object.assign(barra.style, {
    position: "absolute",
    bottom: "0",
    left: "0",
    height: "4px",
    background: corBarra,
    width: "100%",
    transition: `width ${duracao}ms linear`
  });
  aviso.appendChild(barra);

  document.body.appendChild(aviso);

  // botão desfazer
  if (incluirUndo && callbackUndo) {
    const btn = aviso.querySelector(".undo-btn");
    Object.assign(btn.style, {
      marginLeft: "10px",
      background: "transparent",
      color: "#fff",
      border: "2px solid #fff",
      borderRadius: "6px",
      padding: "4px 10px",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "all 0.2s ease"
    });
    btn.addEventListener("mouseenter", () => { btn.style.background = "#fff"; btn.style.color = cor; });
    btn.addEventListener("mouseleave", () => { btn.style.background = "transparent"; btn.style.color = "#fff"; });
    btn.addEventListener("click", () => {
      clearTimeout(fecharTimer); 
      callbackUndo();
      removerAviso();
    });
  }

  const removerAviso = () => {
    aviso.style.opacity = 0;
    aviso.style.transform = "translateX(-50%) translateY(20px)";
    aviso.addEventListener("transitionend", () => {
      if (aviso.parentElement) aviso.remove();
    }, { once: true });
  };

  let fecharTimer = setTimeout(removerAviso, duracao);

  // anima entrada
  requestAnimationFrame(() => {
    aviso.style.opacity = 1;
    aviso.style.transform = "translateX(-50%) translateY(0)";
    barra.style.width = "0%";
  });
}

  function avisoProdutoAdicionado() {
  mostrarAvisoComBarra("Produto adicionado com sucesso!", 4000, "#4caf50", "#2e7d32");
}

function avisoProdutoRemovido(wrapper) {
  mostrarAvisoComBarra("Produto removido", 5000, "#f44336", "#b71c1c", true, () => {
    const container = document.getElementById("previews");
    if (!container) return;

    // recoloca e reanima
    container.appendChild(wrapper);
    wrapper.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    wrapper.style.opacity = "0";
    wrapper.style.transform = "scale(0.9)";
    requestAnimationFrame(() => {
      wrapper.style.opacity = "1";
      wrapper.style.transform = "scale(1)";
    });
  });
}

  async function gerarPDF() {
  const docs = document.querySelectorAll(".doc");
  if (!docs.length) {
    mostrarAvisoComBarra("Adicione pelo menos um produto!", 5000);
    return;
  }

  mostrarOverlay();
  atualizarOverlayTexto("📄 Gerando PDF...");

 
  const formato = document.getElementById("formato").value;
  const pdf = new window.jspdf.jsPDF("p", "mm", formato === "a6" ? "a4" : formato);

  let pageW = 210, pageH = 297;
  let offsetX = 0, offsetY = 0;

  if (formato === "a5") {
    pageW = 148;
    pageH = 210;
  }
  if (formato === "a6") {
    pageW = 105;
    pageH = 148;
    offsetX = 20; 
    offsetY = 20;
  }

  for (let i = 0; i < docs.length; i++) {
    atualizarOverlayTexto(`📄 Processando cartaz ${i + 1} de ${docs.length}...`);

    const clone = docs[i].cloneNode(true);
    const botoes = clone.querySelectorAll("button, .fa-trash, .lixeira");
    botoes.forEach(btn => btn.style.display = "none");

    Object.assign(clone.style, {
      border: "none",
      background: "#fff",
      position: "absolute", left: "-99999px", top: "0",
      width: "210mm", height: "297mm", overflow: "hidden"
    });
    document.body.appendChild(clone);

    const canvas = await html2canvas(clone, { scale: 2, backgroundColor: "#fff" });
    const img = canvas.toDataURL("image/jpeg", 1.0);

    if (i > 0) pdf.addPage();
    pdf.addImage(img, "JPEG", offsetX, offsetY, pageW, pageH);

    document.body.removeChild(clone);
  }

  pdf.save("cartazes.pdf");

  atualizarOverlayTexto("✅ PDF gerado com sucesso!");
  setTimeout(esconderOverlay, 1500);
}

  // exporta para os botões do HTML
  window.adicionarProduto = adicionarProduto;
  window.gerarPDF = gerarPDF;


 const API_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLic4iE63JAJ0j4KpGWfRFINeiD4uyCsMjfF_uLkUNzhOsJMzO4uiiZpWV3xzDjbduZK8kU_wWw3ZSCs6cODW2gdFnIGb6pZ0Lz0cBqMpiV-SBOJroENJHqO1XML_YRs_41KFfQOKEehUQmf-Xg6Xhh-bKiYpPxxwQhQzEMP5g0DdJHN4sgG_Fc9cdvRRU4abxlz_PzeQ_5eJ7NtCfxWuP-ET0DEzUyiWhWITlXMZKJMfwmZQg5--gKmAEGpwSr0yXi3eycr23BCGltlXGIWtYZ3I0WkWg&lib=M38uuBDbjNiNXY1lAK2DF9n3ltsPa6Ver";

 

function parseMoney(valor) {
  if (!valor) return 0;

  let original = valor.toString();


  let limpo = original
    .replace(/R\$/g, "")
    .replace(/\s+/g, "")
    .replace(/\u00A0/g, "");

  let somenteNumeros = limpo.replace(/[^\d,.-]/g, "");


  somenteNumeros = somenteNumeros.replace(/\.(?=\d{3}(,|$))/g, "");


  somenteNumeros = somenteNumeros.replace(",", ".");

  const numero = parseFloat(somenteNumeros);

  return isNaN(numero) ? 0 : numero;
}




function preencherPagamentos(item) {
  const parcelaEl = document.getElementById("parcela");
  const avistaEl  = document.getElementById("avista");


  const parcelaRaw = item["Parcela"] || "";
  const avistaRaw  = item["Total à vista"] || "";

  const parcelaValor = parcelaRaw ? parseMoney(parcelaRaw).toFixed(2).replace('.', ',') : "";
  const avistaValor  = avistaRaw  ? parseMoney(avistaRaw).toFixed(2).replace('.', ',')  : "";

  parcelaEl.value = parcelaValor;
  avistaEl.value  = avistaValor;
}



async function carregarDadosPorCodigo(codigoBuscado) {
  try {
    const resposta = await fetch(API_URL);
    if (!resposta.ok) throw new Error("Erro ao acessar a API");
    
    const dados = await resposta.json();
    const output = document.getElementById("output");
    output.innerHTML = "";

    let encontrado = false;
    let primeiroItem = null;

    ["Gabriel", "Júlia", "Giovana"].forEach(nome => {
      if (dados[nome]) {
        dados[nome].forEach(item => {
          if (item.Código == codigoBuscado) {
            encontrado = true;
            if (!primeiroItem) primeiroItem = item;
          }
        });
      }
    });

    if (encontrado) {
      output.textContent = "✔ Código encontrado!";
      output.style.color = "green";
    } else {
      output.textContent = "❌ Código não encontrado!";
      output.style.color = "red";
      return false;
    }

    if (primeiroItem) {
  const partes = (primeiroItem.Descrição || "").split(" - ");
  document.getElementById("descricao").value = (partes[0] || "").trim();
  document.getElementById("marca").value = (partes[1] || "").trim();

  preencherPagamentos(primeiroItem);

  // Garantia puxada da planilha (coluna "Tot. G.E 12")
  if (primeiroItem["Tot. G.E 12"]) {
    document.getElementById("garantia12").value = parseMoney(primeiroItem["Tot. G.E 12"]).toFixed(2).replace(".", ",");
    document.getElementById("garantia24").disabled = false; // libera o próximo
  }

  updateMetodo();
}

    return true; 

  } catch (err) {
    console.error(err);
    const output = document.getElementById("output");
    output.textContent = "Erro ao carregar dados.";
    output.style.color = "red";
    return false; 
  }
}


const btnBuscar = document.getElementById("btn-buscar");
const inputCodigo = document.getElementById("codigo");

btnBuscar.addEventListener("click", async () => {
  const codigo = inputCodigo.value.trim();
  if (!codigo) return;

  mostrarOverlay();
  atualizarOverlayTexto("🔍 Iniciando busca...");

  try {
    const encontrado = await carregarDadosPorCodigo(codigo);

    if (encontrado) {
      atualizarOverlayTexto("✅ Produto encontrado!");
      await new Promise(res => setTimeout(res, 1000)); 
      atualizarOverlayTexto("📄 Inserindo dados...");
    } else {
      atualizarOverlayTexto("❌ Produto não encontrado.");
      await new Promise(res => setTimeout(res, 1500));
    }
  } catch (e) {
    console.error(e);
    document.getElementById("output").textContent = "Erro ao buscar dados.";
    atualizarOverlayTexto("⚠ Erro ao buscar dados.");
    await new Promise(res => setTimeout(res, 1500));
  } finally {
    await new Promise(res => setTimeout(res, 1000));
    esconderOverlay();
  }
});

function atualizarOverlayTexto(msg) {
  const textoEl = document.getElementById("overlay-texto");
  if (textoEl) textoEl.textContent = msg;
}

inputCodigo.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); 
    btnBuscar.click();      
  }
});

function mostrarOverlay() {
  document.getElementById("overlay").classList.add("active");
}

function esconderOverlay() {
  document.getElementById("overlay").classList.remove("active");
}

function configurarGarantias() {
  const g12 = document.getElementById("garantia12");
  const g24 = document.getElementById("garantia24");
  const g36 = document.getElementById("garantia36");

  g12.addEventListener("input", () => {
    if (parseMoney(g12.value) > 0) {
      g24.disabled = false;
    } else {
      g24.value = "";
      g24.disabled = true;
      g36.value = "";
      g36.disabled = true;
    }
  });

  g24.addEventListener("input", () => {
  if (parseMoney(g24.value) > 0) {
    g36.disabled = false;
  } else {
    g36.value = "";
    g36.disabled = true;
  }
});
}

function formatNumber(n) {
  if (!n) return "0,00";
  return (+n).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}


window.addEventListener("DOMContentLoaded", configurarGarantias);

// === POPUP ===
const btnCartaz = document.getElementById("btn-cartaz");
const popupCartaz = document.getElementById("popup-cartaz");
const fecharPopup = document.getElementById("fechar-popup");

function abrirPopup() {
  popupCartaz.style.display = "flex";
  popupCartaz.classList.add("mostrar");
  popupCartaz.querySelector(".popup-content").classList.add("mostrar");
}

function fecharComAnimacao() {
  const content = popupCartaz.querySelector(".popup-content");
  popupCartaz.classList.remove("mostrar");
  content.classList.remove("mostrar");
  popupCartaz.classList.add("fechar");
  content.classList.add("fechar");

  setTimeout(() => {
    popupCartaz.style.display = "none";
    popupCartaz.classList.remove("fechar");
    content.classList.remove("fechar");
  }, 300);
  
  limparCampos();
}

btnCartaz.addEventListener("click", abrirPopup);
fecharPopup.addEventListener("click", fecharComAnimacao);

// fechar clicando fora do conteúdo
popupCartaz.addEventListener("click", (e) => {
  if (!e.target.closest(".popup-content")) fecharComAnimacao();
});

// ESC para fechar popup
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && window.getComputedStyle(popupCartaz).display !== 'none') {
    fecharComAnimacao();
  }
});

// === TABS COM SLIDE ===
(function() {
  const tabs = popupCartaz.querySelectorAll('.tabs .tab');
  const panels = popupCartaz.querySelectorAll('.tab-panel');

  if (!popupCartaz.querySelector('.tab-panel.active') && panels[0]) {
    panels[0].classList.add('active');
    tabs[0]?.classList.add('active');
  }

  function getActivePanel() {
    return popupCartaz.querySelector('.tab-panel.active') || null;
  }

  const panel = document.querySelector('.tab-panel[data-panel="cameba"]');
  resetCarregamento(panel);
iniciarCarregamento(panel);

function switchPanel(targetKey) {
  const current = getActivePanel();
  const next = Array.from(panels).find(p => p.dataset.panel === targetKey);
  if (!next || next === current) return;

  
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === targetKey));

  // Animação de saída da aba atual
  if (current) {
    current.classList.remove('active');
    current.classList.add('anim-leave');
    void current.offsetWidth;
    current.classList.add('anim-leave-active');

    current.addEventListener('transitionend', () => {
      current.classList.remove('anim-leave', 'anim-leave-active');
    }, { once: true });
  }

  // Animação de entrada da próxima aba
  next.classList.add('anim-enter');
  void next.offsetWidth;
  next.classList.add('anim-enter-active');

  next.addEventListener('transitionend', () => {
  next.classList.remove('anim-enter', 'anim-enter-active');
  next.classList.add('active');
}, { once: true });
}

  tabs.forEach(tab => {
    tab.addEventListener('click', () => switchPanel(tab.dataset.tab));
  });
})();

// === SANITIZAÇÃO DE INPUTS ===
const codigoInputs = ['cbx_codigo1','cbx_codigo2'].map(id => document.getElementById(id));
codigoInputs.forEach(inp => inp.addEventListener('input', () => {
  inp.value = inp.value.replace(/[^0-9\/]/g, '');
}));
codigoInputs.forEach(inp => {
  inp.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      buscarCamaBox();
    }
  });
});


// === FUNÇÕES DE BUSCA ===
async function buscarCamaBox() {
  const cod1 = document.getElementById('cbx_codigo1').value.trim();
  const cod2 = document.getElementById('cbx_codigo2').value.trim();
  if (!cod1 || !cod2) return;

  try {
    mostrarOverlay();
    atualizarOverlayTexto('🔍 Buscando itens...');

    const resp = await fetch(API_URL);
    if (!resp.ok) throw new Error('Falha ao acessar a API');
    const dados = await resp.json();

    const item1 = acharPorCodigo(dados, cod1);
    const item2 = acharPorCodigo(dados, cod2);

    if (!item1 || !item2) {
      mostrarAvisoComBarra('Código(s) não encontrado(s)', 4000, '#f44336', '#b71c1c');
      return;
    }

    // preenche campos
    setValue('cbx_desc1', item1['Descrição'] || '');
    setValue('cbx_desc2', item2['Descrição'] || '');

    const av1 = parseMoney(item1['Total à vista']) || 0;
    const av2 = parseMoney(item2['Total à vista']) || 0;

    setValue('cbx_avista1', brl(av1));
    setValue('cbx_avista2', brl(av2));

    const marcaSugerida = extrairMarca(item1['Descrição']);
    setValue('cbx_marca', (marcaSugerida || '').toUpperCase());

    const nome1 = extrairNome(item1['Descrição']);
    const nome2 = extrairNome(item2['Descrição']);
    const sugestao = montarSugestao(nome1, nome2);
    const descMontadaEl = document.getElementById('cbx_desc_montada');
    if (!descMontadaEl.value) descMontadaEl.value = sugestao;

    atualizarOverlayTexto('✅ Itens carregados!');
    await espera(800);
  } catch (err) {
    console.error(err);
    atualizarOverlayTexto('⚠️ Erro ao buscar');
    await espera(1200);
  } finally {
    esconderOverlay();
  }
}


// === HELPERS ===
function acharPorCodigo(dados, codigo) {
  const grupos = ['Gabriel','Júlia','Giovana'];
  for (const nome of grupos) {
    const lista = dados[nome] || [];
    const achou = lista.find(it => String(it['Código']) == String(codigo));
    if (achou) return achou;
  }
  return null;
}

function setValue(id, v) { const el = document.getElementById(id); if (el) el.value = v ?? ''; }
function extrairNome(desc='') { return (desc.split(' - ')[0] || '').trim(); }
function extrairMarca(desc='') { return (desc.split(' - ')[1] || '').trim(); }
function montarSugestao(n1, n2) { return [n1, n2].filter(Boolean).join(' + '); }
function espera(ms) { return new Promise(r => setTimeout(r, ms)); }


function arredondar90(valor) {
  const num = Number(valor);
  if (!isFinite(num) || num <= 0) return 0;


  const centavos = Math.floor(num * 100);      
  const k = Math.floor((centavos - 90) / 100);  
  const resultCentavos = Math.max(0, k * 100 + 90);
  return resultCentavos / 100;
}



const mcCodigo = document.getElementById('mc_codigoCad');
mcCodigo.addEventListener('input', () => {
  mcCodigo.value = mcCodigo.value.replace(/[^0-9]/g, '');
});


mcCodigo.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    buscarMesaCadeira();
  }
});

async function buscarMesaCadeira() {
  const codMesa   = document.getElementById('mc_codigoMesa').value.trim();
  const codCad    = document.getElementById('mc_codigoCad').value.trim();
  if (!codMesa || !codCad) return;

  try {
    mostrarOverlay();
    atualizarOverlayTexto('🔍 Buscando itens...');

    const resp = await fetch(API_URL);
    if (!resp.ok) throw new Error('Falha ao acessar a API');
    const dados = await resp.json();

    const itemMesa = acharPorCodigo(dados, codMesa);
    const itemCad  = acharPorCodigo(dados, codCad);

    if (!itemMesa || !itemCad) {
      mostrarAvisoComBarra('Código(s) não encontrado(s)', 4000, '#f44336', '#b71c1c');
      return;
    }

    // preenche campos individuais
    setValue('mc_descMesa', itemMesa['Descrição'] || '');
    setValue('mc_descCad', itemCad['Descrição'] || '');

    const av1 = parseMoney(itemMesa['Total à vista']) || 0;
    const av2 = parseMoney(itemCad['Total à vista']) || 0;

    setValue('mc_avistaMesa', brl(av1));
    setValue('mc_avistaCad', brl(av2));

    const marcaSugerida = extrairMarca(itemMesa['Descrição']); // pode pegar da mesa ou concatenar
    setValue('mc_marca', (marcaSugerida || '').toUpperCase());

    // monta a descrição combinada
    const nomeMesa = extrairNome(itemMesa['Descrição']);
    const nomeCad  = extrairNome(itemCad['Descrição']);
    const sugestao = montarSugestao(nomeMesa, nomeCad);
    const descMontadaEl = document.getElementById('mc_descMontada');
    if (!descMontadaEl.value) descMontadaEl.value = sugestao;

    atualizarOverlayTexto('✅ Itens carregados!');
    await espera(800);

  } catch (err) {
    console.error(err);
    atualizarOverlayTexto('⚠️ Erro ao buscar');
    await espera(1200);
  } finally {
    esconderOverlay();
  }
}

// === INPUTS SÓ NÚMEROS ===
const mcCodigoCad = document.getElementById('mc_codigoCad');
mcCodigoCad.addEventListener('input', () => {
  mcCodigoCad.value = mcCodigoCad.value.replace(/[^0-9]/g, '');
});

// === BUSCA AO ENTER ===
mcCodigoCad.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    e.preventDefault();
    buscarMesaCadeira();
  }
});

function limparCampos() {
  const ids = [
    'mc_codigoMesa', 'mc_codigoCad',
    'mc_descMesa', 'mc_descCad',
    'mc_avistaMesa', 'mc_avistaCad',
    'mc_descMontada', 'mc_marca',
    'cbx_codigo1', 'cbx_desc1',
    'cbx_avista1', 'cbx_garantia1',
    'cbx_codigo2', 'cbx_desc2',
    'cbx_avista2', 'cbx_garantia2',
    'cbx_desc_montada' , 'cbx_marca'
    
  ];

  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}


function limparCamposAtivos() {

  const abaAtiva = document.querySelector('.tab-panel.active');
  if (!abaAtiva) return;

  // Lista de campos por aba
  const camposPorAba = {
    'camabox': [
      'cbx_codigo1','cbx_codigo2',
      'cbx_desc1','cbx_desc2',
      'cbx_desc_montada','cbx_marca',
      'cbx_avista1','cbx_avista2',
      'cbx_garantia1','cbx_garantia2'
    ],
    'mesacad': [
      'mc_codigoMesa','mc_codigoCad',
      'mc_descMesa','mc_descCad',
      'mc_descMontada','mc_marca',
      'mc_avistaMesa','mc_avistaCad',
      'mc_garantia1','mc_garantia2'
    ]
  };

  const painel = abaAtiva.getAttribute('data-panel');
  const campos = camposPorAba[painel] || [];

  campos.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  mostrarAvisoComBarra("🧹 Campos limpos!", 2500, "#2196f3", "#1565c0");
}


const btnLimpar = document.querySelectorAll('button[id$="_clear"]');
btnLimpar.forEach(btn => btn.addEventListener('click', limparCamposAtivos));

function formatForInput(n) {
  if (!n && n !== 0) return "";
  return Number(n).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function getMcQty() {
  const r = document.querySelector('input[name="mc_qtd"]:checked');
  if (r) return Number(r.value) || 1;
  const s = document.getElementById('mc_qtd_select');
  if (s) return Number(s.value) || 1;
  return 1;
}

function adicionarNoFormComposto(tipo) {
  const formEl = document.getElementById('formulario');
  let cod1 = "", cod2 = "", desc = "", marca = "";
  let av1 = 0, av2 = 0, g1 = 0, g2 = 0;
  let avistaTotal = 0;
  let garantiaTotal = 0;
  let parcelaCalc = 0;

  if (tipo === 'cama') {
    cod1 = (document.getElementById('cbx_codigo1')?.value || '').trim();
    cod2 = (document.getElementById('cbx_codigo2')?.value || '').trim();
    desc = (document.getElementById('cbx_desc_montada')?.value || '').trim();
    marca = (document.getElementById('cbx_marca')?.value || '').trim();

    av1 = parseMoney(document.getElementById("cbx_avista1")?.value || 0);
    av2 = parseMoney(document.getElementById("cbx_avista2")?.value || 0);
    g1  = parseMoney(document.getElementById('cbx_garantia1')?.value || 0);
    g2  = parseMoney(document.getElementById('cbx_garantia2')?.value || 0);

    avistaTotal = av1 + av2;
    parcelaCalc = arredondar90(avistaTotal * 0.1252);
    garantiaTotal = g1 + g2;
  }

  if (tipo === 'mesa') {
    cod1 = (document.getElementById('mc_codigoMesa')?.value || '').trim();
    cod2 = (document.getElementById('mc_codigoCad')?.value || '').trim();
    desc = (document.getElementById('mc_descMontada')?.value || '').trim();
    marca = (document.getElementById('mc_marca')?.value || '').trim();

    av1 = parseMoney(document.getElementById('mc_avistaMesa')?.value || 0);
    av2 = parseMoney(document.getElementById('mc_avistaCad')?.value || 0);
    g1  = parseMoney(document.getElementById('mc-garantia1')?.value || 0); 
    g2  = parseMoney(document.getElementById('mc-garantia2')?.value || 0); 

    const qtd = getMcQty();
    avistaTotal = av1 + (av2 * qtd);
    parcelaCalc = arredondar90(avistaTotal * 0.1252);
    garantiaTotal = g1 + (g2 * qtd);
  }

  if (!cod1 && !cod2) {
    mostrarAvisoComBarra("Imposível buscar, insira os dois códigos!", 4000, "#f44336", "#b71c1c");
    return;
  }
  if (!desc && !marca) {
    mostrarAvisoComBarra("Campos faltando: 'Descrição Composta' ", 4000, "#f44336", "#b71c1c");
    return;
  }

  // preenche o formulário principal
  const codigoFinal = [cod1, cod2].filter(Boolean).join("/");
  document.getElementById('codigo').value = codigoFinal;
  document.getElementById('descricao').value = desc;
  document.getElementById('marca').value = marca;
  document.getElementById('avista').value = formatForInput(avistaTotal);
  document.getElementById('parcela').value = formatForInput(parcelaCalc);
  document.getElementById('garantia12').value = formatForInput(garantiaTotal);


  if (formEl) {
    formEl.dataset.composto = "true";
    formEl.dataset.tipo = tipo;
    formEl.dataset.avistaComposto = String(Number((avistaTotal || 0).toFixed(2)));
    formEl.dataset.garantiaComposto = String(Number((garantiaTotal || 0).toFixed(2)));
  }

  updateMetodo?.();  
  updateExtras?.();


  recalcularFormulario();

  mostrarAvisoComBarra("✅ Produto composto inserido no formulário!", 3500, "#4caf50", "#2e7d32");
}

function getMcQty() {
  const selectEl = document.getElementById('mc_qtd');
  if (selectEl && selectEl.value) {
    return Number(selectEl.value) || 1; // retorna o valor selecionado, ou 1 se vazio
  }
  
  // fallback
  return 1;
}


function recalcularFormulario() {
  const avistaInput = document.getElementById('avista');
  const parcelaInput = document.getElementById('parcela');
  const taxaSelect = document.getElementById('juros');

  if (!avistaInput || !parcelaInput || !taxaSelect) return;

  const avista = parseFloat(avistaInput.value.replace(',', '.')) || 0;
  const taxa = taxaSelect.value;

  if (avista === 0) {
    parcelaInput.value = '';
    return;
  }

  // Validação se não selecionou taxa
  if (taxa === 'selecione-taxa') {
    parcelaInput.value = 'Selecione uma taxa!';
    return;
  }

  let parcela = 0;

  // Cálculo das parcelas com arredondamento correto
  switch (taxa) {
    case 'cartao':
    case 'virado':
      parcela = arredondar90(avista / 10);
      break;
    case 'carne':
      parcela = arredondar90(avista * 0.1252); 
      break;
  }

  parcelaInput.value = parcela.toFixed(2).replace('.', ',');
}


document.getElementById('juros')?.addEventListener('change', () => {
  const formEl = document.getElementById('formulario');
  if (formEl && formEl.dataset.composto === "true") {
    recalcularFormulario();
  }
});

document.getElementById('avista')?.addEventListener('input', recalcularFormulario);
document.getElementById('juros')?.addEventListener('change', recalcularFormulario);

const avistaInput = document.getElementById("avista");






// ---------- Gerenciamento do carregamento "Em breve" ----------
// ======================
// Função principal de carregamento
// ======================
function resetCarregamento(panel) {
  if (!panel) return;
  const bar = panel.querySelector('.progress-bar');
  const status = panel.querySelector('.status-text');
  const percentEl = panel.querySelector('.percent-text');
  const logo = panel.querySelector('.logo');
  const overlay = panel.querySelector('.error-overlay');

  if (panel._loadingState) {
    if (panel._loadingState.intervalId) clearInterval(panel._loadingState.intervalId);
    if (panel._loadingState.timeouts) panel._loadingState.timeouts.forEach(t => clearTimeout(t));
  }

  panel._loadingState = null;

  bar.style.width = '0%';
  bar.style.opacity = '1';
  percentEl.textContent = '0%';
  percentEl.style.display = 'inline';
  status.textContent = 'Aguardando... ';
  status.appendChild(percentEl);
  logo.style.display = 'none';
  overlay.style.opacity = '0';
  overlay.style.display = 'flex';
}

// ======================
// Fade helpers
// ======================
function fadeOut(element, duration = 500, callback) {
  element.style.transition = `opacity ${duration}ms`;
  element.style.opacity = '0';
  setTimeout(() => { if (callback) callback(); }, duration);
}

function fadeIn(element, duration = 500, callback) {
  element.style.transition = `opacity ${duration}ms`;
  element.style.opacity = '1';
  if (callback) setTimeout(callback, duration);
}

// ======================
// Carregamento com duas fases (sem digitação)
// ======================
function iniciarCarregamento(panel) {
  const bar = panel.querySelector('.progress-bar');
  const percentEl = panel.querySelector('.percent-text');
  const status = panel.querySelector('.status-text');
  const overlay = panel.querySelector('.error-overlay');
  const logo = panel.querySelector('.logo');

  const mensagens = [
    "Analisando requisitos...",
    "Desenhando interfaces...",
    "Implementando funcionalidades...",
    "Testando qualidade...",
    "Preparando lançamento..."
  ];

  let percent = 0;
  let overlayShown = false;

  if (!panel._loadingState) panel._loadingState = { intervalId: null, timeouts: [] };

  panel._loadingState.intervalId = setInterval(() => {
    // Primeira fase: até 74%
    if (percent < 74) {
      percent += Math.floor(Math.random() * 4) + 1;
      if (percent > 74) percent = 74;

      bar.style.width = percent + '%';
      percentEl.textContent = percent + '%';

      // Mensagem instantânea
      const index = Math.min(Math.floor(percent / (100 / mensagens.length)), mensagens.length - 1);
      status.textContent = mensagens[index] + ' ';
      status.appendChild(percentEl);

    } else if (!overlayShown) {
      // Mostra overlay de erro 1x
      overlayShown = true;
      clearInterval(panel._loadingState.intervalId);
      fadeIn(overlay, 500);

      const t = setTimeout(() => {
        fadeOut(overlay, 500, () => {
          overlay.style.display = 'none';
          // Inicia segunda fase (completa)
          iniciarSegundoCarregamento(panel);
        });
      }, 3500);
      panel._loadingState.timeouts.push(t);
    }
  }, 400);
}

// ======================
// Segundo carregamento (completo)
// ======================
function iniciarSegundoCarregamento(panel) {
  const bar = panel.querySelector('.progress-bar');
  const percentEl = panel.querySelector('.percent-text');
  const status = panel.querySelector('.status-text');
  const logo = panel.querySelector('.logo');

  const mensagens = [
    "Finalizando...",
    "Preparando tudo para você..."
  ];

  let percent = 0;

  if (!panel._loadingState) panel._loadingState = { intervalId: null, timeouts: [] };

  panel._loadingState.intervalId = setInterval(() => {
    percent += Math.floor(Math.random() * 6) + 5;
    if (percent > 100) percent = 100;

    bar.style.width = percent + '%';
    percentEl.textContent = percent + '%';

    // Mensagem instantânea
    const index = Math.min(Math.floor(percent / (100 / mensagens.length)), mensagens.length - 1);
    status.textContent = mensagens[index] + ' ';
    status.appendChild(percentEl);

    if (percent >= 100) {
      clearInterval(panel._loadingState.intervalId);

      fadeOut(bar, 500);
      fadeOut(percentEl, 500);
      fadeOut(status, 500, () => {
        status.textContent = '🚀 Em breve!';
        status.style.opacity = '1';
        logo.style.display = 'block';
      });
    }
  }, 400);
}






const painel = document.getElementById("utilidadesPainel");
const btnAbrir = document.getElementById("btnUtilidades");
const btnFechar = document.getElementById("fecharPainel");
const abas = document.querySelectorAll(".aba");
const conteudos = document.querySelectorAll(".conteudo-aba");
const loginOverlay = document.getElementById("loginOverlay");
const loginUserInput = document.getElementById("loginUser");
const loginPassInput = document.getElementById("loginPass");
const confirmBtn = document.getElementById("confirmLogin");
const cancelBtn = document.getElementById("cancelLogin");

// Função para limpar todos os campos
function limparCampos() {
  painel.querySelectorAll("input, textarea").forEach(el => el.value = "");
}

// Função para remover uppercase visual temporariamente
function desativarUppercaseAba() {
  painel.querySelectorAll("input, textarea").forEach(el => {
    el.style.textTransform = "none";
  });
}

// Função para restaurar uppercase
function restaurarUppercaseAba() {
  painel.querySelectorAll("input, textarea").forEach(el => {
    el.style.textTransform = "uppercase";
  });
}

// Função para fechar painel
function fecharPainel() {
  painel.classList.remove("aberto");
  limparCampos();
  // sempre voltar para a primeira aba
  abas.forEach(a => a.classList.remove("ativa"));
  conteudos.forEach(c => c.classList.remove("ativo"));
  abas[0].classList.add("ativa");
  conteudos[0].classList.add("ativo");
  // fecha login se estiver aberto
  loginOverlay.style.display = "none";
}

// Abrir painel
btnAbrir.addEventListener("click", () => {
  painel.classList.add("aberto");
  desativarUppercaseAba(); 
});

// Botão fechar
btnFechar.addEventListener("click", fecharPainel);

// Fechar com ESC
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    if (loginOverlay.style.display === "flex") {
      // se login aberto, fecha login + painel
      fecharPainel();
    } else if (painel.classList.contains("aberto")) {
      fecharPainel();
    }
  }
  
});

// Fechar painel clicando fora, ignorando modal de login
document.addEventListener("click", e => {
  if (
    painel.classList.contains("aberto") &&            
    !painel.contains(e.target) &&                       
    e.target !== btnAbrir &&                          
    loginOverlay.style.display !== "flex" &&         
    !document.getElementById("formulario").contains(e.target) 
  ) {
    fecharPainel();
  }
});

// Função para abrir login da aba de devolução
function abrirLoginDev(callback) {
  const loginUserInput = document.getElementById("loginUser");
  const loginPassInput = document.getElementById("loginPass");
  const confirmBtn = document.getElementById("confirmLogin");
  const cancelBtn = document.getElementById("cancelLogin");

  loginOverlay.style.display = "flex";
  loginUserInput.value = "";
  loginPassInput.value = "";
  loginUserInput.focus();

  // Forçar minúsculo enquanto digita
  loginUserInput.addEventListener("input", () => {
    loginUserInput.value = loginUserInput.value.toLowerCase();
  });

  // bloqueia cliques dentro do overlay para não fechar o painel
  loginOverlay.addEventListener("click", e => e.stopPropagation());

  function confirmarLogin() {
    const userLogin = loginUserInput.value.trim().toLowerCase();
    const senhaLogin = loginPassInput.value.trim();

    const usuario = usuarios.find(u =>
      u.User.toLowerCase() === userLogin &&
      u.Senha === senhaLogin &&
      ["admin", "suporte", "fat"].includes(u.Permissao)
    );

    if (usuario) {
      loginOverlay.style.display = "none";
      mostrarAvisoComBarra(`Bem-vindo, ${usuario.Nome}!`, 3000, '#4caf50', '#2e7d32');
      callback(usuario);
    } else {
      mostrarAvisoComBarra('Usuário ou senha inválidos!', 3000, '#f44336', '#b71c1c');
      loginUserInput.value = "";
      loginPassInput.value = "";
      loginUserInput.focus();
    }
  }

  confirmBtn.onclick = confirmarLogin;
  loginPassInput.addEventListener("keypress", e => {
    if (e.key === "Enter") confirmarLogin();
  });

  cancelBtn.onclick = () => fecharPainel();
}


// Controle das abas
abas.forEach(aba => {
  aba.addEventListener("click", () => {
    abas.forEach(a => a.classList.remove("ativa"));
    conteudos.forEach(c => c.classList.remove("ativo"));

    aba.classList.add("ativa");
    const conteudoAlvo = document.getElementById(aba.dataset.alvo);

    // Se for aba de devolução, exigir login
    if (aba.dataset.alvo === "devolucao") {
      abrirLoginDev(() => {
        conteudoAlvo.classList.add("ativo");
      });
    } else {
      conteudoAlvo.classList.add("ativo");
    }
  });
});




// Máscara CPF -> 000.000.000-00
document.getElementById("cpf").addEventListener("input", (e) => {
  let v = e.target.value.replace(/\D/g, ""); // só números
  if (v.length > 11) v = v.slice(0, 11);
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  e.target.value = v;
});

// Máscara PV -> 123456/25
document.getElementById("pv").addEventListener("input", (e) => {
  let v = e.target.value.replace(/\D/g, ""); 
  if (v.length > 6) v = v.slice(0, 6); 
  if (v.length === 6) v = v + "/25";   
  e.target.value = v;
});

async function carregarVendedores() {
  const select = document.getElementById("selectVendedores");

  try {
    
    const response = await fetch("Data/usuarios.json");
    if (!response.ok) throw new Error("Falha no fetch");
    const usuarios = await response.json();
    popularSelect(usuarios);
  } catch (err) {
    console.warn("Fetch falhou, usando fallback de input:", err);
    const inputFile = document.createElement('input');
    inputFile.type = 'file';
    inputFile.accept = '.json';
    inputFile.onchange = e => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = evt => {
        try {
          const usuarios = JSON.parse(evt.target.result);
          popularSelect(usuarios);
        } catch {
          alert("Arquivo JSON inválido!");
        }
      };
      reader.readAsText(file);
    };
    inputFile.click();
  }

  function popularSelect(usuarios) {
    select.innerHTML = '<option value="">Selecione um vendedor...</option>';
    usuarios
      .filter(u => u.Permissao === 'vendedor')
      .forEach(u => {
        const option = document.createElement("option");
        option.value = u.User;
        option.textContent = `${u.Nome} [${u.CPF}]`;
        select.appendChild(option);
      });
  }
}

carregarVendedores();






  
let usuarios = []; // variável global para armazenar todos os usuários

async function carregarVendedores() {
  const select = document.getElementById("selectVendedores");
  try {
    const response = await fetch("Data/usuarios.json");
    usuarios = await response.json();

    // Apenas vendedores no select
    const vendedores = usuarios.filter(u => u.Permissao === "vendedor");

    select.innerHTML = '<option value="">Selecione um vendedor...</option>';

    vendedores.forEach(v => {
      const option = document.createElement("option");
      option.value = v.User;
      option.textContent = `${v.Nome} [${v.CPF}]`;
      select.appendChild(option);
    });
  } catch (err) {
    console.error("Erro ao carregar usuários:", err);
  }
}

carregarVendedores();

fetch("https://photon.komoot.io/reverse?lat=-6.374&lon=-39.324")
  .then(r => r.json())
  .then(data => console.log("Resposta API:", data))
  .catch(err => console.error("Erro API:", err));


document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('overlayverifica');
  if (!overlay) return;

  // Mostra overlay
  overlay.style.display = 'flex';

  // Delay de 3 segundos para "carregar"
  setTimeout(() => {
    checkAuth();
  }, 3000);
});

function checkAuth() {
  const overlay = document.getElementById('overlayverifica');
  const auth = JSON.parse(localStorage.getItem('authSession') || 'null');

  if (!auth) {
    // Nenhuma sessão → login
    window.location.href = 'pages/login.html';
    return;
  }

  const now = Date.now();
  if (auth.duration && now > auth.start + auth.duration) {
    // Sessão expirada → bloqueado
    const reason = encodeURIComponent('sessao-expirada');
    localStorage.removeItem('authSession');
    window.location.href = `pages/bloqueado.html?reason=${reason}`;
    return;
  }

  // Sessão válida → libera overlay
  if (overlay) {
    overlay.style.opacity = 0;
    setTimeout(() => {
      overlay.style.display = 'none';
    }, 600);
  }
}

// Redirecionamento suave para login
function goToLogin() {
  if (document.visibilityState === "visible") {
    document.body.style.transition = "opacity 0.6s ease";
    document.body.style.opacity = "0";
    setTimeout(() => {
      window.location.href = 'pages/login.html';
    }, 600);
  }
} 

document.getElementById('logoutBtn').addEventListener('click', () => {
  const overlay = document.getElementById('overlayverifica');
  if (!overlay) return;

  // Exibe overlay e configura estilo
  overlay.style.display = 'flex';
  overlay.style.opacity = '1';

  // Altera textos
  const title = document.getElementById('overlayverifica-title');
  const subtitle = document.getElementById('overlayverifica-subtitle');
  title.textContent = "Encerrando sessão...";
  subtitle.textContent = "";

  // Spinner visível (ou ícone se preferir)
  const spinner = overlay.querySelector('.spinnerverifica');
  if (spinner) spinner.style.display = 'block';

  // Tempo de espera antes de logout
  setTimeout(() => {
    localStorage.removeItem('authSession');
    window.location.href = 'pages/login.html';
  }, 2500);
});


async function pegarCidadeUsuario() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      resolve("Cidade"); // fallback
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;

        const response = await fetch(url);
        const data = await response.json();

        if (data?.address?.city) {
          resolve(data.address.city);
        } else if (data?.address?.town) {
          resolve(data.address.town);
        } else if (data?.address?.village) {
          resolve(data.address.village);
        } else {
          resolve("Cidade");
        }
      } catch (e) {
        resolve("Cidade");
      }
    }, () => resolve("Cidade"));
  });
}


// ---------- Função de gerar declaração ----------
document.getElementById("gerarDeclaracao").addEventListener("click", async () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "pt", "a4");
  const overlay = document.getElementById("overlayPDF");
  overlay.style.display = "flex";

  function formatarNome(nome) {
    if (!nome) return "";
    return nome
      .trim()
      .split(" ")
      .map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
      .join(" ");
  }

  const cpfEl = document.getElementById("cpf");
  const nomeEl = document.getElementById("nomeCliente");
  const pvEl = document.getElementById("pv");
  const vendedorSelect = document.getElementById("selectVendedores");

  if (!cpfEl || !nomeEl || !pvEl || !vendedorSelect) {
    overlay.style.display = "none";
    mostrarAvisoComBarra('Campos do formulário não encontrados!', 4000, '#f44336', '#b71c1c');
    return;
  }

  const cpf = cpfEl.value.trim();
  const nome = nomeEl.value.trim();
  const pv = pvEl.value.trim();
  const nomeFormatado = formatarNome(nome);
  const userSelecionado = vendedorSelect.value;

  // Validações
  if ((cpf && !nome) || (nome && !cpf)) {
    overlay.style.display = "none";
    mostrarAvisoComBarra('Preencha o CPF e o nome do cliente!', 4000, '#f44336', '#b71c1c');
    return;
  }
  if ((cpf && nome) && !pv) {
    overlay.style.display = "none";
    mostrarAvisoComBarra('Insira o PV!', 4000, '#f44336', '#b71c1c');
    return;
  }

  // Se vendedor selecionado, pedir login
  if (userSelecionado) {
  solicitarLoginVendedor(userSelecionado, 5, (usuario) => {
    gerarPDF(usuario); // aqui chama a função de gerar PDF da declaração de mostruário
  });
} else {
  gerarPDF();
}

  

  // ---------- Função para gerar PDF ----------
async function gerarPDF(vendedor) {
  const timbre = new Image();
  timbre.src = "Imagens/declaracaonova.png";
  await timbre.decode();
  doc.addImage(timbre, "PNG", 0, 0, 595, 842);

  const margemEsq = 60;
  const margemDir = 64;
  const larguraPagina = 595;
  const larguraTexto = larguraPagina - (margemEsq + margemDir);
  const lineHeight = 16;

  // --- Título ---
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text("DECLARAÇÃO PRODUTO DE MOSTRUÁRIO", larguraPagina / 2, 150, { align: "center" });

  // --- Corpo do texto ---
  doc.setFont("times", "normal");
  doc.setFontSize(12);

  const corpoTexto = (cpf && nome && pv)
    ? `Eu, ${nomeFormatado}, portador(a) do CPF ${cpf}, declaro para os devidos fins, que comprei na J. ALVES E OLIVEIRA LTDA (ZENIR MÓVEIS E ELETROS) a mercadoria abaixo relacionada com um desconto especial em função da mesma ser mercadoria de mostruário, referente a PV ${pv}, e concordo com o estado em que se encontra o produto. Estou ciente que o produto pode apresentar pequenas avarias ou manchas e que portanto não terá cancelamento/troca.`
    : `Eu, _____________________________________________________________ portador(a) do CPF ________________________ declaro para os devidos fins, que comprei na J. ALVES E OLIVEIRA LTDA (ZENIR MÓVEIS E ELETROS) a mercadoria abaixo relacionada com um desconto especial em função da mesma ser mercadoria de mostruário, referente a PV ___________________, e concordo com o estado em que se encontra o produto. Estou ciente que o produto pode apresentar pequenas avarias ou manchas e que portanto não terá cancelamento/troca.`;

  // Quebra de texto simples
  const palavras = corpoTexto.split(" ");
  let linhaAtual = "";
  let yLinha = 190; // começa logo abaixo do título
  palavras.forEach((palavra, idx) => {
    const testeLinha = linhaAtual ? linhaAtual + " " + palavra : palavra;
    if (doc.getTextWidth(testeLinha) > larguraTexto) {
      doc.text(linhaAtual, margemEsq, yLinha, { maxWidth: larguraTexto, align: "justify" });
      linhaAtual = palavra;
      yLinha += lineHeight;
    } else {
      linhaAtual = testeLinha;
    }
    if (idx === palavras.length - 1) {
      doc.text(linhaAtual, margemEsq, yLinha, { maxWidth: larguraTexto, align: "justify" });
    }
  });

  // --- Continuação do restante do PDF (data, cliente, vendedor, rodapé) ---
  const hoje = new Date();
  const dia = hoje.getDate();
  const mesExtenso = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"][hoje.getMonth()];
  const ano = hoje.getFullYear();
  let cidade = await pegarCidadeUsuario();

  function finalizarPDF(cidadeFinal) {
  doc.text(`${cidadeFinal}-CE, ${dia} de ${mesExtenso} de ${ano}.`, larguraPagina - margemDir, yLinha + 40, { align: "right" });
  doc.text("Cliente: ________________________________________", margemEsq, 570);

  let posVendedorY = 620;
  if (vendedor && vendedor.assinatura && (vendedor.Permissao === "vendedor" || vendedor.Permissao === "admin" || vendedor.Permissao === "suporte")) {
    doc.text("Vendedor Zenir:", margemEsq, posVendedorY);
    const assinatura = new Image();
    assinatura.src = `Imagens/assinaturas/${vendedor.assinatura}`;
    assinatura.onload = () => {
      doc.addImage(assinatura, "PNG", margemEsq + 120, posVendedorY - 20, 120, 40);
      salvarPDF(vendedor); // chamado **apenas aqui**
    };
  } else {
    doc.text("Vendedor Zenir: ________________________________", margemEsq, posVendedorY);
    salvarPDF(vendedor); // chamado apenas uma vez se não houver assinatura
  }
}


  function salvarPDF(vendedor) {
    if (vendedor) {
      const agora = new Date();
      const hora = agora.toLocaleTimeString();
      const dataCompleta = agora.toLocaleDateString();
      doc.setFont("helvetica");
      doc.setFontSize(8); 
      doc.text(
        `IMPRESSO POR ${vendedor.Nome.toUpperCase()} [${vendedor.CPF}] ÀS ${hora} ${dataCompleta}`,
        larguraPagina / 2, 750,
        { align: "center" }
      );
    }

    doc.save("Declaracao_Mostruario.pdf");
    overlay.style.display = "none";

    cpfEl.value = "";
    nomeEl.value = "";
    pvEl.value = "";
    vendedorSelect.value = "";
  }

  finalizarPDF(cidade);
}

});


  // ---------- Função para solicitar login ----------
  function solicitarLoginVendedor(user, tentativas, onSuccess) {
  const loginOverlay = document.getElementById("loginOverlay");
  const loginUserInput = document.getElementById("loginUser");
  const loginPassInput = document.getElementById("loginPass");
  const confirmBtn = document.getElementById("confirmLogin");
  const cancelBtn = document.getElementById("cancelLogin");

  loginOverlay.style.display = "flex";
  loginUserInput.value = user;
  loginPassInput.value = "";

  // permitir Enter no campo senha
  loginPassInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") confirmBtn.click();
  });

  confirmBtn.onclick = () => {
    const userLogin = loginUserInput.value.trim();
    const senhaLogin = loginPassInput.value.trim();

    const usuario = usuarios.find(
      u => u.User === userLogin && u.Senha === senhaLogin
    );

    if (usuario) {
      loginOverlay.style.display = "none";
      mostrarAvisoComBarra("Gerando PDF...", 2000, '#4caf50', '#2e7d32');

      if (typeof onSuccess === "function") {
        onSuccess(usuario);
      }
    } else {
      tentativas--;
      mostrarAvisoComBarra(
        `Senha inválida! Restam ${tentativas} tentativas.`,
        4000, '#f44336', '#b71c1c'
      );
      loginPassInput.value = "";
      if (tentativas <= 0) {
        loginOverlay.style.display = "none";
        location.reload(true);
      }
    }
  };

  cancelBtn.onclick = () => {
    loginOverlay.style.display = "none";
    location.reload(true); // igual F5
  };

  // tecla ESC para cancelar login
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && loginOverlay.style.display === "flex") {
      location.reload(true);
    }
  });
}

// ---------- Carregar atendentes no select da Central ----------
async function carregarAtendentesCentral() {
  try {
    const resposta = await fetch("Data/usuarios.json");
    const vendedores = await resposta.json();

    const selectAtendentes = document.getElementById("selectAtendentes");
    if (!selectAtendentes) return;

    vendedores.forEach(vendedor => {
      const option = document.createElement("option");
      option.value = vendedor.CPF; // ou ID se tiver
      option.textContent = vendedor.Nome;
      selectAtendentes.appendChild(option);
    });
  } catch (erro) {
    console.error("Erro ao carregar atendentes:", erro);
  }
}

// Executa quando a página carregar
document.addEventListener("DOMContentLoaded", () => {
  carregarAtendentesCentral();
});



const cpfEl = document.getElementById("centralCPF");
cpfEl.addEventListener("input", (e) => {
  let v = e.target.value.replace(/\D/g, "");
  if (v.length > 11) v = v.slice(0, 11);
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d)/, "$1.$2");
  v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  e.target.value = v;
});

const pvEl = document.getElementById("centralPV");
pvEl.addEventListener("input", (e) => {
  let v = e.target.value.replace(/\D/g, "");
  if (v.length > 8) v = v.slice(0, 8);
  v = v.replace(/(\d{6})(\d{1,2})$/, "$1/$2");
  e.target.value = v;
});

// ---------- Função de gerar Declaração de Central ----------
document.getElementById("gerarCentral").addEventListener("click", async () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF("p", "pt", "a4");
  const overlay = document.getElementById("overlayPDF");
  overlay.style.display = "flex";

  const cpfEl = document.getElementById("centralCPF");
  const pvEl = document.getElementById("centralPV");

  if (!cpfEl || !pvEl) {
    overlay.style.display = "none";
    mostrarAvisoComBarra('Campos do formulário não encontrados!', 4000, '#f44336', '#b71c1c');
    return;
  }

  const cpf = cpfEl.value.trim();
  const pv = pvEl.value.trim();

  // Validação: se algum está preenchido, ambos devem estar preenchidos
  if ((cpf && !pv) || (pv && !cpf)) {
    overlay.style.display = "none";
    mostrarAvisoComBarra('Preencha CPF e PV corretamente!', 4000, '#f44336', '#b71c1c');
    return;
  }

  // --- Inserir timbre ---
  const timbre = new Image();
  timbre.src = "Imagens/declaracaonova.png";
  await timbre.decode();
  doc.addImage(timbre, "PNG", 0, 0, 595, 842);

  const margemEsq = 60;
  const margemDir = 64;
  const larguraPagina = 595;
  const larguraTexto = larguraPagina - (margemEsq + margemDir);
  const lineHeight = 16;

  // --- Título ---
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.text(
    "DECLARAÇÃO DE INSTRUÇÃO DE MONTAGEM AR CONDICIONADO",
    larguraPagina / 2,
    160,
    { align: "center" }
  );

  // --- Corpo do texto ---
  doc.setFont("times", "normal");
  doc.setFontSize(12);
  const corpoTexto = `Declara para os devidos fins legais que a J. ALVES E OLIVEIRA LTDA (ZENIR MÓVEIS E ELETROS) orientou-me acerca da montagem e instalação da central de ar refrigerado, recomendada pelo fabricante e expressa no manual, estando, pois, ciente de que a montagem e instalação realizada por agente autônomo e não certificado pela fabricante poderá acarretar a perda da garantia contratual do produto. Por fim, declaro que me foi repassada uma listagem de profissionais certificados pelo fabricante para a montagem segura e eficaz do aparelho ora adquirido.`;

  let palavras = corpoTexto.split(" ");
  let linhaAtual = "";
  let yLinha = 200;
  palavras.forEach((palavra, idx) => {
    const testeLinha = linhaAtual ? linhaAtual + " " + palavra : palavra;
    if (doc.getTextWidth(testeLinha) > larguraTexto) {
      doc.text(linhaAtual, margemEsq, yLinha, { maxWidth: larguraTexto, align: "justify" });
      linhaAtual = palavra;
      yLinha += lineHeight;
    } else {
      linhaAtual = testeLinha;
    }
    if (idx === palavras.length - 1) {
      doc.text(linhaAtual, margemEsq, yLinha, { maxWidth: larguraTexto, align: "justify" });
    }
  });

  // --- Data e cidade ---
  const hoje = new Date();
  const dia = hoje.getDate();
  const mesExtenso = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"][hoje.getMonth()];
  const ano = hoje.getFullYear();
  const cidade = await pegarCidadeUsuario();

  doc.text(
    `${cidade} - CE, ${dia} de ${mesExtenso} de ${ano}.`,
    larguraPagina - margemDir,
    yLinha + 40,
    { align: "right" }
  );

  // --- Campos de preenchimento ---
  doc.text(`Cliente: ________________________________________`, margemEsq, yLinha + 90);
  doc.setFont("times", "bold");
  doc.text(`CPF: ${cpf || "________________________"}`, margemEsq, yLinha + 115);
  doc.text(`PV: ${pv || "_____________________"}`, margemEsq, yLinha + 140);

  // --- Assinatura ---
  doc.setFont("times", "normal");
  doc.text("Atendente Zenir: ________________________________", margemEsq, yLinha + 170);

  // --- Salvar PDF ---
  doc.save("Declaracao_Central.pdf");
  overlay.style.display = "none";

  // limpar campos
  cpfEl.value = "";
  pvEl.value = "";
});

  function getValorOuTraco(id) {
  const el = document.getElementById(id);
  return el && el.value.trim() !== "" ? el.value.trim() : "_____";
}


function mostrarAvisoModal(texto, gerarCallback) {
  const modal = document.getElementById("avisoModal");
  const avisoTexto = document.getElementById("avisoTexto");
  const continuarBtn = document.getElementById("continuarBtn");
  const gerarMesmoBtn = document.getElementById("gerarMesmoBtn");

  avisoTexto.textContent = texto;
  modal.classList.add("show");

  continuarBtn.onclick = () => {
    modal.classList.remove("show");
  };

  gerarMesmoBtn.onclick = () => {
    modal.classList.remove("show");
    gerarCallback(); 
  };
}



//área do faturamento

document.getElementById("gerarDevolucao").addEventListener("click", async () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const overlayDev = document.getElementById("overlayDev");
  overlayDev.style.display = "flex";

  // Pegar valores do formulário
  const campos = {
    nfe: document.getElementById("nfeDevolucao")?.value.trim() || "",
    nomeCliente: document.getElementById("nomeClienteDev")?.value.trim() || "",
    cpf: document.getElementById("cpfDev")?.value.trim() || "",
    endereco: document.getElementById("enderecoDev")?.value.trim() || "",
    numero: document.getElementById("numeroDev")?.value.trim() || "",
    bairro: document.getElementById("bairroDev")?.value.trim() || "",
    cidadeForm: document.getElementById("cidadeDev")?.value.trim() || "",
    ufForm: document.getElementById("ufDev")?.value.trim() || "",
    pv: document.getElementById("pvDev")?.value.trim() || "",
    cupom: document.getElementById("cupomDev")?.value.trim() || "",
    filial: document.getElementById("filialDev")?.value.trim() || "",
    novaCompra: document.getElementById("novaCompraDev")?.value.trim() || "",
    novoPV: document.getElementById("novoPVDev")?.value.trim() || "",
    motivo: document.getElementById("motivoDev")?.value.trim() || "",
  };

  const todosVazios = Object.values(campos).every(v => v === "");
  const novaCompraSelect = document.getElementById("novaCompraDev");

  if (!novaCompraSelect.value || novaCompraSelect.value.toLowerCase() === "selecione") {
    overlayDev.style.display = "none";
    mostrarAvisoModal("Campos importantes ainda não preenchidos!", async () => {
      // Callback para gerar PDF 100% em branco
      await gerarPDFdev(doc, true, campos);
    });
    return;
  }

  await gerarPDFdev(doc, todosVazios, campos);
  overlayDev.style.display = "none";
});

// Função de aviso com botão
function mostrarAvisoComBotao(mensagem, textoBotao, callback) {
  const overlay = document.createElement("div");
  overlay.style = "position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;z-index:9999";
  
  const box = document.createElement("div");
  box.style = "background:#fff;padding:20px;border-radius:8px;text-align:center;max-width:300px;width:80%";
  
  const msg = document.createElement("p");
  msg.innerText = mensagem;
  msg.style.marginBottom = "15px";
  
  const btn = document.createElement("button");
  btn.innerText = textoBotao;
  btn.style = "padding:8px 15px;cursor:pointer";
  
  btn.addEventListener("click", () => {
    document.body.removeChild(overlay);
    callback();
  });
  
  box.appendChild(msg);
  box.appendChild(btn);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
}


async function gerarPDFdev(doc, emBranco, campos) {
  // Carregar timbre
  const timbre = await loadImage("Imagens/declaracaonova.png");
  doc.addImage(timbre, "PNG", 0, 0, 210, 297);

  // Título
  doc.setFont("times", "bold");
  doc.setFontSize(16);
  doc.text("DECLARAÇÃO", 105, 40, { align: "center" });

  // Cabeçalho
  doc.setFont("times", "normal");
  doc.setFontSize(12);
  const nfeTexto = campos.nfe?.trim() ? campos.nfe.trim() : "___________";
  const cabecalho = `Declaro para fins de comprovação junto à SEFAZ – Secretaria da Fazenda do Estado do Ceará, que através da NF-e de devolução Nº ${nfeTexto}, devolvo o(s) produto(s) abaixo relacionado(s):`;
  doc.text(cabecalho, 15, 55, { maxWidth: 180, align: "justify" });

  // Tabela de produtos (8 linhas)
  // Pegar linhas da tabela do formulário
const container = document.getElementById("produtosContainer");
const linhasProdutos = container ? container.querySelectorAll(".linha.produto") : [];

// Transformar em array de valores para o PDF
const produtos = Array.from(linhasProdutos).map(linha => {
  const inputs = linha.querySelectorAll("input");
  return [
    inputs[0]?.value.trim() || "",
    inputs[1]?.value.trim() || "",
    inputs[2]?.value.trim() || "",
    inputs[3]?.value.trim() || "",
    inputs[4]?.value.trim() || ""
  ];
});

// Garantir 8 linhas na tabela
while (produtos.length < 8) {
  produtos.push(["", "", "", "", ""]);
}

// Gerar a tabela no PDF com os valores preenchidos
doc.autoTable({
  head: [["Código", "Descrição", "QTD", "VR. Unit.", "VR. Total"]],
  body: produtos,
  startY: 75,
  theme: "grid",
  styles: { font: "times", fontSize: 11, halign: "center", valign: "middle" },
  headStyles: { fillColor: [200, 200, 200], textColor: 0, fontStyle: "bold" },
});

  let finalY = doc.lastAutoTable.finalY + 10;
  const marginX = 15;

  if (emBranco) {
    // Texto em branco com quebras fixas
    doc.text(`Cliente: _______________________________________________ CPF: _______________________`, marginX, finalY);
    finalY += 7;
    doc.text(`Endereço: ____________________________________________ Nº ____ Bairro: _______________`, marginX, finalY);
    finalY += 7;
    doc.text(`Cidade: ______________ Estado: ____ PV: ___________ Cupom/NF-e: ___________ Filial: ____`, marginX, finalY);
    finalY += 7;
    doc.text(`Cliente efetuou outra compra? ______ Novo PV: ___________ Motivo da devolução:`, marginX, finalY);
    finalY += 7;
    doc.text(`_______________________________________________________________________________`, marginX, finalY);
  } else {
  // Underlines padrão para quando campo não for preenchido
  const placeholders = {
    nomeCliente: "_______________________________________________",
    cpf: "_______________________",
    endereco: "______________________________________________",
    numero: "____",
    bairro: "_______________",
    cidadeForm: "______________",
    ufForm: "____",
    pv: "___________",
    cupom: "___________",
    filial: "____",
    novaCompra: "______",
    novoPV: "___________",
    motivo: "_______________________________________________________________________________"
  };

  const linha = [
    { label: "Cliente:", key: "nomeCliente" },
    { label: "CPF:", key: "cpf" },
    { label: "Endereço:", key: "endereco" },
    { label: "Nº", key: "numero" },
    { label: "Bairro:", key: "bairro" },
    { label: "Cidade:", key: "cidadeForm" },
    { label: "Estado:", key: "ufForm" },
    { label: "PV:", key: "pv" },
    { label: "Cupom/NF-e:", key: "cupom" },
    { label: "Filial:", key: "filial" },
    { label: "Cliente efetuou outra compra?", key: "novaCompra" },
    { label: "Novo PV:", key: "novoPV" },
    { label: "Motivo da devolução:", key: "motivo" }
  ];

 let x = marginX;
let y = finalY;
const maxWidth = 180;

for (let i = 0; i < linha.length; i++) {
  const { label, key } = linha[i];
  const value = campos[key]?.trim();
  let displayValue = value; // valor original do campo

  if (key === "novoPV") {
    if (campos.novaCompra !== "Sim") {
      displayValue = ""; // não insere no PDF se selecionar "Não"
    } else if (!value) {
      displayValue = placeholders[key]; // se estiver vazio, mantém underline
    }
  } else {
    if (!value) displayValue = placeholders[key]; // underline padrão
  }

  if (!displayValue) continue; // pula se displayValue vazio

  // Negrito no label
  doc.setFont("times", "bold");
  const labelWidth = doc.getTextWidth(label + " ");
  if (x + labelWidth > marginX + maxWidth) {
    x = marginX;
    y += 7;
  }
  doc.text(label + " ", x, y);
  x += labelWidth;

  // Normal + sublinhado no valor ou underline
  doc.setFont("times", "normal");
  const words = displayValue.split(" ");
  for (let w = 0; w < words.length; w++) {
    let word = words[w] + " ";
    const wordWidth = doc.getTextWidth(word);
    if (x + wordWidth > marginX + maxWidth) {
      x = marginX;
      y += 7;
    }
    doc.text(word, x, y);
    doc.line(x, y + 0.8, x + wordWidth, y + 0.8);
    x += wordWidth;
  }
  x += 2;
}

finalY = y + 10;

  }
  // Assinaturas
  finalY += 20;
  doc.text("Assinatura Cliente: ___________________________________________", marginX, finalY);
  finalY += 15;
  doc.text("Assinatura Gerente: __________________________________________", marginX, finalY);

  // Data
  finalY += 20;
  let cidade = await pegarCidadeUsuario();
  let uf = "CE";
  const meses = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
  const dataAtual = new Date();
  const dia = dataAtual.getDate();
  const mes = meses[dataAtual.getMonth()];
  const ano = dataAtual.getFullYear();
  doc.setFontSize(12);
  doc.text(`${cidade}-${uf}, ${dia} de ${mes} de ${ano}`, 105, finalY, { align: "center" });

  // Salvar PDF
  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);

  const html = `
  <!DOCTYPE html>
  <html>
  <head><title>Declaração de Devolução</title></head>
  <body style="margin:0">
  <iframe src="${pdfUrl}" style="width:100vw; height:100vh; border:none;"></iframe>
  </body>
  </html>`;

  const win = window.open();
if (!win || win.closed || typeof win.closed == "undefined") {
  overlayDev.style.display = "none";
  mostrarAvisoComBarra("Não foi possível abrir o PDF. Verifique se o bloqueador de popups está desativado.", 4000, "#f44336", "#c62828");
  return;
}
win.document.write(html);
win.document.close();
  
  
}



// ---------------------------
// Máscaras e PV condicional
// ---------------------------

// Função para máscara NF-e e Cupom (123.123)
function mascaraNF(input) {
  input.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g, "");
    if (v.length > 3) v = v.slice(0,3) + "." + v.slice(3,6);
    e.target.value = v;
  });
}
mascaraNF(document.getElementById("nfeDevolucao"));
mascaraNF(document.getElementById("cupomDev"));

// Máscara CPF (123.456.789-00)
document.getElementById("cpfDev").addEventListener("input", (e) => {
  let v = e.target.value.replace(/\D/g, "");
  if(v.length > 3) v = v.slice(0,3) + "." + v.slice(3);
  if(v.length > 6) v = v.slice(0,7) + "." + v.slice(7);
  if(v.length > 9) v = v.slice(0,11) + "-" + v.slice(11,13);
  e.target.value = v;
});

// Máscara valores monetários (VR. Unit. e VR. Total)
function mascaraValor(input) {
  input.addEventListener("input", (e) => {
    let v = e.target.value.replace(/\D/g,"");
    v = (v/100).toFixed(2); // transforma em centavos
    v = v.replace(".", ","); // ponto para vírgula
    // separador de milhares
    let partes = v.split(",");
    partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    e.target.value = partes.join(",");
  });
}

// Aplica para todos os inputs de valor nas linhas de produto
document.querySelectorAll("#produtosContainer .linha.produto").forEach(linha => {
  linha.querySelectorAll("input").forEach((input, idx) => {
    if(idx === 3 || idx === 4) mascaraValor(input); // VR. Unit. e VR. Total
  });
});

// Mostrar/ocultar Novo PV conforme select "Nova Compra?"
document.addEventListener("DOMContentLoaded", () => {
  const novaCompraSelect = document.getElementById("novaCompraDev");
  const novoPVWrapper = document.getElementById("novoPVWrapper");

  if (novaCompraSelect && novoPVWrapper) {
    novaCompraSelect.addEventListener("change", () => {
  novoPVWrapper.style.display = novaCompraSelect.value === "Sim" ? "block" : "none";
});
  }
});





function loadImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve(img);
  });
}

function monitorarProdutos() {
  const container = document.getElementById("produtosContainer");

  function aplicarEventosLinha(linha) {
    const codigoInput = linha.querySelector(".campo.pequeno input[type='text']");
    const descricaoInput = linha.querySelector(".campo.grande input");
    const vrUnitInput = linha.querySelectorAll(".campo.medio input")[0]; // VR. Unit.

    let codigoAnterior = codigoInput.value;

    codigoInput.addEventListener("blur", async () => {
      const codigo = codigoInput.value.trim();
      if (!codigo || codigo === codigoAnterior) return;
      codigoAnterior = codigo;

      // Mostrar overlay
      const overlay = document.getElementById("overlayDev");
      overlay.style.display = "flex";

      try {
        const resposta = await fetch(API_URL);
        if (!resposta.ok) throw new Error("Erro ao acessar a API");
        const dados = await resposta.json();

        let encontrado = false;
        let primeiroItem = null;

        ["Gabriel", "Júlia", "Giovana"].forEach(nome => {
          if (dados[nome]) {
            dados[nome].forEach(item => {
              if (item.Código == codigo && !primeiroItem) {
                encontrado = true;
                primeiroItem = item;
              }
            });
          }
        });

        if (encontrado && primeiroItem) {
          descricaoInput.value = primeiroItem.Descrição || "";
          const valorUnit = primeiroItem["Total à vista"]
            ? parseFloat(primeiroItem["Total à vista"]).toFixed(2).replace('.', ',')
            : "";
          vrUnitInput.value = valorUnit;
        } else {
          descricaoInput.value = "";
          vrUnitInput.value = "";
          console.warn(`Produto ${codigo} não encontrado`);
        }
      } catch (err) {
        console.error(err);
      } finally {
        overlay.style.display = "none";
      }
    });
  }

  container.addEventListener("input", () => {
    const linhas = container.querySelectorAll(".linha.produto");
    const ultima = linhas[linhas.length - 1];

    const preenchido = [...ultima.querySelectorAll("input")].every(i => i.value.trim() !== "");
    if (preenchido) {
      const nova = ultima.cloneNode(true);
      nova.querySelectorAll("input").forEach(i => i.value = "");

      const inputsValor = nova.querySelectorAll("input");
      [3, 4].forEach(idx => mascaraValor(inputsValor[idx]));

      container.appendChild(nova);
      aplicarEventosLinha(nova); // importante: aplica evento na linha clonada
    }

    // remover linhas vazias
    linhas.forEach((linha, idx) => {
      const vazio = [...linha.querySelectorAll("input")].every(i => i.value.trim() === "");
      if (vazio && idx !== 0 && idx !== linhas.length - 1) {
        linha.remove();
      }
    });
  });

  // inicializa primeira linha
  const primeiraLinha = container.querySelector(".linha.produto");
  if (primeiraLinha) {
    const inputs = primeiraLinha.querySelectorAll("input");
    [3, 4].forEach(idx => mascaraValor(inputs[idx]));
    aplicarEventosLinha(primeiraLinha);
  }
}

monitorarProdutos();
document.addEventListener("DOMContentLoaded", () => {
  const cepModal = document.getElementById("cep-modal");
  const abrirCep = document.getElementById("abrirCepModal");
  const fecharCep = document.getElementById("fecharCepModal");
  const buscarCep = document.getElementById("buscarCep");
  const cepInput = document.getElementById("cepInput");
  const resultadoCEP = document.getElementById("resultadoCEP");

  if (cepModal && abrirCep && fecharCep && buscarCep && cepInput) {
    
    // Abrir modal
    abrirCep.addEventListener("click", () => {
      cepModal.style.display = "flex";
      cepInput.value = "";
      resultadoCEP.innerHTML = "";
      cepInput.focus();
    });

    // Fechar modal
    function fecharCepModal() {
      cepModal.style.display = "none";
    }
    fecharCep.addEventListener("click", fecharCepModal);
    window.addEventListener("click", (e) => {
      if (e.target === cepModal) fecharCepModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") fecharCepModal();
    });

    // Buscar CEP via ViaCEP
    buscarCep.addEventListener("click", async () => {
      const cep = cepInput.value.replace(/\D/g, "");
      if (cep.length !== 8) {
        resultadoCEP.innerHTML = "<p style='color:red'>CEP inválido!</p>";
        return;
      }

      try {
        const resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await resp.json();

        if (data.erro) {
          resultadoCEP.innerHTML = "<p style='color:red'>CEP não encontrado!</p>";
          return;
        }

        // Preenche automaticamente os campos do formulário
        document.getElementById("enderecoDev").value = data.logradouro || "";
        if (document.getElementById("bairroDev")) {
          document.getElementById("bairroDev").value = data.bairro || "";
        }
        if (document.getElementById("cidadeDev")) {
          document.getElementById("cidadeDev").value = data.localidade || "";
        }
        if (document.getElementById("ufDev")) {
          document.getElementById("ufDev").value = data.uf || "";
        }

        fecharCepModal();
      } catch (err) {
        resultadoCEP.innerHTML = "<p style='color:red'>Erro ao buscar CEP.</p>";
      }
    });

    // Enter busca automaticamente
    cepInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        buscarCep.click();
      }
    });
  }
});

