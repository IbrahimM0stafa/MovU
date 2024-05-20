document.addEventListener('DOMContentLoaded', function() {
  
    var register = document.querySelector('.register-link');
    var logo = document.querySelector('.logo');
    
    register.addEventListener('click', function() {
        
        window.location.href = 'SignUp.html';
    });
    logo.addEventListener('click', function() {
        
        window.location.href = 'home.html';
    });
  });