        document.getElementById('hallForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let halls = JSON.parse(localStorage.getItem('halls')) || [];
    let editingIndex = document.getElementById('hallForm').getAttribute('data-editing-index');

    let hall = {
        name: document.getElementById('hallName').value,
        owner: document.getElementById('owner').value,
        price: Number(document.getElementById('price').value), // Convert to number
        timings: document.getElementById('timings').value,
        rows: Number(document.getElementById('rows').value), // Convert to number
        cols: Number(document.getElementById('cols').value) // Convert to number
    };

    if (editingIndex !== null) {
        halls[parseInt(editingIndex)] = hall; // Convert string index to number
        document.getElementById('hallForm').removeAttribute('data-editing-index'); // Clear edit mode
        document.querySelector('#hallForm button[type="submit"]').textContent = "Add Hall"; // Reset button text
    } else {
        halls.push(hall);
    }

    localStorage.setItem('halls', JSON.stringify(halls));

    document.getElementById('hallForm').reset(); // Reset form fields

    displayHalls();
});

function displayHalls() {
    let hallListDiv = document.getElementById('hallList');
    hallListDiv.innerHTML = ''; // Clear existing list

    let halls = JSON.parse(localStorage.getItem('halls')) || [];

    if (halls.length === 0) {
        hallListDiv.innerHTML = "<p>No halls available. Add a new hall.</p>";
        return;
    }

    halls.forEach((hall, index) => {
        let hallDiv = document.createElement('div');
        hallDiv.innerHTML = `<strong>${hall.name}</strong> - Owner: ${hall.owner}, Price: ${hall.price}, Timings: ${hall.timings}, Size: ${hall.rows} X ${hall.cols}
            <button onclick="editHall(${index})">Edit</button> 
            <button onclick="deleteHall(${index})">Delete</button>
            <button onclick="showSeats(${index})">View Seats</button>
            `;
            
        hallListDiv.appendChild(hallDiv);
    });
}

function showSeats(hallIndex){
    let halls = JSON.parse(localStorage.getItem('halls'))||[];
    let hall = halls[hallIndex];

    let seatLayoutDiv = document.getElementById('seatLayout');
    seatLayoutDiv.innerHTML = `<h3>Seats for ${hall.name}</h3>`;

    let seats = JSON.parse(localStorage.getItem(`seats_${hallIndex}`))|| Array.from({length: hall.rows}, () => Array(hall.cols).fill(false));

    let table = document.createElement('table');
    table.style.borderCollapse= 'collapse';

    for(let i=0; i < hall.rows; i++){
        let row = document.createElement('tr');

        for(let j=0; j<hall.cols;j++){
            let seat =  document.createElement('td');
            seat.style.border = '1px solid black';
            seat.style.padding = '5px';

            let button = document.createElement('button');
            // Label seat as A1, B2, etc.
            button.textContent = `${String.fromCharCode(65 + i)}${j + 1}`;

            button.className = seats[i][j] ? "booked" : "";
            button.onclick = () => toggleSeat(hallIndex,i,j);

            seat.appendChild(button);
            row.appendChild(seat);
        }
        
        table.appendChild(row);
    }

    seatLayoutDiv.appendChild(table);
}

function toggleSeat(hallIndex, row, col){
    let seats = JSON.parse(localStorage.getItem(`seats_${hallIndex}`))|| [];

    // Ensure seats array is initialized properly
    if(seats.length===0){
        let halls =  JSON.parse(localStorage.getItem('halls'))||[];
        let hall = halls[hallIndex];
        seats = Array.from({length: hall.rows},()=> Array(hall.cols).fill(false));
    }

    seats[row][col] = !seats[row][col];
    localStorage.setItem(`seats_${hallIndex}`, JSON.stringify(seats));

    showSeats(hallIndex);
}

function deleteHall(index) {
    let halls = JSON.parse(localStorage.getItem('halls')) || [];
    halls.splice(index, 1); // Remove hall based on index
    localStorage.setItem('halls', JSON.stringify(halls)); // Update Storage
    displayHalls();
    localStorage.removeItem(`seats_${index}`);
}

function editHall(index) {
    let halls = JSON.parse(localStorage.getItem('halls')) || [];
    let hall = halls[index];

    document.getElementById('hallName').value = hall.name;
    document.getElementById('owner').value = hall.owner;
    document.getElementById('price').value = hall.price;
    document.getElementById('timings').value = hall.timings;
    document.getElementById('rows').value = hall.rows;
    document.getElementById('cols').value = hall.cols;

    document.getElementById('hallForm').setAttribute('data-editing-index', index);
    document.querySelector('#hallForm button[type="submit"]').textContent = "Update Hall";
}

// Load halls when the page opens
window.onload = displayHalls;
