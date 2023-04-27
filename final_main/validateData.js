/* This file contains all the functions to validate inputs to data functions */

import { ObjectId } from 'mongodb';

//validate the id
export const isValidId = (id) => {
    if (!id) { throw "Error: no id provided"; };
    if (!(typeof id == 'string')) { throw "Error: id provided is not a string"; };
    id = id.trim();
    if (id.length === 0) { throw "Error: id consist of only empty spaces"; };
    if (!ObjectId.isValid(id)) { throw "Error: ID is not a valid Object ID"; };
    return id;
};

//validate names
export const isValidname = (name, variable) => {
    if (!name) { throw `Error: ${variable} not given`; };
    if (!(typeof name == 'string')) { throw `Error: ${variable} must be a string`; };
    name = name.trim();
    if (name.length === 0) { throw `Error: ${variable} cannot be an empty string or string with just spaces`; };
    return name;
};

//validate email
export const isValidemail = (email) => {
    if (!email) { throw "Error: no email provided"; };
    if (!(typeof email == 'string')) { throw "Error: email must be a string"; };
    email = email.trim().toLowerCase();
    if(email.length === 0){throw "Error: Email cannot be an empty string or string with just spaces";};
    if(!email.match(/^[^\s\d@]+@[^\s\d@]+\.[^\s\d@]+$/)){
        {throw "Error: Invalid Email";};
    };
    return email;
};

//validate phoneNumber

export const isValidphoneNumber = (phoneNumber) => {
    if (!phoneNumber) { throw "Error: no phoneNumber provided"; };
    if (!(typeof phoneNumber == 'string')) { throw "Error: phoneNumber must be a string"; };
    phoneNumber = phoneNumber.trim();
    if (phoneNumber.length === 0) { throw "Error: phoneNumber cannot be empty"; };
    if (phoneNumber.length > 10) { throw "Error: phoneNumber cannot be more than 10 digits"; };
    let format = /^[0-9]+$/;
    if (!format.test(phoneNumber)) { throw "Error: PhoneNumbers can contain only numbers"; };
    phoneNumber = phoneNumber.slice(0, 3) + '-' + phoneNumber.slice(3, 6) + '-' + phoneNumber.slice(6);
    return phoneNumber;
};

//validate address

export const isValidaddress = (address) => {
    /*
        address: {
            streetName: '1234 NW Bobcat Lane',
            city: 'Hoboken',
            state: 'New Jersey',
            zipCode: '07305'
      }
    */
    if (!address) { throw "Error: no address provided"; };
    let isObjectResult = (typeof address == 'object') && (address != null) && (!Array.isArray(address));
    if (!(isObjectResult)) { throw "Error: address must be an object"; };
    if (address.length == 0) { throw "Error:Invalid address"; };
    if (!address.streetName) { throw "Error: No streetName provided"; };
    if (!address.city) { throw "Error: No city provided"; };
    if (!address.state) { throw "Error: No state provided"; };
    if (!address.zipCode) { throw "Error: No zipCode provided"; };
    if (!(typeof address.streetName == 'string')) { throw "Error: streetName must be a string"; };
    if (!(typeof address.city == 'string')) { throw "Error: city must be a string"; };
    if (!(typeof address.city == 'string')) { throw "Error: city must be a string"; };
    if (!(typeof address.zipCode == 'string')) { throw "Error: zipCode must be a string"; };
    address.streetName = address.streetName.trim();
    address.city = address.city.trim();
    address.state = address.state.trim();
    address.zipCode = address.zipCode.trim();
    if (address.streetName.length === 0) { throw "Error: streetName cannot be empty"; };
    if (address.city.length === 0) { throw "Error: city cannot be empty"; };
    if (address.state.length === 0) { throw "Error: state cannot be empty"; };
    if (address.zipCode.length === 0) { throw "Error: zipCode cannot be empty"; };
    if (address.zipCode.length > 5) { throw "Error: zipCode cannot be more than 5 digits"; };
    let format = /^[0-9]+$/;
    if (!format.test(address.zipCode)) { throw "Error: zipCode can contain only numbers"; };

    return address;

};

//validate password

export const isValidpassword = (password) => {
    /*Password Rules:
        1. Atleast 8 characters long
        2. Should contain atleast 1 number
        3. Should contain atleast 1 special charaters[*@#$%&()+-_]
        4. Should contain atleast one Uppercase letter
        5. Should contain atleast one Lowercase letter
    */
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

    return password; //apply some hashing function before returning or do it in the create function
};

//validate membershipPlanDetails

export const isValidmembershipPlanDetails = (plan) => {
    if (!plan) { throw "Error: no plan provided"; };
    if (!(typeof plan == 'string')) { throw "Error: plan must be a string"; };
    plan = plan.trim().toLowerCase();
    if (plan.length === 0) { throw "Error: plan cannot be an empty string or string with just spaces"; };
    if (!((plan == "alpha") || (plan == "beta") || (plan == "omega") || (plan == "n/a"))) { throw "Error: Invalid plan"; };
    return plan;
};

//validate role

export const isValidRole = (role) => {
    if (!role) { throw "Error: no role provided"; };
    if (!(typeof role == 'string')) { throw "Error: role must be a string"; };
    role = role.trim().toLowerCase();
    if (role.length === 0) { throw "Error: role cannot be an empty string or string with just spaces"; };
    if (!((role == 'user') || (role == 'management'))) { throw "Error: Invalid Role" };
    return role;
};

