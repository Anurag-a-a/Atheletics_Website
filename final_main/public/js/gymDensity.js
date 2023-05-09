
$(document).ready(function() {
    $('#location-list').on('change', function() {
      var selectedLocation = $(this).val();  
      $.ajax({
        url: '/user/gymdensity', 
        method: 'POST',
        data: {location: selectedLocation}, 
        success: function(response) {
          $('#current-density').text(response);
        },
        error: function() {
          alert('Failed to retrieve gym capacity for ' + selectedLocation);
        }
      });
    });
  });