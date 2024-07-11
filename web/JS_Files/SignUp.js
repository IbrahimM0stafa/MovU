document.addEventListener('DOMContentLoaded', function() {
  
    var home = document.querySelector('.logo');
    
    home.addEventListener('click', function() {
        
        window.location.href = '/home';
    });
  });

  const urlParams = new URLSearchParams(window.location.search);
  const usernameExists = urlParams.get('usernameExists');

  // If usernameExists parameter is present, show an alert
  if (usernameExists) {
      alert('Username already exists. Please choose another username.');
  }