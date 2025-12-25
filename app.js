<script src="app.js">// CONFIGURAÇÃO FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyAyIlBwH809CXTPl3JvbzAutOpqMpr-oGk",
    authDomain: "meufinanceirosmart.firebaseapp.com",
    projectId: "meufinanceirosmart",
    storageBucket: "meufinanceirosmart.firebasestorage.app",
    messagingSenderId: "540463598334",
    appId: "1:540463598334:web:33c06d19288c7049e433af"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let myChart;
let userData = { transactions: [] };

// NAVEGAÇÃO
function navegar(id) {
    document.querySelectorAll('main section').forEach(s => s.style.display = 'none');
    document.getElementById('sec-' + id).style.display = 'block';
    
    // Atualiza classe ativa no menu
    const links = document.querySelectorAll('.nav-links li');
    links.forEach(l => l.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

// AUTENTICAÇÃO GOOGLE
// CONFIGURAÇÃO FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyAyIlBwH809CXTPl3JvbzAutOpqMpr-oGk",
    authDomain: "meufinanceirosmart.firebaseapp.com",
    projectId: "meufinanceirosmart",
    storageBucket: "meufinanceirosmart.firebasestorage.app",
    messagingSenderId: "540463598334",
    appId: "1:540463598334:web:33c06d19288c7049e433af"
};

// Inicialização Segura
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// Tornar a função global para o HTML encontrar
window.loginGoogle = function() {
    console.log("Botão clicado! Iniciando login...");
    const provider = new firebase.auth.GoogleAuthProvider();
    
    // signInWithPopup costuma funcionar melhor em desktops
    // Se estiver no celular, o Redirect é mais estável
    auth.signInWithPopup(provider)
        .then((result) => {
            console.log("Usuário logado:", result.user.displayName);
            verificarUsuario(result.user);
        })
        .catch((error) => {
            console.error("Erro no login:", error.code, error.message);
            alert("Erro ao logar: " + error.message);
        });
};

function verificarUsuario(user) {
    db.collection("usuarios").doc(user.uid).get().then((doc) => {
        if (doc.exists) {
            document.getElementById('login-overlay').style.display = 'none';
            // Chame sua função de carregar dashboard aqui
            // carregarDados(); 
        } else {
            document.getElementById('btn-login-main').style.display = 'none';
            document.getElementById('cadastro-form').style.display = 'block';
        }
    });
}

// Para garantir que o script carregou
console.log("Smart Finance: app.js carregado com sucesso!");
}
function salvarPerfil() {
    const nome = document.getElementById('reg-nome').value;
    const tel = document.getElementById('reg-tel').value;
    
    if(!nome || !tel) return alert("Preencha os campos obrigatórios!");

    const perfil = {
        nome: nome,
        tel: tel,
        apelido: document.getElementById('reg-apelido').value || "Membro Smart",
        email: auth.currentUser.email,
        dataCriacao: new Date()
    };

    db.collection("usuarios").doc(auth.currentUser.uid).set(perfil).then(() => {
        entrar(auth.currentUser);
    });
}

function entrar(user) {
    document.getElementById('login-overlay').style.display = 'none';
    document.getElementById('welcome-text').innerText = "Olá, " + (user.displayName || "Usuário");
    document.getElementById('user-mail-display').innerText = user.email;
    carregarDados();
}

// MANIPULAÇÃO DE DADOS
function carregarDados() {
    db.collection("usuarios").doc(auth.currentUser.uid).collection("transacoes")
    .orderBy("date", "desc")
    .onSnapshot(snap => {
        userData.transactions = snap.docs.map(d => d.data());
        renderUI();
    });
}

function renderUI() {
    const listIn = userData.transactions.filter(t => t.type === 'in');
    const listOut = userData.transactions.filter(t => t.type === 'out');
    
    const totalIn = listIn.reduce((a,b) => a + b.val, 0);
    const totalOut = listOut.reduce((a,b) => a + b.val, 0);

    document.getElementById('bal-total').innerText = "R$ " + (totalIn - totalOut).toFixed(2);
    document.getElementById('bal-in').innerText = "R$ " + totalIn.toFixed(2);
    document.getElementById('bal-out').innerText = "R$ " + totalOut.toFixed(2);

    // Atualizar Tabela
    const tbody = document.getElementById('table-extrato');
    tbody.innerHTML = userData.transactions.slice(0, 10).map(t => `
        <tr style="border-bottom: 1px solid #334155;">
            <td style="padding:10px">${t.date}</td>
            <td>${t.desc}</td>
            <td class="${t.type === 'in' ? 'text-success' : 'text-danger'}">
                R$ ${t.val.toFixed(2)}
            </td>
        </tr>
    `).join('');

    // Atualizar Gráfico
    const methods = ['Dinheiro/Pix', 'Débito', 'Crédito'];
    const vals = methods.map(m => listOut.filter(t => t.method === m).reduce((a,b) => a + b.val, 0));
    myChart.data.datasets[0].data = vals;
    myChart.update();

    // Inteligência de Práticas
    document.getElementById('list-boas').innerHTML = totalIn > totalOut ? "<li>Saldo mensal positivo.</li>" : "";
    document.getElementById('list-mas').innerHTML = vals[2] > (totalIn * 0.3) ? "<li>Uso de crédito acima do recomendável (30%).</li>" : "";
}

// EVENTOS
document.getElementById('finance-form').onsubmit = (e) => {
    e.preventDefault();
    const t = {
        desc: document.getElementById('f-desc').value,
        val: parseFloat(document.getElementById('f-val').value),
        method: document.getElementById('f-method').value,
        type: document.getElementById('f-type').value,
        date: document.getElementById('f-date').value
    };
    db.collection("usuarios").doc(auth.currentUser.uid).collection("transacoes").add(t);
    e.target.reset();
};

function excluirConta() {
    if(confirm("Deseja excluir permanentemente sua conta e todos os seus dados?")) {
        db.collection("usuarios").doc(auth.currentUser.uid).delete().then(() => {
            alert("Conta excluída com sucesso, boa sorte na sua jornada!");
            location.reload();
        });
    }
}

// Inicializar Gráfico ao carregar
window.onload = () => {
    const ctx = document.getElementById('mainChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: { 
            labels: ['Pix', 'Débito', 'Crédito'], 
            datasets: [{ 
                data:[0,0,0], 
                backgroundColor:['#6366f1','#a855f7','#ef4444'],
                borderWidth: 0
            }] 
        },
        options: { 
            maintainAspectRatio: false, 
            plugins: { legend: { position: 'bottom', labels: {color:'#fff'} } } 
        }
    });
};</script>