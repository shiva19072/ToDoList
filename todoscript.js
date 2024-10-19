
// Event listener to handle form submission and add task
document.getElementById('taskForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    // Get form values
    const task = document.getElementById('Task').value;
    const description = document.getElementById('Taskdesc').value;
    const person = document.getElementById('person').value;
    const deadline = document.getElementById('deadline').value;
    const importance = document.getElementById('importance').value;
    var successModal = new bootstrap.Modal(document.getElementById('successModal'));
    var failureModal = new bootstrap.Modal(document.getElementById('failureModal'));
    var notifysuccess =document.getElementById('modalmessagesuccess');
    var notifyfailure =document.getElementById('modalmessagefail');

    // Validate if task title already exists
    if (isTaskTitleDuplicate(task)) {
        notifyfailure.textContent=`Task with title "${task}" already exists!!! `;
        failureModal.show();
        return; // Stop form submission if duplicate is found
    }

    // Create a card container div
    const card = createTaskCard(task, description, person, deadline, importance);

    // Append the card to the "All Tasks" list
    document.getElementById('allTasksList').appendChild(card.cloneNode(true));

    // Append the card to the correct importance-based section
    if (importance === 'High') {
        document.getElementById('highTasks').appendChild(card.cloneNode(true));
    } else if (importance === 'Moderate') {
        document.getElementById('moderateTasks').appendChild(card.cloneNode(true));
    } else if (importance === 'Low') {
        document.getElementById('lowTasks').appendChild(card.cloneNode(true));
    }
    
    notifysuccess.textContent=`Task "${task}" added sucessfully`;
    successModal.show();

    // Clear form inputs
    document.querySelector('form').reset();
});

// Function to check if task title is already used
function isTaskTitleDuplicate(taskTitle) {
    const taskSections = ['allTasksList', 'highTasks', 'moderateTasks', 'lowTasks', 'completedTasks'];
    for (let sectionId of taskSections) {
        const section = document.getElementById(sectionId);
        const titles = section.querySelectorAll('.card-title');
        for (let titleElement of titles) {
            if (titleElement.textContent.trim().toUpperCase() === taskTitle.trim().toUpperCase()) {
                return true; // Duplicate found
            }
        }
    }
    return false; // No duplicate found
}

// Function to create a task card
function createTaskCard(task, description, person, deadline, importance) {
    // Create a card container div
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('col-12', 'my-4');

    // Set background color based on importance
    let bgColor = '';
    if (importance === 'High') {
        bgColor = 'border border-3 border-danger rounded-4'; // Red background for high importance
    } else if (importance === 'Moderate') {
        bgColor = 'border border-3 border-warning rounded-4'; // Yellow background for moderate importance
    } else if (importance === 'Low') {
        bgColor = 'border border-3 border-success rounded-4'; // Green background for low importance
    }

    // Card structure using Bootstrap classes
    cardContainer.innerHTML = `
        <div class="card shadow ${bgColor}">
            <div class="card-body">
                <div class="row">
                    <h5 class="card-title fs-2 mb-3 col-10" style="text-transform:uppercase;">${task}</h5>
                    <span class="col-2 text-center"><i id="taskIcon" class="bi bi-hourglass-split" style="font-size:20pt;"></i></span>
                </div>
                <p class="card-text lead"><strong>Description:</strong> ${description}</p>
                <p class="card-text lead"><strong>Responsible Person:</strong> ${person}</p>
                <p class="card-text lead"><strong>Deadline:</strong> ${deadline}</p>
                <p class="card-text lead"><strong>Importance:</strong> ${importance}</p>
                <button class="btn btn-danger btn-sm" onclick="deleteCard(this)">Delete</button>
                <button class="btn btn-warning btn-sm my-2" onclick="markAsCompleted(this)">Completed</button>
            </div>
        </div>
    `;

    return cardContainer;
}

// Function to delete a card from all tabs
function deleteCard(button) {
    const card = button.closest('.card');
    const taskTitle = card.querySelector('.card-title').textContent.trim(); // Get the task title (used for matching across tabs)

    // Select all task sections where the card may exist
    const taskSections = ['allTasksList', 'highTasks', 'moderateTasks', 'lowTasks', 'completedTasks'];

    // Loop through each section and delete matching task cards
    taskSections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        const cards = section.querySelectorAll('.card'); // Get all cards in this section

        // Loop through all cards and delete the ones with the matching task title
        cards.forEach(cardItem => {
            const cardItemTitle = cardItem.querySelector('.card-title').textContent.trim();
            if (cardItemTitle === taskTitle) {
                cardItem.closest('.col-12').remove(); // Remove the card
            }
        });
    });
}

// Function to mark a card as completed


function markAsCompleted(button) {
    const card = button.closest('.card');
    const taskTitle = card.querySelector('.card-title').textContent.trim(); // Get the task title

    // Select all task sections where the card may exist
    const taskSections = ['allTasksList', 'highTasks', 'moderateTasks', 'lowTasks'];

    // Loop through each section and remove matching task cards
    taskSections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        const cards = section.querySelectorAll('.card'); // Get all cards in this section

        // Loop through all cards and delete the ones with the matching task title
        cards.forEach(cardItem => {
            const cardItemTitle = cardItem.querySelector('.card-title').textContent.trim();
            if (cardItemTitle === taskTitle) {
                cardItem.closest('.col-12').remove(); // Remove the card from this tab
            }
        });
    });

    // Modify the current card in the "All" section (or any clicked section) to reflect "Completed"
    card.classList.remove('border-danger', 'border-warning', 'border-success');
    card.classList.add('border-secondary');

    // Change the task icon to a green tick
    const icon = card.querySelector('#taskIcon');
    icon.classList.remove('bi-hourglass-split');
    icon.classList.add('bi-check-circle-fill', 'text-success');

    // Move the card to the "Completed Tasks" section
    document.getElementById('completedTasks').appendChild(card.closest('.col-12'));
}
//Desc letter count in the form
function updatecount(){
    const textarea = document.getElementById("Taskdesc");
      const charCountDisplay = document.getElementById("charCount");
      const maxLength = textarea.maxLength;
      const currentLength = textarea.value.length;

      charCountDisplay.textContent = `${currentLength}/${maxLength}  characters remaining`;
    }