//validate action

export const isValidAction = (action) => {
    if (!action) { throw "Error: no action provided"; };
    if (!(typeof action == 'string')) { throw "Error: action must be a string"; };
    action = action.trim().toLowerCase();
    if (action.length === 0) { throw "Error: action cannot be an empty string or string with just spaces"; };
    if ((action != 'delete') || (action != 'add')) { throw "Error: Invalid action" };
    return action;
};


//validate sex
export const isValidSex = (sex) => {
    if (!sex) { throw "Error: no sex provided"; };
    if (!(typeof sex == 'string')) { throw "Error: sex must be a string"; };
    sex = sex.trim().toLowerCase();
    if (sex.length === 0) { throw "Error: sex cannot be an empty string or string with just spaces"; };
    if ((sex != 'male') || (sex != 'female') || (sex != 'non-binary') || (sex != 'prefer not to say')) { throw "Error: Invalid sex" };
    return sex;

};

//validate dob
//not implemented to validate the date ie. days and month relation and also leap years.
export const isValidDOB = (dob) => {
    if (!dob) { throw "Error: no date of birth provided"; };
    if (!(typeof dob == 'string')) { throw "Error: date of birth must be a string"; };
    dob = dob.trim();
    if (dob.length != 10) { throw "Error: Invalid date of birth"; };
    let format = /^(0?[1-9]|1[0-2])[\/](0?[1-9]|[1-2][0-9]|3[01])[\/]\d{4}$/;
    if (!format.test(dob)) { throw "Error: Invalid date of birth"; };
    let month = Number(dob.slice(0, 2));
    let day = Number(dob.slice(3, 5));
    let year = Number(dob.slice(6));
    if ((day < 1) || (day > 31) || (month < 1) || (month > 12) || (year < 0) || (year > 2010)) { throw "Error: Invalid date"; };
    if (year > 2010) { throw "Error: User needs to be age 13 and above to sign up"; };

    return dob;
};


// validate reviewText
export const isValidreviewText = (reviewText) => {
    if (!reviewText) throw 'You must provide review information';
    if (typeof reviewText !== 'string') throw 'reviewText must be a string';
    if (reviewText.trim().length === 0) throw 'reviewText cannot be an empty string or string with just spaces';
    reviewText = reviewText.trim();
    return reviewText;
}

// validate Rating
export const isValidRating = (rating) => {
    if (!rating) throw 'You must provide a rating';
    if (typeof rating !== 'number') throw 'yrating must be a number'
    if (rating < 0 || rating > 5 || (!Number.isInteger(rating * 10) && !Number.isInteger(rating))) {
        throw 'rating must between 0-5 and rating must be integer or one decimal place float';
    }
    return rating;
}

// validate TimeSlot
export const isValidTimeSlot = (selectedTimeSlot) => {
    if (!selectedTimeSlot) throw 'You must provide a selectedTimeSlot object';
    if (typeof selectedTimeSlot !== 'object') throw 'selectedTimeSlot must be an object';
    const { Date, timing } = selectedTimeSlot;

    // Check date format
    const dateFormat = /^\d{2}\/\d{2}\/\d{4}$/;
    Date = Date.trim();
    if (!dateFormat.test(Date.trim())) throw 'Date must be in the format MM/DD/YYYY';

    // Check timing format and constraints
    const timeFormat = /^(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/;
    const match = timing.trim().match(timeFormat);
    timing = timing.trim();
    if (!match) throw 'timing must be in the format HH:mm - HH:mm (24-hour format)';
    const startTime = match[1];
    const endTime = match[2];
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    if (startHour < 0 || startHour > 23 || startMinute < 0 || startMinute > 59) {
        throw 'Invalid start time';
    }
    if (endHour < 0 || endHour > 23 || endMinute < 0 || endMinute > 59) {
        throw 'Invalid end time';
    }
    if (startHour > endHour || (startHour === endHour && startMinute >= endMinute)) {
        throw 'End time must be greater than start time';
    }
    return selectedTimeSlot;
}

// validate CancelledOrNot
export const isValidCancelledOrNot = (cancelledOrNot) => {
    if (cancelledOrNot === undefined || cancelledOrNot === null) {
        throw 'You must provide a value for cancelledOrNot';
    }
    if (typeof cancelledOrNot === 'boolean') {
        return cancelledOrNot;
    }
    if (typeof cancelledOrNot === 'string') {
        const lowerCaseValue = cancelledOrNot.trim().toLowerCase();
        if (lowerCaseValue === 'true') {
            return true;
        } else if (lowerCaseValue === 'false') {
            return false;
        }
    }
    throw 'cancelledOrNot must be a boolean value, either true or false';
}

//validate username
export const isValidUsername = (username) => {
    if(!username){throw `Error: username not given`;};
    if(!(typeof username == 'string')){throw `Error: username must be a string`;};
    username = username.trim();
    if(username.length === 0){throw `Error: username cannot be an empty string or string with just spaces`;};
    return username.toLowerCase();

//validate class capacity
export const isValidClassCapacity = (classCapacity) => {
    if (!classCapacity) { throw `Error: class capacity not given`; };
    if (!(typeof classCapacity == 'number')) { throw `Error: class capacity must be a number`; };
    if (isNaN(classCapacity)) { throw `Error: class capacity must be a number`; };
    if (classCapacity < 0 || classCapacity > 100) { throw 'Error: class capacity is over range or lower range'; };
    return classCapacity;
}