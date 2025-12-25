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
            document.getElementById('').style.display = 'none';
            document.getElementById('').style.display = 'block';
        }
    });
}

// Para garantir que o script carregou
console.log("Smart Finance: app.js carregado com sucesso!");

