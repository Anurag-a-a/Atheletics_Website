
let createForm = document.getElementById('classCreation');
const classNameInput = document.getElementById('className');
const date1Input = document.getElementById('date1');
const timings1Input = document.getElementById('timings1');
const instructorInput = document.getElementById('instructor');
const descriptionInput = document.getElementById('description');
const maxCapacityInput = document.getElementById('maxCapacity')
let updateForm = document.querySelector('#classUpdation');
const submitBtn = document.querySelector('#updateB');
const classDetails = "{{classDetails}}";

function isValidClassName (className) {
  if (!className) { throw `Error: class name not given`; };
  if (!(typeof className == 'string')) { throw `Error: class name must be a string`; };
  className = className.toLowerCase().trim().replace(/\s+/g, "");
  if (className.length === 0) { throw `Error: class name cannot be an empty string or string with just spaces`; };
  return className;
}

function isValidDescription (description) {
  if (!description) { throw `Error: class description not given`; };
  if (!(typeof description == 'string')) { throw `Error: class description must be a string`; };
  description = description.trim();
  if (description.length === 0) { throw `Error: class description cannot be an empty string or string with just spaces`; };
  return description;
}

function isValidDate(Date){
  const dateFormat = /^\d{2}\/\d{2}\/\d{4}$/;
  const trimmedDate = Date.trim();
  if (!dateFormat.test(trimmedDate)) throw 'Date must be in the format MM/DD/YYYY';
  return Date
}
function isValidTime(timing){
  const timeFormat = /^(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})$/;
  const trimmedTiming = timing.trim();
  const match = trimmedTiming.match(timeFormat);
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
  return timing
}

function isValidClassCapacity  (classCapacity) {
  if (!classCapacity) { throw `Error: class capacity not given`; };
  if (!(typeof classCapacity == 'number')) { throw `Error: class capacity must be a number`; };
  if (isNaN(classCapacity)) { throw `Error: class capacity must be a number`; };
  if (classCapacity < 0 || classCapacity > 100) { throw 'Error: class capacity is over range or lower range'; };
  return classCapacity;
}


function isValidName (name, variable) {
  if (!name) { throw `Error: ${variable} not given`; };
  if (!(typeof name == 'string')) { throw `Error: ${variable} must be a string`; };
  name = name.trim();
  if (name.length === 0) { throw `Error: ${variable} cannot be an empty string or string with just spaces`; };
  return name;
};

createForm.addEventListener('submit', (event) => {
  event.preventDefault();
  
  const isValid = isValidClassName(classNameInput) &&
                  isValidDate(dateInput) &&
                  isValidTime(timings1Input) &&
                  isValidInstructor(instructorInput) &&
                  isValidDescription(descriptionInput) &&
                  isValidClassCapacity(maxCapacityInput);

  if (isValid) {
    createForm.submit();
  }
});

updateForm.addEventListener('update',(event)=>{
  if(classNameInput == classDetails.className && date1Input == classDetails.slots.Date && timings1Input == classDetails.slots.timing && descriptionInput == classDetails.description && instructorInput == classDetails.instructor && maxCapacityInput == classDetails.maxCapacity)
  {
    event.preventDefault();
    alert('please update at least one field')
    return
  }

  const isValid = isValidClassName(classNameInput) &&
                  isValidDate(dateInput) &&
                  isValidTime(timings1Input) &&
                  isValidInstructor(instructorInput) &&
                  isValidDescription(descriptionInput) &&
                  isValidClassCapacity(maxCapacityInput);
if (isValid) {
  updateForm.submit();
  }
});
