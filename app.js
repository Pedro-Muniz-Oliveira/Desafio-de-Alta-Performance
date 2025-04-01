// Pega os elementos do DOM
const goalInput = document.getElementById("goalInput");
const reflectionInput = document.getElementById("reflectionInput");
const discomfortInput = document.getElementById("discomfortInput");
const progressDiv = document.getElementById("progress");
const goalHistoryDiv = document.getElementById("goalHistory");
const reflectionHistoryDiv = document.getElementById("reflectionHistory");
const discomfortHistoryDiv = document.getElementById("discomfortHistory");
const quoteText = document.getElementById("quoteText");

const setGoalButton = document.getElementById("setGoal");
const submitReflectionButton = document.getElementById("submitReflection");
const submitDiscomfortButton = document.getElementById("submitDiscomfort");

// Variáveis para controle da frase e contagem regressiva
let frases = [];
let tempoRestante = 10; // Variável de controle da contagem regressiva


document.addEventListener("DOMContentLoaded", function () {
    // Função para carregar os históricos do localStorage e adicionar a lixeira
    carregarHistorico();

    function carregarHistorico() {
        const goalHistory = JSON.parse(localStorage.getItem('goalHistory')) || [];
        const reflectionHistory = JSON.parse(localStorage.getItem('reflectionHistory')) || [];
        const discomfortHistory = JSON.parse(localStorage.getItem('discomfortHistory')) || [];

        // Carregar Metas
        document.getElementById('goalHistory').innerHTML = `
            <h4>Metas Registradas</h4>
            ${goalHistory.map((item, index) => `
                <div class="historico-item">
                    <span>${item.timestamp}: ${item.text}</span>
                    <button class="delete-btn" data-type="goal" data-index="${index}">🗑️</button>
                </div>
            `).join('')}
        `;

        // Carregar Reflexões
        document.getElementById('reflectionHistory').innerHTML = `
            <h4>Reflexões Registradas</h4>
            ${reflectionHistory.map((item, index) => `
                <div class="historico-item">
                    <span>${item.timestamp}: ${item.text}</span>
                    <button class="delete-btn" data-type="reflection" data-index="${index}">🗑️</button>
                </div>
            `).join('')}
        `;

        // Carregar Desafios
        document.getElementById('discomfortHistory').innerHTML = `
            <h4>Desafios Registrados</h4>
            ${discomfortHistory.map((item, index) => `
                <div class="historico-item">
                    <span>${item.timestamp}: ${item.text}</span>
                    <button class="delete-btn" data-type="discomfort" data-index="${index}">🗑️</button>
                </div>
            `).join('')}
        `;

        // Adicionar evento de exclusão
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function (e) {
                const type = e.target.getAttribute('data-type');
                const index = e.target.getAttribute('data-index');
                excluirItem(type, index);
            });
        });
    }

    // Função para excluir um item específico do histórico
    function excluirItem(type, index) {
        let history = JSON.parse(localStorage.getItem(`${type}History`)) || [];
        history.splice(index, 1); // Remove o item com o índice especificado

        // Atualiza o localStorage com a lista atualizada
        localStorage.setItem(`${type}History`, JSON.stringify(history));

        // Recarregar os históricos na tela
        carregarHistorico();
    }
});





// Função para carregar frases do arquivo JSON
async function loadFrases() {
    try {
        const response = await fetch('frases-api/frases.json');
        
        // Verificar se a requisição foi bem-sucedida
        if (!response.ok) {
            throw new Error("Falha ao carregar o arquivo JSON");
        }
        
        const data = await response.json();
        frases = data.frases;
        
        // Exibir mensagem de sucesso
        console.log("Frases carregadas com sucesso:", frases);
    } catch (error) {
        // Exibir erro caso algo falhe
        console.error("Erro ao carregar frases:", error);
        alert("Erro ao carregar frases! Verifique o arquivo JSON.");
    }
}

// Função para atualizar a frase e estilo
function atualizarFrase() {
    if (frases.length === 0) {
        console.error("Nenhuma frase carregada.");
        return;
    }
    
    // Atualiza a frase com uma frase aleatória
    const fraseAleatoria = obterFraseAleatoria();
    quoteText.textContent = fraseAleatoria;
    
    // Mudar as cores
    quoteText.style.color = "#f39c12"; // Laranja para o texto
    quoteText.style.backgroundColor = "#1c6f94"; // Azul para o fundo
    
    // Exibe a frase no rodapé
    const rodape = document.getElementById("rodapeFrases");
    rodape.textContent = `Frase do momento: ${fraseAleatoria}`;
    
    // Logar a frase no console
    console.log("Frase logada: ", fraseAleatoria);
    
    tempoRestante = 10; // Resetar o contador
}

