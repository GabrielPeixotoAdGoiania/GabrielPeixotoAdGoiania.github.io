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

// Evento de submit do formulário de adicionar usuário
document.getElementById('user-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const email = document.getElementById('new-username').value;
  const password = document.getElementById('new-password').value;
  const role = document.getElementById('new-user-role').value;

  // Carregar usuários atuais do TXT
  let users = await loadUsersFromTXT();

  // Adicionar novo usuário ao array
  users.push(`${email},${password},${role}`);

  // Montar novo conteúdo do arquivo TXT
  const updatedContent = users.join('\n');

  // Fazer upload do TXT atualizado de volta para o GitHub (não é uma prática recomendada para produção!)
  const response = await fetch(txtFileURL, {
    method: 'PUT', // Usar PUT para atualizar um arquivo no GitHub
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
