//client side validation codes for sign in forms

( function () {
    // console.log("here in client side script")

    function validatePassword(password){
        if (!password) { throw "Error: no password provided"; };
        if (!(typeof password == 'string')) { throw "Error: Password must be a string"; };
        password = password.trim();
        if (password.length === 0) { throw "Error: Password cannot be an empty string or string with just spaces"; };
        if (password.length < 8) { throw "Error: Password must be atleast 8 characters long"; };
        let format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        if (!format.test(password)) { throw "Error: Password must contain atleast one special characters[!@#$%^&*()|\,./?<>]" };
        format = /\d/;
        if (!format.test(password)) { throw "Error: Password must contain atleast one number" };
        format = /[A-Z]/;
        if (!format.test(password)) { throw "Error: Password must contain atleast one uppercase charater" };
        format = /[a-z]/;
        if (!format.test(password)) { throw "Error: Password must contain atleast one lowercase charater" };
    
        return password;
    };
    function validateSecondPassword(firstp, secondp){
        if(firstp != secondp) {throw "Error: Passwords do not match."};
        return secondp;
    };

    const formUpdatePassword = document.getElementById('updatePassword-form');
    // console.log("here in client side script")
    if(formUpdatePassword) {
        //get the Element object with the specified id
        const password = document.getElementById('passwordInput');
        const npassword = document.getElementById('newpasswordInput');
        const cnpassword = document.getElementById('cnewpasswordInput');
        const errorContainer = document.getElementById('error-container');
        const errorTextElement = errorContainer.getElementsByClassName('text-goes-here')[0];
        

        formSignIn.addEventListener('submit', (event) => {
            // event.preventDefault();
            try {
                // console.log("inside client side validation");
                errorContainer.classList.add('hidden');
                const passwordString = validatePassword(password.value);
                const npasswordString = 
                errorContainer.style.display = 'none';

            }catch(e){
                event.preventDefault();
                const message = typeof e === 'string' ? e : e.message;
                errorTextElement.textContent = e;
                errorContainer.style.display = 'block';
                errorContainer.classList.remove('hidden');
                if(validInputsList.length == 0) { formSignIn.reset();} 
                else {
                  
                    var f = formSignIn.elements;
                    f["passwordInput"].value = "";
                };
            };//close try-catch block
        });//close the eventListener
    };//close if(formSignIn)
}) ();