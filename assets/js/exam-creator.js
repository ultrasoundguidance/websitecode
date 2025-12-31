/**
 * Exam Creator Form Handler
 * Handles the creation of new exams based on user preferences
 */

window.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('#create-exam-form');
    const formMessage = document.querySelector('#form-message');
    const categoriesContainer = document.querySelector('#categories-container');
    const modal = document.querySelector('#new-exam-modal');
    const startNewExamBtn = document.querySelector('#start-new-exam');
    const closeModalBtn = document.querySelector('#close-new-exam');

    if (!form) {
        console.log('Exam creator form not found on this page');
        return;
    }

    // Modal open/close handlers
    if (startNewExamBtn && modal) {
        startNewExamBtn.addEventListener('click', function () {
            modal.classList.remove('hidden');
            document.body.classList.add('overflow-hidden'); // Prevent background scrolling
        });
    }

    if (closeModalBtn && modal) {
        closeModalBtn.addEventListener('click', function () {
            modal.classList.add('hidden');
            document.body.classList.remove('overflow-hidden'); // Restore scrolling
        });

        // Close modal when clicking outside of it
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');
            }
        });
    }

    // Load categories from API
    loadCategories();

    /**
     * Fetch categories from the API and populate the form
     */
    function loadCategories() {
        fetch(`${API_BASE_URL}/api/v1/tags/`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!data || data.length === 0) {
                    categoriesContainer.innerHTML = '<div class="text-red-500 text-sm">No categories available</div>';
                    return;
                }

                // Clear loading message
                categoriesContainer.innerHTML = '';

                // Create checkbox for each category
                data.forEach((tag, index) => {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'flex items-center';

                    const checkboxId = `category-${tag.id || index}`;

                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.id = checkboxId;
                    checkbox.name = 'categories';
                    checkbox.value = tag.slug || tag.name;
                    checkbox.setAttribute('data-tag-name', tag.name);
                    checkbox.setAttribute('data-tag-id', tag.id || index);
                    checkbox.className = 'exam-category h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded';

                    const label = document.createElement('label');
                    label.htmlFor = checkboxId;
                    label.className = 'ml-2 text-sm text-gray-700 cursor-pointer';
                    label.textContent = tag.name;

                    // Ensure clicking anywhere in the wrapper toggles the checkbox
                    wrapper.addEventListener('click', function (e) {
                        if (e.target !== checkbox) {
                            e.preventDefault();
                            checkbox.checked = !checkbox.checked;
                        }
                    });

                    wrapper.appendChild(checkbox);
                    wrapper.appendChild(label);
                    categoriesContainer.appendChild(wrapper);
                });
            })
            .catch(error => {
                console.error('Error loading categories:', error);
                categoriesContainer.innerHTML = '<div class="text-red-500 text-sm">Failed to load categories</div>';
            });
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Get member ID
        const examHistory = document.querySelector('#exam-history');
        const memberId = examHistory ? examHistory.dataset.memberId : null;

        if (!memberId) {
            showMessage('error', 'Member ID not found. Please log in again.');
            return;
        }

        // Get form data
        const questionCount = document.querySelector('#question-count').value;
        const categories = Array.from(document.querySelectorAll('input.exam-category:checked'))
            .map(checkbox => ({
                name: checkbox.getAttribute('data-tag-name'),
                id: checkbox.getAttribute('data-tag-id')
            }));
        const questionSelections = Array.from(document.querySelectorAll('input[name="questionSelection"]:checked'))
            .map(checkbox => checkbox.value);

        // Prepare exam data
        const examData = {
            member_id: memberId,
            question_count: parseInt(questionCount),
            tags: categories
        };

        // Include filters if any are selected
        if (questionSelections.length > 0) {
            examData.filters = questionSelections;
        }

        // Show loading state
        form.querySelector('button[type="submit"]').disabled = true;

        // Make API call to create exam
        fetch(`${API_BASE_URL}/api/v1/exams`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
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
                // Reset form
                form.reset();

                // Close modal immediately
                if (modal) {
                    modal.classList.add('hidden');
                    document.body.classList.remove('overflow-hidden');
                }

                // Open the exam taker for the newly created exam
                if (window.openExamTaker && data.exam_id) {
                    setTimeout(() => {
                        window.openExamTaker(data.exam_id);
                    }, 500); // Small delay to allow modal to close smoothly
                } else {
                    console.log('Cannot open exam taker:', {
                        hasFunction: !!window.openExamTaker,
                        hasId: !!data.exam_id,
                        dataKeys: Object.keys(data)
                    });
                    
                    if (window.loadExamHistory) {
                        // Fallback to reloading exam history if openExamTaker is not available
                        setTimeout(() => {
                            window.loadExamHistory();
                        }, 1000);
                    } else {
                        // Suggest page reload as last resort
                        showMessage('success', 'Exam created! Refresh the page to see it in your history.');
                    }
                }
            })
            .catch(error => {
                console.error('Error creating exam:', error);                
                showMessage('error', 'No questions available. Select different criteria to create an exam');
            })
            .finally(() => {
                form.querySelector('button[type="submit"]').disabled = false;
            });
    });

    /**
     * Show a message to the user
     * @param {string} type - Type of message: 'success', 'error', 'info'
     * @param {string} text - Message text
     */
    function showMessage(type, text) {
        if (!formMessage) return;

        // Clear previous classes
        formMessage.className = 'mt-4 p-4 rounded-md';

        // Add type-specific styling
        if (type === 'success') {
            formMessage.classList.add('bg-green-100', 'text-green-800', 'border', 'border-green-300');
        } else if (type === 'error') {
            formMessage.classList.add('bg-red-100', 'text-red-800', 'border', 'border-red-300');
        } else if (type === 'info') {
            formMessage.classList.add('bg-blue-100', 'text-blue-800', 'border', 'border-blue-300');
        }

        formMessage.textContent = text;
        formMessage.classList.remove('hidden');

        // Auto-hide info messages after 3 seconds
        if (type === 'info') {
            setTimeout(() => {
                formMessage.classList.add('hidden');
            }, 3000);
        }

        // Auto-hide error messages after 5 seconds
        if (type === 'error') {
            setTimeout(() => {
                formMessage.classList.add('hidden');
            }, 5000);
        }
    }
});
