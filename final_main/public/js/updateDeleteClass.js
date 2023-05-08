$(document).ready(function() {
    $('.updatebtn').click(function(event) {
        event.preventDefault(); 
      let classId = $(this).data('class-id');
      
      window.location.replace('/class/updateClass/' + classId);
      console.log(window.location.href)
    });
    
    $('.deletebtn').click(function(event) {
        event.preventDefault();
      // Get the class ID and form ID from the button's data attributes
      let classId = $(this).data('class-id');
      if (confirm('Are you sure you want to delete this class?')) {
        window.location.replace('/class/deleteClass/' + classId);
      }
    });
  });