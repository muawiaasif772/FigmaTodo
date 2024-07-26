const email = document.getElementById('email');
const password = document.getElementById('pass');
const showBtn = document.getElementById('show-btn');
const loginBtn = document.getElementById('login-btn');
const invalidMsg = document.querySelector('.invalid');

if (!localStorage.key('user')) {
  localStorage.setItem(
    'user',
    JSON.stringify({
      email: 'ahad75366@gmail.com',
      password: 'ahad123',
    })
  );
}

const myData = JSON.parse(localStorage.getItem('user'));

showBtn.addEventListener('click', function () {
  if (password.type === 'password') password.type = 'text';
  else password.type = 'password';
});

loginBtn.addEventListener('click', function () {
  if (
    email.value === myData['email'] &&
    password.value === myData['password']
  ) {
    invalidMsg.classList.add('hide');
    window.location.href = './index.html';
  } else {
    invalidMsg.classList.remove('hide');
  }
});
