window.onload = () => {
    loadFromLocalStorage();
};

nameofuser.innerHTML=localStorage.getItem("currentUser")
let toatalincome=0
let totalexpense=0
let balance=0
const openUser=()=>{
    document.getElementById("logout").classList.toggle("d-none")
}
const select = (idname) => {
    // Remove "selected" class from all sidebar items
    document.querySelectorAll('.eachitem').forEach(item => item.classList.remove('selected'));
    document.getElementById(idname).classList.add('selected');

    // Hide all content boxes
    document.querySelectorAll('.col-md-9').forEach(box => box.classList.add('d-none'));

    // Show the selected content box
    if (idname === "dashboard") {
        document.getElementById("dashboardBox").classList.remove('d-none');
    } else if (idname === "transactions") {
        document.getElementById("TransactionsAddingBox").classList.remove('d-none');
    } else if (idname === "reports") {
        
        document.getElementById("reportsBox").classList.remove('d-none');
    }
};
const toggleSidebar = () => {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
};


// Remove export button from navigation bar
document.querySelector("#exportCsvBtn").remove();

const showTransations=()=>{
  document.getElementById("details").classList.remove("d-none")
document.getElementById("TransactionsAddingBox").classList.add("d-none")
document.getElementById("TransactionsAddingBox").classList.remove("col-md-9")


}
//local storahe.setItem("users")
function saveToLocalStorage() {
    const data = {
        income: incomeData, // Array of income entries
        expense: expenseData, // Array of expense entries
        balance: balance,    // Save the current balance
    };

    // Retrieve the users array from local storage
    const users = JSON.parse(localStorage.getItem("users")) || [];

    // Get the current user from local storage
    const currentUser = localStorage.getItem("currentUser");

    // Find the index of the current user in the users array
    const userIndex = users.findIndex(user => user.username === currentUser);

    if (userIndex !== -1) {
        // If the user exists, update their budgetData
        const currentUserData = users[userIndex];

        if (!Array.isArray(currentUserData.budgetData)) {
            currentUserData.budgetData = []; // Initialize if it doesn't exist
        }

        currentUserData.budgetData=(data); // Add the new budget data

        // Replace the modified user data back into the users array
        users[userIndex] = currentUserData;

        // Save the updated users array back to local storage
        localStorage.setItem("users", JSON.stringify(users));
    } else {
        console.error("Current user not found in local storage!");
    }
}


function loadFromLocalStorage() {
    const currentUser=localStorage.getItem("currentUser")
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const currentUserData=users.find(user => user.username === currentUser);
    let data=currentUserData.budgetData
    console.log(data);

    if (data) {
        incomeData = data.income || [];
        expenseData = data.expense || [];
        balance = data.balance || 0; // Load the saved balance
        // Update the UI with loaded data
        updateIncomeTable();
        updateExpenseTable();
        updateDashboard();
    }
}
let count=1
let incomeData = [];
let expenseData = [];

const addIncome = () => {
    const income = Number(document.getElementById("income").value);
    const description = document.getElementById("icnomeDiscription").value;
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${now.getFullYear()}`;

    if (income !== 0 && description !== "") {
        const entry = {
            id: count,
            amount: income,
            description: description,
            balance: balance + income, // Updated balance for this entry
            date: formattedDate,
        };
        incomeData.push(entry);
        count++;
        balance += income; // Update global balance

        // Update UI
        updateIncomeTable();
        updateDashboard();

        // Save to local storage
        saveToLocalStorage();
        document.getElementById("income").value=""
        document.getElementById("icnomeDiscription").value=""
    } else {
        alert("Please enter valid income and description.");
    }
};

sl=1
const addExpense = () => {
    const expense = Number(document.getElementById("expense").value);
    const description = document.getElementById("expenseDiscription").value;
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1)
        .toString()
        .padStart(2, '0')}/${now.getFullYear()}`;

    if (expense !== 0 && description !== "") {
        const entry = {
            id: sl,
            amount: expense,
            description: description,
            balance: balance - expense, // Updated balance for this entry
            date: formattedDate,
        };
        expenseData.push(entry);
        sl++;
        balance -= expense; // Update global balance

        // Update UI
        updateExpenseTable();
        updateDashboard();

        // Save to local storage
        saveToLocalStorage();
        document.getElementById("expense").value=""
        document.getElementById("expenseDiscription").value=""
    } else {
        alert("Please enter valid expense and description.");
    }
};


function updateIncomeTable() {
    const incomeTable = document.getElementById("incomeTable");
    incomeTable.innerHTML = "";
    incomeData.forEach((entry) => {
        incomeTable.innerHTML += `
            <tr>
                <td>${entry.id}</td>
                <td>${entry.amount}</td>
                <td>${entry.description}</td>
                <td>${entry.balance}</td>
                <td>${entry.date}</td>
            </tr>
        `;
    });
}

function updateExpenseTable() {
    const expenseTable = document.getElementById("expenseTable");
    expenseTable.innerHTML = "";
    expenseData.forEach((entry) => {
        expenseTable.innerHTML += `
            <tr>
                <td>${entry.id}</td>
                <td>${entry.amount}</td>
                <td>${entry.description}</td>
                <td>${entry.balance}</td>
                <td>${entry.date}</td>
            </tr>
        `;
    });
}
function updateDashboard() {
    const totalIncome = incomeData.reduce((sum, entry) => sum + entry.amount, 0);
    const totalExpense = expenseData.reduce((sum, entry) => sum + entry.amount, 0);

    document.getElementById("totalIncome").innerText = `₹${totalIncome}`;
    document.getElementById("totalExpense").innerText = `₹${totalExpense}`;
    document.getElementById("balance").innerText = `${balance}`;
    document.getElementById("balanceOfDashboard").innerText = `₹${balance}`;
}



// Function to export table data to CSV
document.getElementById("exportCsvBtn").addEventListener("click", function() {
    // Get the income table and expense table
    const incomeTable = document.getElementById("incomeTable");
    
    const expenseTable = document.getElementById("expenseTable");


    // Combine both tables into a CSV format
    let csvData = "Income Details\nSl no, Amount, Description, Balance, Date\n";
    csvData += convertTableToCSV(incomeTable);
    csvData += "\nExpense Details\nSl no, Amount, Description, Balance, Date\n";
    csvData += convertTableToCSV(expenseTable);

    // Create a link element to trigger download
    const hiddenElement = document.createElement("a");
    hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csvData);
    hiddenElement.target = "_blank";
    hiddenElement.download = "transaction_details.csv";
    hiddenElement.click();
});

// Function to convert table rows to CSV format
function convertTableToCSV(table) {
    let csv = '';
    const rows = table.querySelectorAll('tr');
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td, th');
        const rowData = Array.from(cells)
            .map(cell => cell.textContent)
            .join(","); // Join each column with a comma
        csv += rowData + "\n"; // Add the row data with a new line
    });
    return csv;
}
document.getElementById("searchInput").addEventListener("input", function () {
    const searchValue = this.value.toLowerCase(); // Get input value and convert to lowercase
    const rows = document.querySelectorAll("#details tbody tr"); // Get all table rows

    rows.forEach(row => {
        const rowText = row.textContent.toLowerCase(); // Get the row's text content
        if (rowText.includes(searchValue)) {
            row.style.display = ""; // Show row if it matches
        } else {
            row.style.display = "none"; // Hide row if it doesn't match
        }
    });
});
