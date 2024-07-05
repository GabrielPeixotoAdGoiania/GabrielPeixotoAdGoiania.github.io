// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCH-yb2Ih2mE0MqCAhFupXx5D88lGDkfL0",
  authDomain: "louvoradgoiania.firebaseapp.com",
  projectId: "louvoradgoiania",
  storageBucket: "louvoradgoiania.appspot.com",
  messagingSenderId: "737579354277",
  appId: "1:737579354277:web:..."
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const email = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      db.collection('users').doc(user.uid).get().then(doc => {
        const userData = doc.data();
        document.getElementById('login-container').style.display = 'none';
        if (userData.role === 'admin') {
          document.getElementById('user-management-container').style.display = 'block';
          alert(`Bem-vindo, ${user.email}! Você está logado como administrador.`);
          loadUserList();
        } else {
          document.getElementById('schedule-container').style.display = 'block';
          alert(`Bem-vindo, ${user.email}! Você está logado como usuário comum.`);
        }
      });
    })
    .catch((error) => {
      alert('Nome de usuário ou senha incorretos!');
    });
});

document.getElementById('logout-button').addEventListener('click', function() {
  auth.signOut().then(() => {
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('schedule-container').style.display = 'none';
  });
});

document.getElementById('logout-button-user').addEventListener('click', function() {
  auth.signOut().then(() => {
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('user-management-container').style.display = 'none';
  });
});

document.getElementById('member-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('member-name').value;
  const role = document.getElementById('member-role').value;

  if (name && role) {
    const li = document.createElement('li');
    li.innerHTML = `${name} - ${role} <button onclick="removeMember(this)">Remover</button>`;

    document.getElementById('member-list').appendChild(li);

    document.getElementById('member-form').reset();
  }
});

document.getElementById('user-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const email = document.getElementById('new-username').value;
  const password = document.getElementById('new-password').value;
  const role = document.getElementById('new-user-role').value;

  if (email && password && role) {
    auth.createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        db.collection('users').doc(user.uid).set({ email, role })
          .then(() => {
            const li = document.createElement('li');
            li.innerHTML = `${email} - ${role} <button onclick="removeUser(this, '${user.uid}')">Remover</button>`;
            document.getElementById('user-list').appendChild(li);
            document.getElementById('user-form').reset();
          });
      })
      .catch((error) => {
        alert(error.message);
      });
  }
});

function removeMember(button) {
  const li = button.parentElement;
  li.remove();
}

function removeUser(button, uid) {
  const li = button.parentElement;
  li.remove();

  db.collection('users').doc(uid).delete().then(() => {
    auth.deleteUser(uid).catch((error) => {
      console.error("Error removing user: ", error);
    });
  });
}

function loadUserList() {
  const userList = document.getElementById('user-list');
  userList.innerHTML = '';

  db.collection('users').get().then((snapshot) => {
    snapshot.forEach((doc) => {
      const user = doc.data();
      const li = document.createElement('li');
      li.innerHTML = `${user.email} - ${user.role} <button onclick="removeUser(this, '${doc.id}')">Remover</button>`;
      userList.appendChild(li);
    });
  });
}
