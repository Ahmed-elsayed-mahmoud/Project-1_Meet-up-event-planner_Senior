(function() {
  'use strict';

  var firebase = new Firebase('https://meet-up-event-planner.firebaseio.com');

  let emailInput = document.querySelector('input[type="email"]');
  let passwordInput = document.querySelector('input[type="password"]');
  let submit = document.querySelector('button[type="submit"]');
  let validationMessage = document.querySelector('#validation-message');

  submit.onclick = function() {
    event.preventDefault();
    firebase.authWithPassword({
      email: emailInput.value,
      password: passwordInput.value
    }, function(error, authData) {
      if (error) {
        validationMessage.innerHTML = error;
        console.log('Login Failed!', error);
      } else {
        validationMessage.innerHTML = 'Authenticated successfully';
        console.log('Authenticated successfully with payload:', authData);
        window.location.href = 'create-event.html';
      }
    });
  };

}());
