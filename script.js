const txtFileURL = 'https://raw.githubusercontent.com/seu-usuario/seu-repositorio/main/users.txt';

// Função para carregar os usuários do arquivo TXT
async function loadUsersFromTXT() {
  try {
    const response = await fetch(txtFileURL);
    if (!response.ok) {
      throw new Error('Falha ao carregar os usuários.');
    }
    const data = await response.text();
    return data.split('\n').map(line => {
      const [email, password, role] = line.split(',');
      return { email, password, role };
    });
  } catch (error) {
    console.error('Erro ao carregar usuários do TXT:', error.message);
    return [];
  }
}

// Evento de submit do formulário de login
document.getElementById('login-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  const users = await loadUsersFromTXT();
  const user = users.find(u => u.email === username && u.password === password);

  if (user) {
    if (user.role === 'admin') {
      document.getElementById('login-container').style.display = 'none';
      document.getElementById('user-management-container').style.display = 'block';
      loadUserList();
    } else {
      alert('Você não tem permissão para acessar a gestão de usuários.');
    }
  } else {
    alert('Nome de usuário ou senha incorretos.');
  }
});

// Evento de submit do formulário de criar conta
document.getElementById('signup-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const username = document.getElementById('signup-username').value;
  const password = document.getElementById('signup-password').value;

  const users = await loadUsersFromTXT();
  const existingUser = users.find(u => u.email === username);

  if (existingUser) {
    alert('Este usuário já existe.');
  } else {
    const newUser = `${username},${password},member\n`;
    const updatedContent = users.join('\n') + newUser;

    const response = await fetch(txtFileURL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'text/plain'
      },
      body: updatedContent
    });

    if (response.ok) {
      alert('Conta criada com sucesso!');
      document.getElementById('signup-form').reset();
    } else {
      alert('Erro ao criar conta.');
    }
  }
});

// Evento de submit do formulário de adicionar usuário
document.getElementById('user-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const email = document.getElementById('new-username').value;
  const password = document.getElementById('new-password').value;
  const role = document.getElementById('new-user-role').value;

  const users = await loadUsersFromTXT();
  users.push(`${email},${password},${role}`);

  const updatedContent = users.join('\n');

  const response = await fetch(txtFileURL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'text/plain'
    },
    body: updatedContent
  });

  if (response.ok) {
    alert('Usuário adicionado com sucesso!');
    document.getElementById('user-form').reset();
    loadUserList();
  } else {
    alert('Erro ao adicionar usuário.');
  }
});

// Função para carregar lista de usuários
async function loadUserList() {
  const userList = document.getElementById('user-list');
  userList.innerHTML = '';

  const users = await loadUsersFromTXT();
  users.forEach(user => {
    const [email, password, role] = user.split(',');
    const li = document.createElement('li');
    li.textContent = `${email} - ${role}`;
    userList.appendChild(li);
  });
}

// Carregar lista de usuários ao carregar a página
loadUserList();

// Alternar entre formulários de login e criar conta
document.getElementById('signup-link').addEventListener('click', function(e) {
  e.preventDefault();
  document.getElementById('login-container').style.display = 'none';
  document.getElementById('signup-container').style.display = 'block';
});

document.getElementById('login-link').addEventListener('click', function(e) {
  e.preventDefault();
  document.getElementById('login-container').style.display = 'block';
  document.getElementById('signup-container').style.display = 'none';
});
