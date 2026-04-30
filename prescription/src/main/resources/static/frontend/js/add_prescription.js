let medicineCount = 0;

document.addEventListener('DOMContentLoaded', () => {
    console.log("Page Loaded");
    addMedicineRow();
});

function addMedicineRow() {
    medicineCount++;
    const rowId = `row-${medicineCount}`;
    const medicineList = document.getElementById('medicine-list');

    const html = `
        <div id="${rowId}" class="medicine-row space-y-4 p-4 border border-blue-50 rounded-2xl bg-blue-50/30 relative mb-4">
            <button type="button" onclick="removeRow('${rowId}')" class="absolute top-2 right-4 text-red-400 hover:text-red-600 text-xs font-bold">Remove</button>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="md:col-span-2 relative">
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Medicine Name</label>
                    <input type="text" placeholder="Search medicine..." 
                           oninput="searchMedicine(this, '${rowId}')"
                           class="med-input w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-400">
                    
                    <input type="hidden" class="med-id">
                    
                    
                    <div class="suggestion-box absolute z-10 w-full bg-white border shadow-xl rounded-b-xl hidden max-h-48 overflow-y-auto"></div>
                </div>

                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Dosage</label>
                    <select class="med-dosage w-full px-4 py-2 border border-gray-200 rounded-lg outline-none bg-white">
                        <option value="1-0-1">1-0-1 (Twice)</option>
                        <option value="1-0-1">0-1-1 (Twice)</option>
                        <option value="1-0-1">1-1-0 (Twice)</option>
                        <option value="1-1-1">1-1-1 (Thrice)</option>
                        <option value="0-0-1">0-0-1 (Nightly)</option>
                        <option value="1-0-0">1-0-0 (Morning)</option>
                        <option value="0-1-0">0-1-0 (Afternoon)</option>
                    </select>
                </div>
            </div>
        </div>
    `;
    medicineList.insertAdjacentHTML('beforeend', html);
}


function removeRow(id) {
    if (document.querySelectorAll('.medicine-row').length > 1) {
        document.getElementById(id).remove();
    } else {
        alert("At least one medicine is required.");
    }
}


async function searchMedicine(input, rowId) {
    const query = input.value;
    const row = document.getElementById(rowId);
    const box = row.querySelector('.suggestion-box');
    const idInput = row.querySelector('.med-id');
    const token = localStorage.getItem('accessToken');


    if (query.length < 2) {
        box.classList.add('hidden');
        idInput.value = "";
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/v1/medicines/search?q=${encodeURIComponent(query)}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Search failed");
        const data = await response.json();

        box.innerHTML = '';

        if (data.length === 0) {
            box.classList.add('hidden');
            idInput.value = "";
            return;
        }

        data.forEach(med => {
            const div = document.createElement('div');
            div.className = "p-3 hover:bg-blue-50 cursor-pointer border-b text-sm transition-colors";


            div.innerHTML = `
                <div>
                    <strong class="text-blue-600">${med.brandName}</strong> 
                    <span class="text-xs text-gray-500">(${med.genericName})</span>
                </div>
                <div class="text-[10px] text-gray-400">${med.strength} | ${med.manufacturerName}</div>
            `;


            div.onclick = () => {
                input.value = med.brandName;
                idInput.value = med.id;
                box.classList.add('hidden');
            };
            box.appendChild(div);
        });
        box.classList.remove('hidden');
    } catch (e) {
        console.error("❌ Search error:", e);
    }
}



async function submitPrescription() {
    const token = localStorage.getItem('accessToken');

    if (!token) {
        alert("Session expired. Please login again.");
        window.location.href = "login.html";
        return;
    }

    const payload = {
        doctorName: document.getElementById('doctorName')?.value.trim(),
        prescriptionDate: document.getElementById('prescriptionDate')?.value,
        medicines: []
    };

    let isValidSelection = true;

    document.querySelectorAll('.medicine-row').forEach(row => {
        const idVal = row.querySelector('.med-id').value;
        const dosage = row.querySelector('.med-dosage').value;
        const nameVal = row.querySelector('.med-input').value;


        if (nameVal.trim() !== "" && !idVal) {
            isValidSelection = false;
        }

        if (idVal) {
            payload.medicines.push({
                medicineId: parseInt(idVal),
                dosage: dosage
            });
        }
    });

    if (!isValidSelection) {
        alert("Please select the medicine from suggestions properly.");
        return;
    }

    if (payload.medicines.length === 0) {
        alert("Please add at least one valid medicine.");
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/v1/prescriptions/manual', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` //
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("✅ Prescription Saved Successfully!");
            window.location.href = 'dashboard.html';
        } else if (response.status === 403) {
            alert("❌ Permission Denied (403). Check your login.");
        } else {
            const err = await response.json();
            alert("Error: " + (err.message || "Failed to save"));
        }
    } catch (e) {
        console.error("Submission Error:", e);
        alert("Failed to connect to server.");
    }
}