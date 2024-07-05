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

function removeMember(button) {
  const li = button.parentElement;
  li.remove();
}
