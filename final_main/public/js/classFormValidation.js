const form = document.getElementById('classCreation');
const classNameInput = document.getElementById('className');
const date1Input = document.getElementById('date1');
const timings1Input = document.getElementById('timings1');
const instructorInput = document.getElementById('instructor');
const descriptionInput = document.getElementById('description');

export const isValidClassName = (className) => {
  if (!className) { throw `Error: class name not given`; };
  if (!(typeof className == 'string')) { throw `Error: class name must be a string`; };
  className = className.toLowerCase().trim().replace(/\s+/g, "");
  if (className.length === 0) { throw `Error: class name cannot be an empty string or string with just spaces`; };
  return className;
}

export const isValidDescription = (description) => {
  if (!description) { throw `Error: class description not given`; };
  if (!(typeof description == 'string')) { throw `Error: class description must be a string`; };
  description = description.trim();
  if (description.length === 0) { throw `Error: class description cannot be an empty string or string with just spaces`; };
  return description;
}

export const isValidTimeSlot = (selectedTimeSlot) => {
  if (!selectedTimeSlot) throw 'You must provide a selectedTimeSlot object';
  if (typeof selectedTimeSlot !== 'object') throw 'selectedTimeSlot must be an object';
  const { Date, timing } = selectedTimeSlot;

  // Check date format
  const dateFormat = /^\d{2}\/\d{2}\/\d{4}$/;
  const trimmedDate = Date.trim();
  if (!dateFormat.test(trimmedDate)) throw 'Date must be in the format MM/DD/YYYY';

  // Check timing format and constraints
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
  return { ...selectedTimeSlot, Date: trimmedDate, timing: trimmedTiming };
}

export const isValidClassCapacity = (classCapacity) => {
  if (!classCapacity) { throw `Error: class capacity not given`; };
  if (!(typeof classCapacity == 'number')) { throw `Error: class capacity must be a number`; };
  if (isNaN(classCapacity)) { throw `Error: class capacity must be a number`; };
  if (classCapacity < 0 || classCapacity > 100) { throw 'Error: class capacity is over range or lower range'; };
  return classCapacity;
}


export const isValidName = (name, variable) => {
  if (!name) { throw `Error: ${variable} not given`; };
  if (!(typeof name == 'string')) { throw `Error: ${variable} must be a string`; };
  name = name.trim();
  if (name.length === 0) { throw `Error: ${variable} cannot be an empty string or string with just spaces`; };
  return name;
};

form.addEventListener('submit', (event) => {
  let isValid = true;
  
  if (classNameInput.value.trim() === '') {
    alert('Please enter a name for the class.');
    isValid = false;
  }
  
  if (date1Input.value.trim() === '') {
    alert('Please enter a valid date from current time.');
    isValid = false;
  } else {
    const date1 = new Date(date1Input.value);
    if (isNaN(date1.getTime())) {
      alert('Please enter time for class that has max 2 hours slot.');
      isValid = false;
    }
  }
  
  if (timings1Input.value.trim() === '') {
    alert('Please enter timings for Date 1.');
    isValid = false;
  }
  
  if (instructorInput.value.trim() === '') {
    alert('Please enter an instructor name.');
    isValid = false;
  }
  
  if (descriptionInput.value.trim() === '') {
    alert('Please enter a description.');
    isValid = false;
  }
  
  if (!isValid) {
    event.preventDefault();
  }
});