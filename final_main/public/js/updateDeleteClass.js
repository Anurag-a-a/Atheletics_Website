$(document).ready(function() {
    $('.det-updatebtn').click(function(event) {
        event.preventDefault(); 
      let classId = $(this).data('class-id');
      
      window.location.replace('/class/updateClass/' + classId);
    });
    

    $('.det-deletebtn').click(function(event) {
        event.preventDefault();
      // Get the class ID and form ID from the button's data attributes
      let classId = $(this).data('class-id');
      if (confirm('Are you sure you want to delete this class?')) {
        $.ajax({
          url: '/class/deleteClass/'+classId,
          type: 'delete',
          success: function(response) {
            alert('Delete successful!');
            window.location.replace('/class/classDetails/');
          },
          error: function(xhr, status, error) {
            alert('Error: ' + error);
          }
        });
        
      }
    });
  });