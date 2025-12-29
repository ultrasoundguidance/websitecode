window.addEventListener('DOMContentLoaded', function () {
    var postData = document.querySelector("#exam-history");

    if (!postData) {
        return;
    }

    var memberId = postData.dataset.memberId;

    if (!memberId) {
        console.error('No member ID found on #exam-history element');
        return;
    }

    console.log('Member ID found:', memberId);

    // Make the API call
    fetch(`http://127.0.0.1:8000/api/v1/exams/user/${memberId}`)
        .then(response => response.json())
        .then(data => {
            console.log('Exam data:', data);

            const examList = document.querySelector('#exam-list');
            const noExamsMessage = document.querySelector('#no-exams-message');
            const template = document.querySelector('#exam-item-template');

            if (!data || !data.exams || data.exams.length === 0) {
                noExamsMessage.classList.remove('hidden');
                return;
            }

            // Clear the list before populating
            examList.innerHTML = '';

            // Process each exam
            data.exams.forEach(exam => {
                // Ensure UTC time is parsed correctly by adding 'Z' if not present
                const utcTime = exam.started_at.endsWith('Z') ? exam.started_at : exam.started_at + 'Z';
                const date = new Date(utcTime).toLocaleString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                });

                const tags = exam.tags ? exam.tags.map(value => value.name).join(", ") : '';
                const questionCount = exam.question_count || exam.questions?.length || 0;
                const isComplete = exam.completed_at || false;

                // Clone the template
                const clone = template.content.cloneNode(true);

                // Populate the data
                clone.querySelector('.exam-date').textContent = date;
                clone.querySelector('.exam-question-count').textContent = questionCount === 1 ? `${questionCount} Question` : `${questionCount} Questions`;
                clone.querySelector('.exam-tags').textContent = tags;

                // Set status badge
                const statusComplete = clone.querySelector('.exam-status-complete');
                const statusProgress = clone.querySelector('.exam-status-progress');
                if (isComplete) {
                    statusComplete.classList.remove('hidden');
                } else {
                    statusProgress.classList.remove('hidden');
                }

                // Append to list
                examList.appendChild(clone);
            });
        })
        .catch(error => {
            console.error('Error fetching exams:', error);
            const errorMessage = document.querySelector('#error-message');
            errorMessage.classList.remove('hidden');
        });
});