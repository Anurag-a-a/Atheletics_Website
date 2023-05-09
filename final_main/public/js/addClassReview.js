const addReviewButtons = document.getElementsByClassName('add_class_review');

for (let button of addReviewButtons) {
  button.addEventListener('click', async () => {
    const reviewForm = document.createElement('form');

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

    // Move the code from 'submit' event listener to 'click' event listener
    submitBtn.addEventListener('click', async (e) => {
      e.preventDefault();

      const classId = classIdInput.value;
      const reviewText = textBox.value;

      if (!classId) {
        alert('Error: No classId provided');
        return;
      }

      if (!reviewText) {
        alert('Error: No review text provided');
        return;
      }

      try {
        const response = await fetch('/classandevent/reviews_add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ classId, reviewText }),
          credentials: 'same-origin'
        });

        const jsonResponse = await response.json();

        if (!jsonResponse.success) {
          const errorMessageElement = document.getElementById('error-message');
          errorMessageElement.textContent = jsonResponse.message;
          errorMessageElement.style.display = 'block';
          return;
        }

        if (jsonResponse.redirect) {
          window.location.href = jsonResponse.redirect;
        } else {
          window.location.reload();
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while submitting the review.');
      }
    });
  });
}