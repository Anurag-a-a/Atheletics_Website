const form = document.querySelector('form');
const branchName = form.querySelector('#branchName');
const website = form.querySelector('#website');
const streetName = form.querySelector('#streetName');
const city = form.querySelector('#city');
const state = form.querySelector('#state');
const zipCode = form.querySelector('#zipCode');
const phoneNumber = form.querySelector('#phoneNumber');
const email = form.querySelector('#email');
const maxCapacity = form.querySelector('#maxCapacity');


const isValidBranch = (branchName) => {
  if (!branchName) { throw "Error: no branchName provided"; };
  if (!(typeof branchName == 'string')) { throw "Error: branchName must be a string"; };
  branchName = branchName.trim();
  if (branchName.length === 0) { throw "Error: branchName cannot be an empty string or string with just spaces"; };

  return branchName;
};

//validate email
const isValidEmail = (email) => {
  if(!email){throw "Error: no email provided";};
  if(!(typeof email == 'string')){throw "Error: email must be a string";};
  email = email.trim().toLowerCase();
  if(email.length === 0){throw "Error: Email cannot be an empty string or string with just spaces";};
  if(!(/^(?!.*\.\.)+([^.]+[A-Za-z0-9_.! @\\#"()$%&'*+/=?^`{|}~-])+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]{2,3})*$/.test(email)))
      {throw "Error: Invalid Email";};
  return email;
};

function validatePhoneNumber(phoneNumber) {
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

function validateStreetName(streetName) {
  if (!streetName) { throw "Error: No streetName provided"; };
  if (typeof streetName != 'string') { throw "Error: streetName must be a string"; };
  streetName = streetName.trim();
  if (streetName.length === 0) { throw "Error: streetName cannot be empty"; };
  return streetName;
};
function validateCity(city){
  if (!city) { throw "Error: No city provided"; };
  if (!(typeof city == 'string')) { throw "Error: city must be a string"; };
  city = city.trim();
  if (city.length === 0) { throw "Error: city cannot be empty"; };
  return city;
};
function validateState(state){
  if (!state) { throw "Error: No state provided"; };
  if (typeof state != 'string') { throw "Error: state must be a string"; };
  state = state.trim();
  if (state.length === 0) { throw "Error: state cannot be empty"; };
  let list_of_states = [
      "alabama", "alaska", "arizona", "arkansas", "california", "colorado", "connecticut", "delaware", "florida",
      "georgia", "hawaii", "idaho", "illinois", "indiana", "iowa", "kansas", "kentucky", "louisiana", "maine",
      "maryland", "massachusetts", "michigan", "minnesota", "mississippi", "missouri", "montana", "nebraska",
      "nevada", "new hampshire", "new jersey", "new mexico", "new york", "north carolina", "north dakota", "ohio",
      "oklahoma", "oregon", "pennsylvania", "rhode island", "south carolina", "south dakota", "tennessee", "texas",
      "utah", "vermont", "virginia", "washington", "west virginia", "wisconsin", "wyoming",'al', 'ak', 'az', 'ar', 'ca', 'co', 'ct', 'de', 'fl', 'ga', 'hi', 'id', 'il', 'in', 'ia', 'ks', 'ky', 'la',
      'me', 'md', 'ma', 'mi', 'mn', 'ms', 'mo', 'mt', 'ne', 'nv', 'nh', 'nj', 'nm', 'ny', 'nc', 'nd', 'oh', 'ok',
      'or', 'pa', 'ri', 'sc', 'sd', 'tn', 'tx', 'ut', 'vt', 'va', 'wa', 'wv', 'wi', 'wy'
  ]
  let s = state.toLowerCase();
  if(!list_of_states.includes(s)) {throw "Error: State not valid. Enter a state in US."}
  return state;
};
function validateZipcode(zipCode) {

  if (!zipCode) { throw "Error: No zipCode provided"; };
  if (typeof zipCode != 'string') { throw "Error: zipCode must be a string"; };
  zipCode = zipCode.trim();
  if (zipCode.length === 0) { throw "Error: zipCode cannot be empty"; };
  if (zipCode.length > 5) { throw "Error: zipCode cannot be more than 5 digits"; };
  let format = /^[0-9]+$/;
  if (!format.test(zipCode)) { throw "Error: zipCode can contain only numbers"; };
  return zipCode;
};

const isValidWebsite= (website) => {
  if (!website) { throw "Error: no website provided"; };
  if (!(typeof website == 'string')) { throw "Error: website must be a string"; };
  website = website.trim();
  if (website.length === 0) { throw "Error: website cannot be an empty string or string with just spaces"; };
  let format =  /^http?(s):\/\/www\.[-a-zA-Z0-9@:%._\+~#=]{5,256}\.com$/;
  if (!format.test(website)) { throw "Error: Invalid website"; };
  return website;

};

const isValidCapacity = (capacity) => {
  if (!capacity) throw 'You must provide a rating';
  if (typeof capacity !== 'number') throw 'yrating must be a number'
  if (capacity < 0 || capacity > 100 || (!Number.isInteger(capacity * 10) && !Number.isInteger(capacity))) {
      throw 'rating must between 0-5 and rating must be integer or one decimal place float';
  }
  return capacity;
}


form.addEventListener('submit', (event) => {
//  event.preventDefault();

  let isValid = true;




});