const addReviewButtons = document.getElementsByClassName('add_class_review');

for (let button of addReviewButtons) {
  button.addEventListener('click', () => {
    const reviewForm = document.createElement('form');
    reviewForm.action = '/classandevent/reviews_add';
    reviewForm.method = 'POST';

    const textBox = document.createElement('input');
    textBox.type = 'text';
    textBox.name = 'reviewText';
    textBox.placeholder = 'Write your review here';

    const classIdInput = document.createElement('input');
    classIdInput.type = 'hidden';
    classIdInput.name = 'classId';
    classIdInput.value = button.getAttribute('data-class-id');

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = 'Submit';

    reviewForm.appendChild(textBox);
    reviewForm.appendChild(classIdInput);
    reviewForm.appendChild(submitBtn);
    button.after(reviewForm);
    button.style.display = 'none';
  });
}

reviewForm.addEventListener('submit', (e) => {
        const classId = classIdInput.value;
        const reviewText = textBox.value;
      
        if (!classId) {
          e.preventDefault();
          alert('Error: No classId provided');
        }
      
        if (!reviewText) {
          e.preventDefault();
          alert('Error: No review text provided');
        }
      });  