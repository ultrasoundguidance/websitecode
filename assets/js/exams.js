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

    // Load exam history
    loadExamHistory();

    // Set up delete all button
    const deleteAllBtn = document.querySelector('#delete-all-exams');
    if (deleteAllBtn) {
        deleteAllBtn.addEventListener('click', handleDeleteAll);
    }

    /**
     * Load exam history from API
     */
    function loadExamHistory() {
        const examList = document.querySelector('#exam-list');
        const noExamsMessage = document.querySelector('#no-exams-message');
        const deleteAllBtn = document.querySelector('#delete-all-exams');
        const errorMessage = document.querySelector('#error-message');
        const loadingIndicator = document.querySelector('#exam-loading');
        const template = document.querySelector('#exam-item-template');

        // Show loading indicator
        if (loadingIndicator) loadingIndicator.classList.remove('hidden');
        if (examList) examList.innerHTML = '';
        if (noExamsMessage) noExamsMessage.classList.add('hidden');
        if (errorMessage) errorMessage.classList.add('hidden');

        fetch(`http://127.0.0.1:8000/api/v1/exams/user/${memberId}`)
            .then(response => response.json())
            .then(data => {
                console.log('Exam data:', data);

                // Hide loading indicator
                if (loadingIndicator) loadingIndicator.classList.add('hidden');

                if (!data || !data.exams || data.exams.length === 0) {
                    noExamsMessage.classList.remove('hidden');
                    deleteAllBtn.classList.add('hidden');
                    examList.innerHTML = '';
                    return;
                }

                // Show delete all button
                deleteAllBtn.classList.remove('hidden');

                // Clear the list before populating
                examList.innerHTML = '';

                // Sort exams in descending order (newest first)
                const sortedExams = data.exams.sort((a, b) => {
                    const dateA = new Date(a.started_at.endsWith('Z') ? a.started_at : a.started_at + 'Z');
                    const dateB = new Date(b.started_at.endsWith('Z') ? b.started_at : b.started_at + 'Z');
                    return dateB - dateA;
                });

                // Process each exam
                sortedExams.forEach(exam => {
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

                    // Add delete button handler
                    const deleteBtn = clone.querySelector('.delete-exam-btn');
                    deleteBtn.addEventListener('click', function (e) {
                        e.preventDefault();
                        handleDeleteExam(exam.id);
                    });

                    // Append to list
                    examList.appendChild(clone);
                });

                // Hide no exams message
                noExamsMessage.classList.add('hidden');
            })
            .catch(error => {
                console.error('Error fetching exams:', error);
                // Hide loading indicator
                if (loadingIndicator) loadingIndicator.classList.add('hidden');
                if (errorMessage) errorMessage.classList.remove('hidden');
            });
    }

    /**
     * Delete a single exam
     */
    function handleDeleteExam(examId) {
        if (!confirm('Are you sure you want to delete this exam?')) {
            return;
        }

        fetch(`http://127.0.0.1:8000/api/v1/exams/${examId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                console.log('Exam deleted successfully');
                loadExamHistory();
            })
            .catch(error => {
                console.error('Error deleting exam:', error);
                alert('Failed to delete exam. Please try again.');
            });
    }

    /**
     * Delete all exams
     */
    function handleDeleteAll() {
        if (!confirm('Are you sure you want to delete ALL exams? This action cannot be undone.')) {
            return;
        }

        fetch(`http://127.0.0.1:8000/api/v1/exams/${memberId}/all`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                console.log('All exams deleted successfully');
                loadExamHistory();
            })
            .catch(error => {
                console.error('Error deleting all exams:', error);
                alert('Failed to delete all exams. Please try again.');
            });
    }

    // Make loadExamHistory available globally for exam-creator.js
    window.loadExamHistory = loadExamHistory;
});