function isValidClassName (className) {
  if (!className) { throw `Error: class name not given`; };
  if (!(typeof className == 'string')) { throw `Error: class name must be a string`; };
  className = className.toLowerCase().trim().replace(/\s+/g, "");
  if (className.length === 0) { throw `Error: class name cannot be an empty string or string with just spaces`; };
  return className;
}

function isValidClassCapacity  (classCapacity) {
  if (!classCapacity) { throw `Error: class capacity not given`; };
  if (!(typeof parseInt(classCapacity) == 'number')) { throw `Error: class capacity must be a number`; };
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


function isValidDescription (description) {
  if (!description) { throw `Error: class description not given`; };
  if (!(typeof description == 'string')) { throw `Error: class description must be a string`; };
  description = description.trim();
  if (description.length === 0) { throw `Error: class description cannot be an empty string or string with just spaces`; };
  return description;
}

function isValidDate(Date1){
  const dateFormat = /^\d{2}\/\d{2}\/\d{4}$/;
  const trimmedDate = Date1.trim();
  if (!dateFormat.test(trimmedDate)) throw 'Date must be in the format MM/DD/YYYY';
  const currentDate = new Date();
  
  if (trimmedDate <= currentDate) {
    throw 'Date must me greater than todays Date'
  }
  return Date1;
}
function isValidTime(timing){
  const timeFormat = /^(\d{2}:\d{2}) - (\d{2}:\d{2})$/;
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


let createForm = document.getElementById('classCreation');
if(createForm) {
  let classNameInput = document.getElementById('className');
  let date1Input = document.getElementById('date1');
  let timings1Input = document.getElementById('timings1');
  let instructorInput = document.getElementById('instructor');
  let descriptionInput = document.getElementById('description');
  let maxCapacityInput = document.getElementById('maxCapacity');
  let errorContainer = document.getElementById('error-container');
  let errorTextElement = errorContainer.getElementsByClassName('text-goes-here1')[0];


  createForm.addEventListener('submit', (event) => {
      
      try {
          className = isValidClassName(classNameInput.value);
          let dateInput = new Date(date1Input.value);
          dateInput = dateInput.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
          dateInput = isValidDate(dateInput);
          timings1Input = isValidTime(timings1Input.value);
          instructorInput = isValidClassName(instructorInput.value);
          descriptionInput = isValidDescription(descriptionInput.value);
          maxCapacityInput = isValidClassCapacity(maxCapacityInput.value);          
          errorContainer.style.display = 'none';

      }catch(e){
          event.preventDefault();
          const message = typeof e === 'string' ? e : e.message;
          errorTextElement.textContent = e;
          errorContainer.style.display = 'block';
          errorContainer.classList.remove('hidden');
      };
  });
};


let updateForm = document.querySelector('#classUpdation');
if(updateForm) {

  let classNameInput = document.getElementById('className');
  let date1Input = document.getElementById('date1');
  let timings1Input = document.getElementById('timings1');
  let instructorInput = document.getElementById('instructor');
  let descriptionInput = document.getElementById('description');
  let maxCapacityInput = document.getElementById('maxCapacity');
  let errorContainer = document.getElementById('error-container');
  let errorTextElement = errorContainer.getElementsByClassName('text-goes-here1')[0];


  updateForm.addEventListener('submit', (event) => {
      try {
        className = isValidClassName(classNameInput.value);
        let dateInput = new Date(date1Input.value);
        dateInput = dateInput.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
        dateInput = isValidDate(dateInput);
        timings1Input = isValidTime(timings1Input.value);
        instructorInput = isValidClassName(instructorInput.value);
        descriptionInput = isValidDescription(descriptionInput.value);
        maxCapacityInput = isValidClassCapacity(maxCapacityInput.value);          
        errorContainer.style.display = 'none';
        
      }catch(e){
          event.preventDefault();
          const message = typeof e === 'string' ? e : e.message;
          errorTextElement.textContent = e;
          errorContainer.style.display = 'block';
          errorContainer.classList.remove('hidden');
      };
  });
};
