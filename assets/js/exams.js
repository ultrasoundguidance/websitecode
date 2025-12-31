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

    // Exam viewer state
    let currentExamData = null;
    let currentQuestionIndex = 0;

    // Exam taker state
    let currentExamTakerData = null;
    let currentQuestionTakerIndex = 0;
    let selectedAnswerId = null;
    let hasCheckedAnswer = false;
    let isSubmitting = false;

    // Load exam history
    loadExamHistory();

    // Expose openExamTaker to window for external access (e.g., from exam-creator.js)
    window.openExamTaker = openExamTaker;

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

        fetch(`${API_BASE_URL}/api/v1/exams/user/${memberId}`)
            .then(response => response.json())
            .then(data => {
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
                    const filters = exam.filters || '';
                    const questionCount = exam.question_count || exam.questions?.length || 0;
                    const isComplete = exam.completed_at || false;

                    // Clone the template
                    const clone = template.content.cloneNode(true);

                    // Populate the data
                    clone.querySelector('.exam-date').textContent = date;
                    clone.querySelector('.exam-question-count').textContent = questionCount === 1 ? `${questionCount} Question` : `${questionCount} Questions`;
                    
                    // Display tags/categories if available
                    const tagsElement = clone.querySelector('.exam-tags');
                    const tagsContainer = clone.querySelector('.exam-tags-container');
                    if (tags && tagsElement && tagsContainer) {
                        tagsElement.textContent = tags;
                        tagsContainer.classList.remove('hidden');
                    }
                    
                    // Display filters if available
                    const filtersElement = clone.querySelector('.exam-filters');
                    const filtersContainer = clone.querySelector('.exam-filters-container');
                    if (filters && filtersElement && filtersContainer) {
                        filtersElement.textContent = filters;
                        filtersContainer.classList.remove('hidden');
                    }

                    // Set status badge
                    const statusComplete = clone.querySelector('.exam-status-complete');
                    const statusProgress = clone.querySelector('.exam-status-progress');
                    if (isComplete) {
                        statusComplete.classList.remove('hidden');
                        
                        // Display score for completed exams
                        if (exam.score !== undefined && exam.score !== null) {
                            const scoreDisplay = clone.querySelector('.exam-score-display');
                            const scoreElement = clone.querySelector('.exam-score');
                            if (scoreDisplay && scoreElement) {
                                scoreElement.textContent = exam.score;
                                scoreDisplay.classList.remove('hidden');
                            }
                        }
                    } else {
                        statusProgress.classList.remove('hidden');
                    }

                    // Show/hide view and resume buttons based on completion status
                    const viewBtn = clone.querySelector('.view-exam-btn');
                    const resumeBtn = clone.querySelector('.resume-exam-btn');
                    
                    if (isComplete) {
                        viewBtn.classList.remove('hidden');
                        viewBtn.addEventListener('click', function (e) {
                            e.preventDefault();
                            openExamViewer(exam.id);
                        });
                    } else {
                        // Show resume button for in-progress exams
                        resumeBtn.classList.remove('hidden');
                        resumeBtn.addEventListener('click', function (e) {
                            e.preventDefault();
                            openExamTaker(exam.id);
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

        fetch(`${API_BASE_URL}/api/v1/exams/${examId}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
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
        fetch(`${API_BASE_URL}/api/v1/exams/user/${memberId}/all`, {
            method: 'DELETE'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                loadExamHistory();
            })
            .catch(error => {
                console.error('Error deleting all exams:', error);
                alert('Failed to delete all exams. Please try again.');
            });
    }

    /**
     * Set up exam viewer controls
     */
    function setupExamViewer() {
        const backBtn = document.querySelector('#back-to-history');
        const prevBtn = document.querySelector('#prev-question');
        const nextBtn = document.querySelector('#next-question');

        if (backBtn) {
            backBtn.addEventListener('click', closeExamViewer);
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => navigateQuestion(-1));
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => navigateQuestion(1));
        }

        // Set up exam taker controls
        const backBtnTaker = document.querySelector('#back-to-history-taker');
        const prevBtnTaker = document.querySelector('#prev-question-taker');
        const nextBtnTaker = document.querySelector('#next-question-taker');
        const checkAnswerBtn = document.querySelector('#check-answer-btn');

        if (backBtnTaker) {
            backBtnTaker.addEventListener('click', closeExamTaker);
        }

        if (prevBtnTaker) {
            prevBtnTaker.addEventListener('click', () => navigateQuestionTaker(-1));
        }

        if (nextBtnTaker) {
            nextBtnTaker.addEventListener('click', () => navigateQuestionTaker(1));
        }

        if (checkAnswerBtn) {
            checkAnswerBtn.addEventListener('click', checkAnswer);
        }

        const submitExamBtn = document.querySelector('#submit-exam-btn');
        if (submitExamBtn) {
            // Remove existing listener if any, then add new one
            submitExamBtn.removeEventListener('click', submitExam);
            submitExamBtn.addEventListener('click', submitExam);
        }

        // Set up score report controls
        const reviewExamBtn = document.querySelector('#review-exam-btn');
        const backToHistoryScore = document.querySelector('#back-to-history-score');
        const createNewExamScore = document.querySelector('#create-new-exam-score');

        if (reviewExamBtn) {
            reviewExamBtn.addEventListener('click', () => {
                const scoreSection = document.querySelector('#score-report-section');
                if (scoreSection) scoreSection.classList.add('hidden');
                if (currentExamTakerData && currentExamTakerData.exam_id) {
                    openExamViewer(currentExamTakerData.exam_id);
                }
            });
        }

        if (backToHistoryScore) {
            backToHistoryScore.addEventListener('click', () => {
                const scoreSection = document.querySelector('#score-report-section');
                const historySection = document.querySelector('#exam-history-section');
                if (scoreSection) scoreSection.classList.add('hidden');
                if (historySection) historySection.classList.remove('hidden');
                loadExamHistory();
            });
        }

        if (createNewExamScore) {
            createNewExamScore.addEventListener('click', () => {
                const scoreSection = document.querySelector('#score-report-section');
                const historySection = document.querySelector('#exam-history-section');
                const newExamModal = document.querySelector('#new-exam-modal');
                if (scoreSection) scoreSection.classList.add('hidden');
                if (historySection) historySection.classList.remove('hidden');
                if (newExamModal) newExamModal.classList.remove('hidden');
            });
        }
    }

    /**
     * Open exam viewer with exam ID
     */
    function openExamViewer(examId) {
        const historySection = document.querySelector('#exam-history-section');
        const viewerSection = document.querySelector('#exam-viewer-section');
        const loadingState = document.querySelector('#viewer-loading');
        const errorState = document.querySelector('#viewer-error');
        const questionDisplay = document.querySelector('#question-display');

        if (!viewerSection) return;

        // Hide history and show viewer with loading state
        if (historySection) historySection.classList.add('hidden');
        viewerSection.classList.remove('hidden');
        if (loadingState) loadingState.classList.remove('hidden');
        if (errorState) errorState.classList.add('hidden');
        if (questionDisplay) questionDisplay.classList.add('hidden');
        
        // Scroll to top of page
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Fetch exam data
        fetch(`${API_BASE_URL}/api/v1/exams/${examId}`)
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
        const historySection = document.querySelector('#exam-history-section');
        const viewerSection = document.querySelector('#exam-viewer-section');
        
        if (viewerSection) {
            viewerSection.classList.add('hidden');
        }
        if (historySection) {
            historySection.classList.remove('hidden');
        }
        
        currentExamData = null;
        currentQuestionIndex = 0;
        
        // Scroll to top of page
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                answerDiv.className = 'p-3 rounded transition-all border-2';
                
                const isCorrect = answer.is_correct;
                const isUserAnswer = question.user_answer_id === answer.id;
                
                // Apply styling based on correctness and user selection
                // Show all answers, but highlight the correct answer and user's selection
                if (isCorrect && isUserAnswer) {
                    // User selected the correct answer - green with emphasis
                    answerDiv.classList.add('border-accent-600', 'dark:border-accent-500', 'bg-accent-100', 'dark:bg-accent-900', 'dark:bg-opacity-20', 'shadow-md');
                } else if (isCorrect) {
                    // Correct answer (but user didn't select it) - green border
                    answerDiv.classList.add('border-accent-500', 'dark:border-accent-600', 'bg-accent-50', 'dark:bg-accent-900', 'dark:bg-opacity-10');
                } else if (isUserAnswer) {
                    // User selected this wrong answer - red with emphasis
                    answerDiv.classList.add('border-tertiary-600', 'dark:border-tertiary-500', 'bg-tertiary-100', 'dark:bg-tertiary-900', 'dark:bg-opacity-20', 'shadow-md');
                } else {
                    // Other answer choices - neutral
                    answerDiv.classList.add('border-gray-300', 'dark:border-gray-600', 'bg-gray-50', 'dark:bg-gray-900');
                }
                
                const answerLabel = document.createElement('div');
                answerLabel.className = 'flex items-start';
                
                const labelText = document.createElement('span');
                labelText.className = 'font-semibold mr-2 min-w-[1.5rem] text-gray-800 dark:text-gray-200';
                labelText.textContent = String.fromCharCode(65 + index) + '.';
                
                const answerText = document.createElement('span');
                answerText.className = 'flex-1 text-gray-700 dark:text-gray-300';
                answerText.textContent = answer.answer_text || answer.text;
                
                answerLabel.appendChild(labelText);
                answerLabel.appendChild(answerText);
                
                // Add indicators for correct answer and user selection
                const indicators = document.createElement('div');
                indicators.className = 'mt-2 ml-[1.5rem] flex flex-wrap gap-2';
                
                if (isCorrect) {
                    const correctBadge = document.createElement('span');
                    correctBadge.className = 'inline-flex items-center px-2 py-1 text-xs font-semibold rounded bg-accent-600 dark:bg-accent-700 text-white';
                    correctBadge.textContent = '✓ Correct Answer';
                    indicators.appendChild(correctBadge);
                }
                
                if (isUserAnswer) {
                    const yourAnswerBadge = document.createElement('span');
                    yourAnswerBadge.className = 'inline-flex items-center px-2 py-1 text-xs font-semibold rounded text-white ' + (isCorrect ? 'bg-primary-600 dark:bg-primary-700' : 'bg-tertiary-600 dark:bg-tertiary-700');
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
                    video.controlsList = 'nodownload';
                    video.className = 'max-w-full h-auto rounded-lg shadow-md mb-4';
                    
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

    /**
     * Open exam taker for in-progress exam
     */
    function openExamTaker(examId) {
        const historySection = document.querySelector('#exam-history-section');
        const takerSection = document.querySelector('#exam-taker-section');
        const loadingState = document.querySelector('#taker-loading');
        const errorState = document.querySelector('#taker-error');
        const questionDisplay = document.querySelector('#question-display-taker');

        if (!takerSection) return;

        // Reset all state when opening a new exam
        currentExamTakerData = null;
        currentQuestionTakerIndex = 0;
        selectedAnswerId = null;
        hasCheckedAnswer = false;
        isSubmitting = false;

        // Reset submit button state
        const submitBtn = document.querySelector('#submit-exam-btn');
        if (submitBtn) {
            submitBtn.classList.add('hidden');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Exam';
        }

        // Hide history and show taker with loading state
        if (historySection) historySection.classList.add('hidden');
        takerSection.classList.remove('hidden');
        if (loadingState) loadingState.classList.remove('hidden');
        if (errorState) errorState.classList.add('hidden');
        if (questionDisplay) questionDisplay.classList.add('hidden');
        
        // Scroll to top of page
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Fetch exam data
        fetch(`${API_BASE_URL}/api/v1/exams/${examId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                currentExamTakerData = data;
                
                // Find the first unanswered question or start from beginning
                currentQuestionTakerIndex = 0;
                for (let i = 0; i < data.questions.length; i++) {
                    if (!data.questions[i].user_answer_id) {
                        currentQuestionTakerIndex = i;
                        break;
                    }
                }
                
                displayQuestionTaker();
                
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
     * Close exam taker
     */
    function closeExamTaker() {
        const historySection = document.querySelector('#exam-history-section');
        const takerSection = document.querySelector('#exam-taker-section');
        
        if (takerSection) {
            takerSection.classList.add('hidden');
        }
        if (historySection) {
            historySection.classList.remove('hidden');
        }
        
        currentExamTakerData = null;
        currentQuestionTakerIndex = 0;
        selectedAnswerId = null;
        hasCheckedAnswer = false;
        
        // Reload exam history to reflect any changes
        loadExamHistory();
        
        // Scroll to top of page
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Navigate to next or previous question in taker
     */
    function navigateQuestionTaker(direction) {
        if (!currentExamTakerData || !currentExamTakerData.questions) return;

        // Only allow navigation if current question has been answered
        const currentQuestion = currentExamTakerData.questions[currentQuestionTakerIndex];
        
        currentQuestionTakerIndex += direction;
        
        // Ensure index stays within bounds
        if (currentQuestionTakerIndex < 0) {
            currentQuestionTakerIndex = 0;
        } else if (currentQuestionTakerIndex >= currentExamTakerData.questions.length) {
            currentQuestionTakerIndex = currentExamTakerData.questions.length - 1;
        }

        displayQuestionTaker();
    }

    /**
     * Display the current question in taker mode
     */
    function displayQuestionTaker() {
        if (!currentExamTakerData || !currentExamTakerData.questions) return;

        const question = currentExamTakerData.questions[currentQuestionTakerIndex];
        const totalQuestions = currentExamTakerData.questions.length;

        // Reset state for new question
        selectedAnswerId = null;
        hasCheckedAnswer = false;

        // Check if this question was already answered
        if (question.user_answer_id) {
            selectedAnswerId = question.user_answer_id;
            hasCheckedAnswer = true;
        }

        // Update question number display
        const currentNumEl = document.querySelector('#current-question-num-taker');
        const totalQuestionsEl = document.querySelector('#total-questions-taker');
        if (currentNumEl) currentNumEl.textContent = currentQuestionTakerIndex + 1;
        if (totalQuestionsEl) totalQuestionsEl.textContent = totalQuestions;

        // Update navigation buttons
        const prevBtn = document.querySelector('#prev-question-taker');
        const nextBtn = document.querySelector('#next-question-taker');
        if (prevBtn) {
            prevBtn.disabled = currentQuestionTakerIndex === 0;
        }
        if (nextBtn) {
            nextBtn.disabled = currentQuestionTakerIndex === totalQuestions - 1;
        }

        // Display question text
        const questionText = document.querySelector('#question-text-taker');
        if (questionText) {
            questionText.textContent = question.prompt || 'Question text not available';
        }

        // Display question media if available
        displayQuestionMediaTaker(question);

        // Display answer choices
        displayAnswerChoicesTaker(question);

        // Update check button state
        const checkBtn = document.querySelector('#check-answer-btn');
        if (checkBtn) {
            // Clear any inline styles from previous questions
            checkBtn.style.display = '';
            
            if (hasCheckedAnswer) {
                // Keep button hidden once answer is checked
                checkBtn.classList.add('hidden');
            } else if (selectedAnswerId) {
                // Show button only when an answer is selected
                checkBtn.classList.remove('hidden');
                checkBtn.textContent = 'Check Answer';
                checkBtn.disabled = false;
            } else {
                // Hide button when no answer is selected
                checkBtn.classList.add('hidden');
            }
        }

        // Show/hide explanation based on whether answer was checked
        const explanationSection = document.querySelector('#explanation-section-taker');
        
        if (hasCheckedAnswer) {
            if (explanationSection) {
                explanationSection.classList.remove('hidden');
                const explanationText = document.querySelector('#explanation-text-taker');
                if (explanationText) {
                    explanationText.textContent = question.explanation || 'No explanation available for this question.';
                }
            }
        } else {
            if (explanationSection) explanationSection.classList.add('hidden');
        }

        // Show/hide result indicator based on whether answer was checked
        const resultIndicator = document.querySelector('#result-indicator-taker');
        const resultIcon = document.querySelector('#result-icon-taker');
        const resultText = document.querySelector('#result-text-taker');
        
        if (hasCheckedAnswer && resultIndicator && resultIcon && resultText) {
            // Show result indicator with appropriate styling
            const isCorrect = question.answer_choices.find(a => a.id === selectedAnswerId)?.is_correct;
            
            resultIndicator.classList.remove('hidden');
            if (isCorrect) {
                resultIndicator.className = 'mb-6 p-4 rounded-lg bg-accent-100 dark:bg-accent-900 dark:bg-opacity-20 border border-accent-600 dark:border-accent-500';
                resultIcon.textContent = '✓';
                resultIcon.className = 'text-3xl mr-3 text-accent-600 dark:text-accent-400';
                resultText.textContent = 'Correct!';
                resultText.className = 'text-xl font-bold text-accent-900 dark:text-accent-300';
            } else {
                resultIndicator.className = 'mb-6 p-4 rounded-lg bg-tertiary-100 dark:bg-tertiary-900 dark:bg-opacity-20 border border-tertiary-600 dark:border-tertiary-500';
                resultIcon.textContent = '✗';
                resultIcon.className = 'text-3xl mr-3 text-tertiary-600 dark:text-tertiary-400';
                resultText.textContent = 'Incorrect';
                resultText.className = 'text-xl font-bold text-tertiary-900 dark:text-tertiary-300';
            }
        } else if (resultIndicator) {
            // Hide result indicator if question hasn't been checked
            resultIndicator.classList.add('hidden');
        }

        // Check if all questions are answered and show/hide submit button
        updateSubmitButtonVisibility();
    }

    /**
     * Display answer choices in taker mode with selection capability
     */
    function displayAnswerChoicesTaker(question) {
        const answersContainer = document.querySelector('#answer-choices-taker');
        const answerChoices = question.answer_choices;
        
        if (!answersContainer || !answerChoices) return;
        
        answersContainer.innerHTML = '';
        
        answerChoices.forEach((answer, index) => {
            const answerDiv = document.createElement('div');
            answerDiv.className = 'p-3 rounded transition-all border-2';
            if (!hasCheckedAnswer) {
                answerDiv.classList.add('cursor-pointer');
            }
            
            const isSelected = selectedAnswerId === answer.id;
            const isCorrect = answer.is_correct;
            
            // Apply styling based on selection and check status
            if (hasCheckedAnswer) {
                // Show correct/incorrect after checking
                if (isCorrect && isSelected) {
                    answerDiv.classList.add('border-accent-600', 'dark:border-accent-500', 'bg-accent-100', 'dark:bg-accent-900', 'dark:bg-opacity-20');
                } else if (isCorrect) {
                    answerDiv.classList.add('border-accent-500', 'dark:border-accent-600', 'bg-accent-50', 'dark:bg-accent-900', 'dark:bg-opacity-10');
                } else if (isSelected) {
                    answerDiv.classList.add('border-tertiary-600', 'dark:border-tertiary-500', 'bg-tertiary-100', 'dark:bg-tertiary-900', 'dark:bg-opacity-20');
                } else {
                    answerDiv.classList.add('border-gray-300', 'dark:border-gray-600', 'bg-gray-50', 'dark:bg-gray-900');
                }
            } else {
                // Show selected state before checking
                if (isSelected) {
                    answerDiv.classList.add('border-primary-600', 'dark:border-primary-500', 'bg-primary-100', 'dark:bg-primary-900', 'dark:bg-opacity-20');
                } else {
                    answerDiv.classList.add('border-gray-300', 'dark:border-gray-600', 'bg-white', 'dark:bg-gray-900', 'hover:border-primary-400', 'dark:hover:border-primary-600', 'hover:bg-gray-50', 'dark:hover:bg-gray-800');
                }
            }
            
            const answerLabel = document.createElement('div');
            answerLabel.className = 'flex items-start';
            
            const labelText = document.createElement('span');
            labelText.className = 'font-semibold mr-2 min-w-[1.5rem] text-gray-800 dark:text-gray-200';
            labelText.textContent = String.fromCharCode(65 + index) + '.';
            
            const answerText = document.createElement('span');
            answerText.className = 'flex-1 text-gray-700 dark:text-gray-300';
            answerText.textContent = answer.answer_text || answer.text;
            
            answerLabel.appendChild(labelText);
            answerLabel.appendChild(answerText);
            
            // Add indicators if answer has been checked
            if (hasCheckedAnswer) {
                const indicators = document.createElement('div');
                indicators.className = 'mt-2 ml-[1.5rem] flex flex-wrap gap-2';
                
                if (isCorrect) {
                    const correctBadge = document.createElement('span');
                    correctBadge.className = 'inline-flex items-center px-2 py-1 text-xs font-semibold rounded bg-accent-600 dark:bg-accent-700 text-white';
                    correctBadge.textContent = '✓ Correct Answer';
                    indicators.appendChild(correctBadge);
                }
                
                if (isSelected) {
                    const yourAnswerBadge = document.createElement('span');
                    yourAnswerBadge.className = 'inline-flex items-center px-2 py-1 text-xs font-semibold rounded text-white ' + (isCorrect ? 'bg-primary-600 dark:bg-primary-700' : 'bg-tertiary-600 dark:bg-tertiary-700');
                    yourAnswerBadge.textContent = isCorrect ? '✓ Your Answer' : '✗ Your Answer';
                    indicators.appendChild(yourAnswerBadge);
                }
                
                answerDiv.appendChild(answerLabel);
                if (indicators.childNodes.length > 0) {
                    answerDiv.appendChild(indicators);
                }
            } else {
                answerDiv.appendChild(answerLabel);
            }
            
            // Add click handler if answer hasn't been checked yet
            if (!hasCheckedAnswer) {
                answerDiv.addEventListener('click', function() {
                    selectedAnswerId = answer.id;
                    displayAnswerChoicesTaker(question);
                });
            }
            
            answersContainer.appendChild(answerDiv);
        });
        
        // Update check button visibility after rendering all answers
        const checkBtn = document.querySelector('#check-answer-btn');
        if (checkBtn && !hasCheckedAnswer) {
            if (selectedAnswerId) {
                checkBtn.classList.remove('hidden');
                checkBtn.disabled = false;
            } else {
                checkBtn.classList.add('hidden');
            }
        }
    }

    /**
     * Check the selected answer
     */
    function checkAnswer() {
        if (!selectedAnswerId || !currentExamTakerData || hasCheckedAnswer) return;

        const question = currentExamTakerData.questions[currentQuestionTakerIndex];
        
        // Mark as checked
        hasCheckedAnswer = true;
        
        // Update the question with user's answer
        question.user_answer_id = selectedAnswerId;
        
        // Permanently hide check button immediately
        const checkBtn = document.querySelector('#check-answer-btn');
        if (checkBtn) {
            checkBtn.classList.add('hidden');
            checkBtn.style.display = 'none'; // Force hide with inline style
        }
        
        // Save exam progress to API
        saveExamProgress();
        
        // Update display to show result
        displayAnswerChoicesTaker(question);
        
        // Show explanation
        const explanationSection = document.querySelector('#explanation-section-taker');
        const explanationText = document.querySelector('#explanation-text-taker');
        if (explanationSection && explanationText) {
            explanationSection.classList.remove('hidden');
            explanationText.textContent = question.explanation || 'No explanation available for this question.';
        }
        
        // Display result indicator
        const resultIndicator = document.querySelector('#result-indicator-taker');
        const resultIcon = document.querySelector('#result-icon-taker');
        const resultText = document.querySelector('#result-text-taker');
        
        if (resultIndicator && resultIcon && resultText) {
            const isCorrect = question.answer_choices.find(a => a.id === selectedAnswerId)?.is_correct;
            
            resultIndicator.classList.remove('hidden');
            if (isCorrect) {
                resultIndicator.className = 'mb-6 p-4 rounded-lg bg-accent-100 dark:bg-accent-900 dark:bg-opacity-20 border border-accent-600 dark:border-accent-500';
                resultIcon.textContent = '✓';
                resultIcon.className = 'text-3xl mr-3 text-accent-600 dark:text-accent-400';
                resultText.textContent = 'Correct!';
                resultText.className = 'text-xl font-bold text-accent-900 dark:text-accent-300';
            } else {
                resultIndicator.className = 'mb-6 p-4 rounded-lg bg-tertiary-100 dark:bg-tertiary-900 dark:bg-opacity-20 border border-tertiary-600 dark:border-tertiary-500';
                resultIcon.textContent = '✗';
                resultIcon.className = 'text-3xl mr-3 text-tertiary-600 dark:text-tertiary-400';
                resultText.textContent = 'Incorrect';
                resultText.className = 'text-xl font-bold text-tertiary-900 dark:text-tertiary-300';
            }
        }
        
        // Update submit button visibility - show if this was the last question answered
        updateSubmitButtonVisibility();
    }

    /**
     * Display question media in taker mode
     */
    function displayQuestionMediaTaker(question) {
        const mediaContainer = document.querySelector('#question-media-taker');
        
        if (!mediaContainer) {
            console.warn('Media container #question-media-taker not found');
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
                    const video = document.createElement('video');
                    video.src = url;
                    video.controls = true;
                    video.controlsList = 'nodownload';
                    video.className = 'max-w-full h-auto rounded-lg shadow-md mb-4';
                    
                    video.onerror = function() {
                        console.error('Failed to load video from URL:', url);
                        mediaContainer.innerHTML = '<div class="text-center py-4"><span class="text-red-500">Failed to display video</span></div>';
                    };
                    
                    mediaContainer.innerHTML = '';
                    mediaContainer.appendChild(video);
                } else {
                    const img = document.createElement('img');
                    img.src = url;
                    img.alt = 'Question image';
                    img.className = 'max-w-full h-auto rounded-lg shadow-md mb-4';
                    
                    img.onerror = function() {
                        console.error('Failed to load image from URL:', url);
                        mediaContainer.innerHTML = '<div class="text-center py-4"><span class="text-red-500">Failed to display image</span></div>';
                    };
                    
                    mediaContainer.innerHTML = '';
                    mediaContainer.appendChild(img);
                }
            })
            .catch((error) => {
                console.error('Error loading question media:', error);
                console.error('Storage path attempted:', storagePath);
                mediaContainer.innerHTML = '<div class="text-center py-4"><span class="text-red-500">Failed to load image: ' + error.message + '</span></div>';
            });
    }

    /**
     * Check if all questions in the exam have been answered
     */
    function allQuestionsAnswered() {
        if (!currentExamTakerData || !currentExamTakerData.questions) return false;
        return currentExamTakerData.questions.every(q => q.user_answer_id);
    }

    /**
     * Update submit button visibility based on whether all questions are answered
     */
    function updateSubmitButtonVisibility() {
        const submitBtn = document.querySelector('#submit-exam-btn');
        if (!submitBtn) return;

        if (allQuestionsAnswered()) {
            submitBtn.classList.remove('hidden');
        } else {
            submitBtn.classList.add('hidden');
        }
    }

    /**
     * Submit the completed exam
     */
    function submitExam() {
        if (!currentExamTakerData || !allQuestionsAnswered()) {
            alert('Please answer all questions before submitting.');
            return;
        }

        // Prevent double submission
        if (isSubmitting) {
            return;
        }

        const examId = currentExamTakerData.exam_id;
        
        // Prepare the exam data to send with is_complete set to true
        const examData = {
            questions: currentExamTakerData.questions
                .filter(q => q.user_answer_id)
                .map(q => ({
                    question_id: q.id,
                    answer_id: q.user_answer_id
                })),
            is_complete: true
        };

        // Disable submit button to prevent double submission
        const submitBtn = document.querySelector('#submit-exam-btn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
        }

        // Set submitting flag
        isSubmitting = true;

        fetch(`${API_BASE_URL}/api/v1/exams/${examId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(examData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Show score report instead of just an alert
                showScoreReport(currentExamTakerData, data);
                // Reset submitting flag after showing score
                isSubmitting = false;
            })
            .catch(error => {
                console.error('Error submitting exam:', error);
                alert('Failed to submit exam. Please try again.');
                // Re-enable submit button
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Submit Exam';
                }
                // Reset submitting flag
                isSubmitting = false;
            });
    }

    /**
     * Show score report after exam submission
     */
    function showScoreReport(examData, submittedData) {
        if (!examData || !examData.questions) return;

        // Use score data from API response
        const totalQuestions = examData.questions.length;
        const percentage = submittedData.score || 0;
        const correctAnswers = Math.round((percentage / 100) * totalQuestions);
        const incorrectAnswers = totalQuestions - correctAnswers;

        // Update score display
        document.getElementById('final-score-percentage').textContent = `${percentage}%`;
        document.getElementById('final-score-text').textContent = `${correctAnswers} / ${totalQuestions} Correct`;
        document.getElementById('correct-count').textContent = correctAnswers;
        document.getElementById('incorrect-count').textContent = incorrectAnswers;

        // Show performance message
        const performanceMsg = document.getElementById('performance-message');
        const performanceMsgText = performanceMsg.querySelector('p');
        
        if (percentage >= 90) {
            performanceMsg.className = 'text-center mb-8 p-4 rounded-lg bg-green-50 border border-green-200';
            performanceMsgText.textContent = 'Excellent work! You have a strong understanding of the material.';
            performanceMsgText.className = 'text-lg font-semibold text-green-800';
        } else if (percentage >= 70) {
            performanceMsg.className = 'text-center mb-8 p-4 rounded-lg bg-blue-50 border border-blue-200';
            performanceMsgText.textContent = 'Good job! Keep practicing to improve further.';
            performanceMsgText.className = 'text-lg font-semibold text-blue-800';
        } else {
            performanceMsg.className = 'text-center mb-8 p-4 rounded-lg bg-yellow-50 border border-yellow-200';
            performanceMsgText.textContent = 'Keep studying! Review the explanations to strengthen your knowledge.';
            performanceMsgText.className = 'text-lg font-semibold text-yellow-800';
        }

        // Hide exam taker section and show score report
        const takerSection = document.querySelector('#exam-taker-section');
        const scoreSection = document.querySelector('#score-report-section');
        
        if (takerSection) takerSection.classList.add('hidden');
        if (scoreSection) scoreSection.classList.remove('hidden');

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Save exam progress to API
     */
    function saveExamProgress() {
        if (!currentExamTakerData) return;

        const examId = currentExamTakerData.exam_id;
        
        // Prepare the exam data to send
        const examData = {
            questions: currentExamTakerData.questions
                .filter(q => q.user_answer_id)
                .map(q => ({
                    question_id: q.id,
                    answer_id: q.user_answer_id
                })),
            is_complete: false
        };

        fetch(`${API_BASE_URL}/api/v1/exams/${examId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(examData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Update local data with response
                if (data.questions) {
                    currentExamTakerData.questions = data.questions;
                }
            })
            .catch(error => {
                console.error('Error saving exam progress:', error);
                // Show error message to user
                alert('Failed to save exam progress. Please try again.');
            });
    }

    // Make loadExamHistory available globally for exam-creator.js
    window.loadExamHistory = loadExamHistory;
});