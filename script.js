// Configurações do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCH-yb2Ih2mE0MqCAhFupXx5D88lGDkfL0",
  authDomain: "louvoradgoiania.firebaseapp.com",
  projectId: "louvoradgoiania",
  storageBucket: "louvoradgoiania.appspot.com",
  messagingSenderId: "737579354277",
  appId: "1:737579354277:web:af3a85ab05f95a4d27bf2b"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

document.addEventListener('DOMContentLoaded', function() {
  const loginLink = document.getElementById('login-link');
  const loginForm = document.getElementById('login-form');
  
  loginLink.addEventListener('click', function() {
    loginForm.style.display = 'block';
  });
  
  const modal = document.getElementById('login-modal');
  
  modal.addEventListener('submit', function(event) {
    event.preventDefault();
    const uname = modal.uname.value;
    const psw = modal.psw.value;
    
    // Autenticação com Firebase
    auth.signInWithEmailAndPassword(uname + '@louvoradgoiania.com', psw)
      .then((userCredential) => {
        // Login bem-sucedido
        const user = userCredential.user;
        alert('Login bem-sucedido! Redirecionando para a gestão de usuários.');
        window.location.href = '#'; // Redireciona para a gestão de usuários
      })
      .catch((error) => {
        // Erro de login
        const errorCode = error.code;
        const errorMessage = error.message;
        alert('Credenciais inválidas. Tente novamente.');
      });
  });
});
