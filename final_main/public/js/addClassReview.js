const addReviewButtons = document.getElementsByClassName('add_class_review');
const reviewForms = document.getElementsByClassName('review_form')
for (let button of addReviewButtons){
        button.addEventListener("click",()=>{
                const reviewForm = document.createElement('form');
                reviewForm.action = '/classandevent/reviews_add';
                reviewForm.method = 'POST';

                const textBox = document.createElement('input');
                const submitBtn = document.createElement('button');
                submitBtn.type = 'submit';
                submitBtn.textContent = 'Submit';
                reviewForm.appendChild(textBox);
                reviewForm.appendChild(submitBtn);
                button.after(reviewForm);
                
                button.style.display="none";
        })
}