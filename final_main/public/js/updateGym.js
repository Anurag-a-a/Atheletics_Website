$(document).ready(function() {
    $('.updatebtn').click(function(event) {
        event.preventDefault(); 
      let gymId = $(this).data('gym-id');
      
      window.location.replace('/gym/updateGym/' + gymId);
      console.log(window.location.href)
    });
});