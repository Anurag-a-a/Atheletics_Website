$(document).ready(function() {
    $('#checkin-form').submit(function(event) {
      event.preventDefault();
      function validateUsername(username){
        if(!username){throw `Error: username not given`;};
        if(!(typeof username == 'string')){throw `Error: username must be a string`;};
        username = username.trim();
        if(username.length === 0){throw `Error: username cannot be an empty string or string with just spaces`;};
        if((username.length < 3) || (username.length > 15)) {throw 'Error: Username length has to be between 3 and 15';};
        if(!(/^[a-zA-Z0-9!@#$%^&*-_+=|~]+$/.test(username))) {throw 'Error: Username can contain only alphabets a-z, numbers 0-9 and !@#$%^&*-_+=|~`';};
        return username.toLowerCase();
    };

      let username = document.getElementById('username');
      username = validateUsername(username);
  
      $.ajax({
        url: '/gym/checkin',
        type: 'POST',
        data: {username: username},
        success: function(response) {
          $('#current-population').text(response.CurrentCapacity);
  
          alert('Check-in successful!');
        },
        error: function(xhr, status, error) {
          alert('Error: ' + error);
        }
      });
    });
  });