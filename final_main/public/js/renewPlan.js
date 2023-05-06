
function renewplan(){
    const xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        document.getElementById("demo").innerHTML = this.responseText;
      }
	alert('Your plan has been renewed for another one year');
}