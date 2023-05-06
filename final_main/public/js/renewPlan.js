// (function ($) {
//     // let plan = $('#new-item-form'),
//     var renewButton = $('#plan_renew_button');
//     let requestConfig = {
//         method: 'POST',
//         url: '/renewplan'
//     };
//     //        alert('Your plan has been renewed for another one year');
//     $.ajax(requestConfig).then(function (responseMessage) {
//         alert('Your plan has been renewed for another one year');   
//     });


// })(window.jQuery);


$(document).ready(function() {

    updatePage();
  
    $("#plan_renew_button").click(function(e) {
       e.preventDefault();
  
       updatePage();
    });
  
  
   });
  
  function updatePage(){
      $.ajax({
           url: "renewplan",
           dataType: "json",
           data: { 
               //id: $(this).val(),
           },
           success: function(result) {
  
          alert(JSON.stringify(result));
  
           },
           error: function(result) {
           console.log(result);
           }
  
       });
  }