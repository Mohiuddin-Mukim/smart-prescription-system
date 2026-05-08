let allPrescriptions = [];
let filteredPrescriptions = [];
let currentPage = 1;
const rowsPerPage = 5;
const token = localStorage.getItem('accessToken');


async function fetchPrescriptions() {
    try {
        const res = await fetch('http://localhost:8080/api/v1/prescriptions', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) throw new Error("Failed to load");

        const data = await res.json();


        allPrescriptions = data.sort((a, b) => new Date(b.date) - new Date(a.date));

        filteredPrescriptions = [...allPrescriptions];
        renderTable();
    } catch (err) {
        console.error(err);
        alert("Error loading prescriptions");
    }
}

function renderTable() {
    const tbody = document.getElementById("prescriptionBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedItems = filteredPrescriptions.slice(start, end);

    if (paginatedItems.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="px-6 py-10 text-center text-gray-500">No prescriptions found.</td></tr>`;
    } else {
        paginatedItems.forEach(p => {
            const tr = document.createElement("tr");
            tr.className = "hover:bg-gray-50 transition";
            tr.innerHTML = `
                <td class="px-6 py-4">${p.date}</td>
                <td class="px-6 py-4 font-semibold">${p.doctorName}</td>
                <td class="px-6 py-4 text-gray-500">${p.medicines ? p.medicines.join(", ") : 'N/A'}</td>
                <td class="px-6 py-4">
                    <button onclick="openPrescription(${p.id})" class="text-blue-600 font-bold hover:underline">
                        Open
                    </button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    const totalPages = Math.ceil(filteredPrescriptions.length / rowsPerPage) || 1;
    document.getElementById("pageInfo").innerText = `Page ${currentPage} of ${totalPages}`;
    document.getElementById("prevBtn").disabled = (currentPage === 1);
    document.getElementById("nextBtn").disabled = (currentPage === totalPages || filteredPrescriptions.length === 0);
}

window.changePage = function(step) {
    currentPage += step;
    renderTable();
};


function filterByTimeRange(range) {
    if (!range || range === "all") {
        filteredPrescriptions = [...allPrescriptions];
    } else {
        const now = new Date();
        let limitDate = new Date();

        if (range === "7days") limitDate.setDate(now.getDate() - 7);
        else if (range === "1month") limitDate.setMonth(now.getMonth() - 1);
        else if (range === "1year") limitDate.setFullYear(now.getFullYear() - 1);
        else if (range === "5years") limitDate.setFullYear(now.getFullYear() - 5);

        filteredPrescriptions = allPrescriptions.filter(p => new Date(p.date) >= limitDate);
    }
    currentPage = 1;
    renderTable();
}


document.getElementById('dateFilter').addEventListener('change', (e) => {
    const selectedDate = e.target.value;
    if (selectedDate) {
        filteredPrescriptions = allPrescriptions.filter(p => p.date === selectedDate);
    } else {
        filteredPrescriptions = [...allPrescriptions];
    }
    currentPage = 1;
    renderTable();
});



document.getElementById('dashboardNavLink').addEventListener('click', (e) => {
    e.preventDefault();
    const statsCards = document.querySelector('.grid');
    if (statsCards) statsCards.classList.remove('hidden');

    const tableTitle = document.getElementById('tableTitle');
    if (tableTitle) tableTitle.innerText = "Recent Prescriptions";

    updateActiveNavLink('dashboardNavLink');
});




window.clearFilter = function() {
    document.getElementById('dateFilter').value = "";
    filteredPrescriptions = [...allPrescriptions];
    currentPage = 1;
    renderTable();
};


window.showOnlyPrescriptions = function() {
    const statsCards = document.querySelector('.grid');
    if (statsCards) {
        statsCards.classList.add('hidden');
    }

    const tableTitle = document.getElementById('tableTitle');
    if (tableTitle) {
        tableTitle.innerText = "All My Prescriptions";
    }

    updateActiveNavLink('myPrescriptionsBtn');

    if (window.innerWidth < 768) {
        toggleSidebar();
    }
};


window.openPrescription = function(id) {
    window.location.href = `prescription_details.html?id=${id}`;
};


window.toggleSidebar = function() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (sidebar.classList.contains('-translate-x-full')) {
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
    } else {
        sidebar.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
    }
};


window.handleLogout = function() {
    const overlay = document.createElement('div');
    overlay.className = "fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4";
    overlay.innerHTML = `
        <div class="bg-white p-6 rounded-2xl max-w-sm w-full shadow-2xl text-center">
            <div class="text-red-500 text-4xl mb-4">👋</div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">Logout?</h3>
            <p class="text-gray-500 mb-6">Are you sure you want to sign out?</p>
            <div class="flex space-x-3">
                <button onclick="this.parentElement.parentElement.parentElement.remove()" class="flex-1 px-4 py-2 border rounded-xl hover:bg-gray-50 transition">Cancel</button>
                <button id="confirmBtn" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-bold">Logout</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    document.getElementById('confirmBtn').onclick = () => {
        localStorage.clear();
        window.location.href = "index.html";
    };
};


document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('userName') || 'User';
    const welcomeText = document.querySelector('header h2');
    const userInitial = document.querySelector('header .bg-blue-100');
    if (welcomeText) welcomeText.innerText = `Welcome back, ${userName}!`;
    if (userInitial) userInitial.innerText = userName.charAt(0).toUpperCase();

    fetchPrescriptions();

    const timeFilter = document.getElementById('timeRangeFilter');
    if (timeFilter) {
        timeFilter.addEventListener('change', (e) => filterByTimeRange(e.target.value));
    }

    const myRxBtn = document.getElementById('myPrescriptionsBtn');
    if (myRxBtn) {
        myRxBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showOnlyPrescriptions();
        });
    }
});


function updateActiveNavLink(activeId) {
    const links = document.querySelectorAll('.nav-link');

    links.forEach(link => {
        if (link.id === activeId) {
            link.classList.add('text-blue-700', 'bg-blue-50', 'font-semibold');
            link.classList.remove('text-gray-600', 'hover:bg-gray-50');
        } else {
            link.classList.remove('text-blue-700', 'bg-blue-50', 'font-semibold');
            link.classList.add('text-gray-600', 'hover:bg-gray-50');
        }
    });
}


/*
function updateSmartAlert() {
    const alertText = document.getElementById('smartAlertText');
    if (!alertText) return;

    if (allPrescriptions.length === 0) {
        alertText.innerText = "No active prescriptions.";
        return;
    }

    const now = new Date();
    const currentHour = now.getHours();

    const scheduleTimes = [
        { name: 'Morning', hour: 8, label: '08:00 AM', index: 0 },
        { name: 'Afternoon', hour: 14, label: '02:00 PM', index: 1 },
        { name: 'Night', hour: 21, label: '09:00 PM', index: 2 }
    ];


    let nextSchedule = scheduleTimes.find(s => s.hour > currentHour);


    if (!nextSchedule) {
        nextSchedule = scheduleTimes[0];
    }

    let foundMedicine = null;

    for (let p of allPrescriptions) {
        if (p.medicines) {
            for (let med of p.medicines) {
                if (med.dosage && (med.status === 'Active' || !med.status)) {

                    const dosageParts = med.dosage.split('+');


                    if (dosageParts.length === 3) {
                        const doseAmount = parseInt(dosageParts[nextSchedule.index]);
                        if (!isNaN(doseAmount) && doseAmount > 0) {
                            foundMedicine = med.brandName;
                            break;
                        }
                    }

                    else if (dosageParts.length === 2) {

                        const doseIdx = nextSchedule.index === 2 ? 1 : 0;
                        if (parseInt(dosageParts[doseIdx]) > 0) {
                            foundMedicine = med.brandName;
                            break;
                        }
                    }

                    else {
                        foundMedicine = med.brandName;
                        break;
                    }
                }
            }
        }
        if (foundMedicine) break;
    }

    if (foundMedicine) {
        alertText.innerHTML = `Next: <b class="text-blue-600">${foundMedicine}</b> at ${nextSchedule.label}`;
    } else {
        alertText.innerText = "No medicines scheduled for the next slot.";
    }
}

*/




