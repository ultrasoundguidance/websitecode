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

    // Exam viewer state
    let currentExamData = null;
    let currentQuestionIndex = 0;

    // Load exam history
    loadExamHistory();

    // Set up delete all button
    const deleteAllBtn = document.querySelector('#delete-all-exams');
    if (deleteAllBtn) {
        deleteAllBtn.addEventListener('click', handleDeleteAll);
    }

    // Set up exam viewer modal controls
    setupExamViewer();

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

                    // Show/hide view button based on completion status
                    const viewBtn = clone.querySelector('.view-exam-btn');
                    if (isComplete) {
                        viewBtn.classList.remove('hidden');
                        viewBtn.addEventListener('click', function (e) {
                            e.preventDefault();
                            openExamViewer(exam.id);
                        });
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

    /**
     * Set up exam viewer modal controls
     */
    function setupExamViewer() {
        const modal = document.querySelector('#exam-viewer-modal');
        const closeBtn = document.querySelector('#close-viewer');
        const prevBtn = document.querySelector('#prev-question');
        const nextBtn = document.querySelector('#next-question');

        if (closeBtn) {
            closeBtn.addEventListener('click', closeExamViewer);
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => navigateQuestion(-1));
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => navigateQuestion(1));
        }

        // Close modal when clicking outside
        if (modal) {
            modal.addEventListener('click', function (e) {
                if (e.target === modal) {
                    closeExamViewer();
                }
            });
        }
    }

    /**
     * Open exam viewer with exam ID
     */
    function openExamViewer(examId) {
        const modal = document.querySelector('#exam-viewer-modal');
        const loadingState = document.querySelector('#viewer-loading');
        const errorState = document.querySelector('#viewer-error');
        const questionDisplay = document.querySelector('#question-display');

        if (!modal) return;

        // Show modal and loading state
        modal.classList.remove('hidden');
        if (loadingState) loadingState.classList.remove('hidden');
        if (errorState) errorState.classList.add('hidden');
        if (questionDisplay) questionDisplay.classList.add('hidden');

        // Fetch exam data
        fetch(`http://127.0.0.1:8000/api/v1/exams/${examId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                currentExamData = data;
                currentQuestionIndex = 0;
                displayQuestion();
                
                if (loadingState) loadingState.classList.add('hidden');
                if (questionDisplay) questionDisplay.classList.remove('hidden');
            })
            .catch(error => {
                console.error('Error loading exam:', error);
                if (loadingState) loadingState.classList.add('hidden');
                if (errorState) errorState.classList.remove('hidden');
            });
    }

    /**
     * Close exam viewer
     */
    function closeExamViewer() {
        const modal = document.querySelector('#exam-viewer-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
        currentExamData = null;
        currentQuestionIndex = 0;
    }

    /**
     * Navigate to next or previous question
     */
    function navigateQuestion(direction) {
        if (!currentExamData || !currentExamData.questions) return;

        currentQuestionIndex += direction;
        
        // Ensure index stays within bounds
        if (currentQuestionIndex < 0) {
            currentQuestionIndex = 0;
        } else if (currentQuestionIndex >= currentExamData.questions.length) {
            currentQuestionIndex = currentExamData.questions.length - 1;
        }

        displayQuestion();
    }

    /**
     * Display the current question
     */
    function displayQuestion() {
        console.log(currentExamData)
        if (!currentExamData || !currentExamData.questions) return;

        const question = currentExamData.questions[currentQuestionIndex];
        const totalQuestions = currentExamData.questions.length;

        // Update question number display
        const currentNumEl = document.querySelector('#current-question-num');
        const totalQuestionsEl = document.querySelector('#total-questions');
        if (currentNumEl) currentNumEl.textContent = currentQuestionIndex + 1;
        if (totalQuestionsEl) totalQuestionsEl.textContent = totalQuestions;

        // Update navigation buttons
        const prevBtn = document.querySelector('#prev-question');
        const nextBtn = document.querySelector('#next-question');
        if (prevBtn) {
            prevBtn.disabled = currentQuestionIndex === 0;
        }
        if (nextBtn) {
            nextBtn.disabled = currentQuestionIndex === totalQuestions - 1;
        }

        // Display question text
        const questionText = document.querySelector('#question-text');
        if (questionText) {
            questionText.textContent = question.prompt || 'Question text not available';
        }

        // Display question media if available
        displayQuestionMedia(question);

        // Display answer choices
        const answersContainer = document.querySelector('#answer-choices');
        // Support both 'answers' and 'answer_choices' field names from API
        const answerChoices = question.answer_choices;
        
        if (answersContainer && answerChoices) {
            answersContainer.innerHTML = '';
            
            // Display all answer choices
            answerChoices.forEach((answer, index) => {
                const answerDiv = document.createElement('div');
                answerDiv.className = 'p-3 rounded transition-all';
                answerDiv.style.border = '2px solid';
                
                const isCorrect = answer.is_correct;
                const isUserAnswer = question.user_answer_id === answer.id;
                
                // Apply styling based on correctness and user selection
                // Show all answers, but highlight the correct answer and user's selection
                if (isCorrect && isUserAnswer) {
                    // User selected the correct answer - green with emphasis
                    answerDiv.style.borderColor = '#16a34a';
                    answerDiv.style.backgroundColor = '#dcfce7';
                    answerDiv.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                } else if (isCorrect) {
                    // Correct answer (but user didn't select it) - green border
                    answerDiv.style.borderColor = '#22c55e';
                    answerDiv.style.backgroundColor = '#f0fdf4';
                } else if (isUserAnswer) {
                    // User selected this wrong answer - red with emphasis
                    answerDiv.style.borderColor = '#dc2626';
                    answerDiv.style.backgroundColor = '#fee2e2';
                    answerDiv.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                } else {
                    // Other answer choices - neutral
                    answerDiv.style.borderColor = '#d1d5db';
                    answerDiv.style.backgroundColor = '#f9fafb';
                }
                
                const answerLabel = document.createElement('div');
                answerLabel.className = 'flex items-start';
                answerLabel.style.display = 'flex';
                answerLabel.style.alignItems = 'flex-start';
                
                const labelText = document.createElement('span');
                labelText.className = 'font-semibold mr-2';
                labelText.style.fontWeight = '600';
                labelText.style.marginRight = '0.5rem';
                labelText.style.minWidth = '1.5rem';
                labelText.textContent = String.fromCharCode(65 + index) + '.';
                
                const answerText = document.createElement('span');
                answerText.className = 'flex-1';
                answerText.style.flex = '1';
                answerText.textContent = answer.answer_text || answer.text;
                
                answerLabel.appendChild(labelText);
                answerLabel.appendChild(answerText);
                
                // Add indicators for correct answer and user selection
                const indicators = document.createElement('div');
                indicators.className = 'mt-2 flex flex-wrap gap-2';
                indicators.style.marginTop = '0.5rem';
                indicators.style.marginLeft = '1.5rem';
                indicators.style.display = 'flex';
                indicators.style.flexWrap = 'wrap';
                indicators.style.gap = '0.5rem';
                
                if (isCorrect) {
                    const correctBadge = document.createElement('span');
                    correctBadge.className = 'inline-flex items-center px-2 py-1 text-xs font-semibold rounded';
                    correctBadge.style.display = 'inline-flex';
                    correctBadge.style.alignItems = 'center';
                    correctBadge.style.padding = '0.25rem 0.625rem';
                    correctBadge.style.backgroundColor = '#16a34a';
                    correctBadge.style.color = 'white';
                    correctBadge.style.borderRadius = '0.25rem';
                    correctBadge.style.fontSize = '0.75rem';
                    correctBadge.style.fontWeight = '600';
                    correctBadge.textContent = '✓ Correct Answer';
                    indicators.appendChild(correctBadge);
                }
                
                if (isUserAnswer) {
                    const yourAnswerBadge = document.createElement('span');
                    yourAnswerBadge.className = 'inline-flex items-center px-2 py-1 text-xs font-semibold rounded';
                    yourAnswerBadge.style.display = 'inline-flex';
                    yourAnswerBadge.style.alignItems = 'center';
                    yourAnswerBadge.style.padding = '0.25rem 0.625rem';
                    yourAnswerBadge.style.backgroundColor = isCorrect ? '#2563eb' : '#dc2626';
                    yourAnswerBadge.style.color = 'white';
                    yourAnswerBadge.style.borderRadius = '0.25rem';
                    yourAnswerBadge.style.fontSize = '0.75rem';
                    yourAnswerBadge.style.fontWeight = '600';
                    yourAnswerBadge.textContent = isCorrect ? '✓ Your Answer' : '✗ Your Answer';
                    indicators.appendChild(yourAnswerBadge);
                }
                
                answerDiv.appendChild(answerLabel);
                if (indicators.childNodes.length > 0) {
                    answerDiv.appendChild(indicators);
                }
                
                answersContainer.appendChild(answerDiv);
            });
        }

        // Display result indicator
        const resultIndicator = document.querySelector('#result-indicator');
        const resultIcon = document.querySelector('#result-icon');
        const resultText = document.querySelector('#result-text');
        const resultDetail = document.querySelector('#result-detail');

        if (resultIndicator && resultIcon && resultText) {
            const answerChoices = question.answer_choices;
            const isCorrect = answerChoices && answerChoices.some(a => a.is_correct && a.id === question.user_answer_id);
            
            // Reset classes and show the indicator
            resultIndicator.classList.remove('hidden', 'bg-green-50', 'bg-red-50', 'border-green-500', 'border-red-500');
            resultIndicator.style.display = 'block';
            
            if (isCorrect) {
                // User answered correctly
                resultIndicator.style.backgroundColor = '#f0fdf4';
                resultIndicator.style.borderLeft = '4px solid #22c55e';
                resultIndicator.style.padding = '1rem';
                resultIndicator.style.borderRadius = '0.5rem';
                
                resultIcon.textContent = '✓';
                resultIcon.style.fontSize = '1.875rem';
                resultIcon.style.marginRight = '0.75rem';
                resultIcon.style.color = '#16a34a';
                
                resultText.textContent = 'Correct!';
                resultText.style.fontSize = '1.25rem';
                resultText.style.fontWeight = '700';
                resultText.style.color = '#166534';
                
                if (resultDetail) {
                    resultDetail.textContent = 'You answered this question correctly.';
                    resultDetail.style.fontSize = '0.875rem';
                    resultDetail.style.marginTop = '0.25rem';
                    resultDetail.style.color = '#15803d';
                }
            } else {
                // User answered incorrectly
                resultIndicator.style.backgroundColor = '#fef2f2';
                resultIndicator.style.borderLeft = '4px solid #ef4444';
                resultIndicator.style.padding = '1rem';
                resultIndicator.style.borderRadius = '0.5rem';
                
                resultIcon.textContent = '✗';
                resultIcon.style.fontSize = '1.875rem';
                resultIcon.style.marginRight = '0.75rem';
                resultIcon.style.color = '#dc2626';
                
                resultText.textContent = 'Incorrect';
                resultText.style.fontSize = '1.25rem';
                resultText.style.fontWeight = '700';
                resultText.style.color = '#991b1b';
                
                if (resultDetail) {
                    resultDetail.textContent = 'Review the explanation below to understand the correct answer.';
                    resultDetail.style.fontSize = '0.875rem';
                    resultDetail.style.marginTop = '0.25rem';
                    resultDetail.style.color = '#b91c1c';
                }
            }
        }

        // Display explanation
        const explanationText = document.querySelector('#explanation-text');
        if (explanationText) {
            explanationText.textContent = question.explanation || 'No explanation available for this question.';
        }
    }

    /**
     * Display question media from Firebase Storage
     */
    function displayQuestionMedia(question) {
        const mediaContainer = document.querySelector('#question-media');
        
        if (!mediaContainer) {
            console.warn('Media container #question-media not found');
            return;
        }

        // Clear previous media
        mediaContainer.innerHTML = '';

        // Check if question has media_storage_path
        if (!question.media_storage_path) {
            mediaContainer.classList.add('hidden');
            return;
        }

        // Show loading state
        mediaContainer.classList.remove('hidden');
        mediaContainer.innerHTML = '<div class="text-center py-4"><span class="text-gray-500">Loading image...</span></div>';

        // Construct the storage path
        let storagePath = question.media_storage_path;

        // Use Firebase Storage SDK for authenticated access
        const storageRef = firebase.storage().ref(storagePath);
        
        // Get download URL with authentication
        storageRef.getDownloadURL()
            .then((url) => {
                // Determine if this is a video or image
                const isVideo = storagePath.toLowerCase().endsWith('.mp4') || url.toLowerCase().includes('.mp4');
                
                if (isVideo) {
                    // Create video element
                    const video = document.createElement('video');
                    video.src = url;
                    video.controls = true;
                    video.className = 'max-w-full h-auto rounded-lg shadow-md mb-4';
                    video.style.maxWidth = '100%';
                    video.style.height = 'auto';
                    video.style.borderRadius = '0.5rem';
                    video.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                    video.style.marginBottom = '1rem';
                    
                    // Handle video load error
                    video.onerror = function() {
                        console.error('Failed to load video from URL:', url);
                        mediaContainer.innerHTML = '<div class="text-center py-4"><span class="text-red-500">Failed to display video</span></div>';
                    };
                    
                    // Clear loading state and add video
                    mediaContainer.innerHTML = '';
                    mediaContainer.appendChild(video);
                } else {
                    // Create image element
                    const img = document.createElement('img');
                    img.src = url;
                    img.alt = 'Question image';
                    img.className = 'max-w-full h-auto rounded-lg shadow-md mb-4';
                    img.style.maxWidth = '100%';
                    img.style.height = 'auto';
                    img.style.borderRadius = '0.5rem';
                    img.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                    img.style.marginBottom = '1rem';
                    
                    // Handle image load error
                    img.onerror = function() {
                        console.error('Failed to load image from URL:', url);
                        mediaContainer.innerHTML = '<div class="text-center py-4"><span class="text-red-500">Failed to display image</span></div>';
                    };
                    
                    // Clear loading state and add image
                    mediaContainer.innerHTML = '';
                    mediaContainer.appendChild(img);
                }
            })
            .catch((error) => {
                // Handle any errors
                console.error('Error loading question media:', error);
                console.error('Storage path attempted:', storagePath);
                mediaContainer.innerHTML = '<div class="text-center py-4"><span class="text-red-500">Failed to load image: ' + error.message + '</span></div>';
            });
    }

    // Make loadExamHistory available globally for exam-creator.js
    window.loadExamHistory = loadExamHistory;
});