// Função para atualizar o contador
function atualizarContador() {
    const countdownElement = document.getElementById("timer");
    countdownElement.textContent = tempoRestante;
    tempoRestante--;

    if (tempoRestante < 0) {
        atualizarFrase();
    }
}

// Função para obter uma frase aleatória
function obterFraseAleatoria() {
    if (frases.length === 0) {
        console.error("Nenhuma frase disponível.");
        return "";
    }

    const indiceAleatorio = Math.floor(Math.random() * frases.length);
    return frases[indiceAleatorio].texto;  // Acessando o campo `texto` do objeto
}

// Iniciar a contagem e carregar a primeira frase
document.addEventListener("DOMContentLoaded", async function () {
    await loadFrases(); // Carregar frases do JSON
    
    // Verificar se as frases foram carregadas corretamente
    if (frases.length > 0) {
        atualizarFrase(); // Exibir a primeira frase
        setInterval(atualizarContador, 1000); // Atualizar a contagem a cada segundo
    } else {
        alert("Frases não carregadas corretamente.");
    }
});

// Função para obter o histórico de dados
function getHistory(key) {
    const history = localStorage.getItem(key);
    return history ? JSON.parse(history) : [];
}

// Função para salvar no histórico
function saveHistory(key, newEntry) {
    const history = getHistory(key);
    history.push(newEntry);
    localStorage.setItem(key, JSON.stringify(history));
}

// Função para exibir o progresso do dia
function displayProgress() {
    const goal = localStorage.getItem("goal") || "Ainda não definida";
    const reflection = localStorage.getItem("reflection") || "Ainda não registrada";
    const discomfort = localStorage.getItem("discomfort") || "Ainda não registrado";

    progressDiv.innerHTML = `
        <p><strong>Meta do dia:</strong> ${goal}</p>
        <p><strong>Reflexão do dia:</strong> ${reflection}</p>
        <p><strong>Desafio do desconforto:</strong> ${discomfort}</p>
    `;
}

// Função para exibir o histórico
function displayHistory() {
    goalHistoryDiv.innerHTML = getHistory("goalHistory")
        .map(entry => `<p><strong>${entry.timestamp}</strong>: ${entry.text}</p>`)
        .join('');

    reflectionHistoryDiv.innerHTML = getHistory("reflectionHistory")
        .map(entry => `<p><strong>${entry.timestamp}</strong>: ${entry.text}</p>`)
        .join('');

    discomfortHistoryDiv.innerHTML = getHistory("discomfortHistory")
        .map(entry => `<p><strong>${entry.timestamp}</strong>: ${entry.text}</p>`)
        .join('');
}

// Função para registrar a meta
setGoalButton.addEventListener("click", () => {
    if (!goalInput.value.trim()) return alert("Por favor, defina uma meta.");
    
    const timestamp = new Date().toLocaleString();
    saveHistory("goalHistory", { text: goalInput.value, timestamp });
    localStorage.setItem("goal", goalInput.value);
    
    alert("Meta definida!");
    goalInput.value = '';
    displayHistory();
});

// Função para registrar a reflexão
submitReflectionButton.addEventListener("click", () => {
    if (!reflectionInput.value.trim()) return alert("Por favor, escreva sua reflexão.");
    
    const timestamp = new Date().toLocaleString();
    saveHistory("reflectionHistory", { text: reflectionInput.value, timestamp });
    localStorage.setItem("reflection", reflectionInput.value);
    
    alert("Reflexão registrada!");
    reflectionInput.value = '';
    displayHistory();
});

// Função para registrar o desconforto
submitDiscomfortButton.addEventListener("click", () => {
    if (!discomfortInput.value.trim()) return alert("Por favor, escreva sobre seu desconforto.");
    
    const timestamp = new Date().toLocaleString();
    saveHistory("discomfortHistory", { text: discomfortInput.value, timestamp });
    localStorage.setItem("discomfort", discomfortInput.value);
    
    alert("Desafio do desconforto registrado!");
    discomfortInput.value = '';
    displayHistory();
});

// Exibe progresso e histórico ao carregar a página
window.onload = () => {
    displayProgress();
    displayHistory();
};


