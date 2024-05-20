document.addEventListener('DOMContentLoaded', function() {
  
    var help = document.querySelector('.help');
    var logo = document.querySelector('.logo');
    
    help.addEventListener('click', function() {
        
        window.location.href = 'help.html';
    });
    logo.addEventListener('click', function() {
        
        window.location.href = 'home.html';
    });
  });