document.addEventListener('DOMContentLoaded', function() {
  
    var register = document.querySelector('.register-link');
    var logo = document.querySelector('.logo');
    
    register.addEventListener('click', function() {
        
        window.location.href = '/SignUp';
    });
    logo.addEventListener('click', function() {
        
        window.location.href = '/home';
    });
  });

  const urlParams = new URLSearchParams(window.location.search);
  const loginFailed = urlParams.get('loginFailed');

  // If usernameExists parameter is present, show an alert
  if (loginFailed) {
      alert('Wrong Username or Password. Please enter valid data.');
  }