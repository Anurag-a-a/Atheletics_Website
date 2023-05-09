( function () {
    function validateEmail(email){
        if(!email){throw "Error: no email provided";};
        if(!(typeof email == 'string')){throw "Error: email must be a string";};
        email = email.trim().toLowerCase();
        if(email.length === 0){throw "Error: Email cannot be an empty string or string with just spaces";};
        if(!(/^(?!.*\.\.)+([^.]+[A-Za-z0-9_.! @\\#"()$%&'*+/=?^`{|}~-])+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]{2,3})*$/.test(email)))
        {throw "Error: Invalid Email";};
        return email;
    };

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

    const formSignIn = document.getElementById('signIn-form');
    if(formSignIn) {
        //get the Element object with the specified id
        alert("Password successfully updated. Login again");
        const email = document.getElementById('emailAddress');
        const password = document.getElementById('passwordInput');
        const errorContainer = document.getElementById('error-container');
        const errorTextElement = errorContainer.getElementsByClassName('text-goes-here')[0];

        formSignIn.addEventListener('submit', (event) => {
            // event.preventDefault();
            const validInputsList = [];
            try {
                errorContainer.classList.add('hidden');
                const emailString = validateEmail(email.value);
                validInputsList.push(emailString);
                const passwordString = validatePassword(password.value);
                errorContainer.style.display = 'none';

            }catch(e){
                event.preventDefault();
                const message = typeof e === 'string' ? e : e.message;
                errorTextElement.textContent = e;
                errorContainer.style.display = 'block';
                errorContainer.classList.remove('hidden');
                if(validInputsList.length == 0) { formSignIn.reset();} 
                else {
                    /*below two lines of code reference from:
                      https://stackoverflow.com/questions/40531459/clear-a-single-form-field-in-html */
                    var f = formSignIn.elements;
                    f["passwordInput"].value = "";
                };
            };//close try-catch block
        });//close the eventListener
    };//close if(formSignIn)
}) ();
