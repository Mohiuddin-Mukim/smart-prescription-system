let medicineCount = 0;

document.addEventListener('DOMContentLoaded', () => {
    console.log("Page Loaded");
    addMedicineRow();


    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', handlePdfUpload);
    }
});

function addMedicineRow() {
    medicineCount++;
    const rowId = `row-${medicineCount}`;
    const medicineList = document.getElementById('medicine-list');

    const html = `
        <div id="${rowId}" class="medicine-row space-y-4 p-6 border border-blue-50 rounded-2xl bg-blue-50/30 relative mb-4">
            <button type="button" onclick="removeRow('${rowId}')" class="absolute top-2 right-4 text-red-400 hover:text-red-600 text-xs font-bold">Remove</button>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="relative">
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Medicine Name</label>
                    <input type="text" placeholder="Search medicine..." 
                           oninput="searchMedicine(this, '${rowId}')"
                           class="med-input w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-400">
                    <input type="hidden" class="med-id">
                    <div class="suggestion-box absolute z-10 w-full bg-white border shadow-xl rounded-b-xl hidden max-h-48 overflow-y-auto"></div>
                </div>

                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Dosage Instruction</label>
                    <select class="med-dosage w-full px-4 py-2 border border-gray-200 rounded-lg outline-none bg-white">
                        <option value="1-0-1">1-0-1 (Twice)</option>
                        <option value="1-1-1">1-1-1 (Thrice)</option>
                        <option value="0-0-1">0-0-1 (Nightly)</option>
                        <option value="1-0-0">1-0-0 (Morning)</option>
                        <option value="0-1-0">0-1-0 (Afternoon)</option>
                        <option value="0-1-1">0-1-1 (Twice)</option>
                    </select>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Duration (Days)</label>
                    <input type="number" placeholder="e.g. 7" class="med-duration w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-400">
                </div>
                <div>
                    <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Start Date (Optional)</label>
                    <input type="date" class="med-start-date w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-400">
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
    const prescriptionDate = document.getElementById('prescriptionDate')?.value;

    if (!token) {
        showStatusModal('error', 'Session Expired', 'Please login again to continue.', () => {
            window.location.href = "login.html";
        });
        return;
    }

    if (!prescriptionDate) {
        showStatusModal('warning', 'Missing Date', 'Please select the prescription date.');
        return;
    }

    const payload = {
        doctorName: document.getElementById('doctorName')?.value.trim(),
        prescriptionDate: prescriptionDate,
        medicines: []
    };

    let isValidSelection = true;

    document.querySelectorAll('.medicine-row').forEach(row => {
        const idVal = row.querySelector('.med-id').value;
        const nameVal = row.querySelector('.med-input').value;
        const dosage = row.querySelector('.med-dosage').value;
        const duration = row.querySelector('.med-duration').value;
        const startDate = row.querySelector('.med-start-date').value;


        if (nameVal.trim() !== "" && !idVal) {
            isValidSelection = false;
        }

        if (idVal) {
            payload.medicines.push({
                medicineId: parseInt(idVal),
                dosage: dosage,
                durationDays: duration ? parseInt(duration) : 0,
                startDate: startDate || prescriptionDate // সিলেক্ট না করলে প্রেসক্রিপশন ডেটই স্টার্ট ডেট
            });
        }
    });

    if (!isValidSelection) {
        showStatusModal('warning', 'Invalid Selection', 'Please select medicines from the suggestions list.');
        return;
    }

    if (payload.medicines.length === 0) {
        showStatusModal('warning', 'No Medicines', 'Please add at least one valid medicine.');
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/v1/prescriptions/manual', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            showStatusModal('success', 'Success!', 'Prescription saved successfully.', () => {
                window.location.href = 'dashboard.html';
            });
        } else {
            const err = await response.json();
            showStatusModal('error', 'Failed to Save', err.message || "An error occurred.");
        }
    } catch (e) {
        showStatusModal('error', 'Server Error', 'Failed to connect to the server.');
    }
}


async function handlePdfUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('accessToken');

    try {
        console.log("Starting extraction...");
        alert("Extracting data... Please wait.");

        const response = await fetch('http://localhost:8080/api/v1/prescriptions/upload-extract', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            if (response.status === 503) {
                showStatusModal('error', 'AI Server Busy', 'গুগল এআই সার্ভার এখন ব্যস্ত। দয়া করে ২-৫ মিনিট পর আবার চেষ্টা করুন।');
            } else if (response.status === 401) {
                showStatusModal('error', 'Session Expired', 'আপনার সেশন শেষ হয়ে গেছে। দয়া করে আবার লগইন করুন।', () => {
                    window.location.href = 'login.html';
                });
            } else {
                showStatusModal('error', 'Extraction Failed', 'পিডিএফ থেকে ডেটা বের করা সম্ভব হয়নি। ম্যানুয়ালি চেষ্টা করুন।');
            }
            return;
        }

        const extractedMedicines = await response.json();
        console.log("Extracted Data:", extractedMedicines);

        if (extractedMedicines && extractedMedicines.length > 0) {

            const medicineList = document.getElementById('medicine-list');
            medicineList.innerHTML = '';
            medicineCount = 0;

            extractedMedicines.forEach(med => {
                addMedicineRow();
                const currentRow = document.querySelector(`.medicine-row:last-child`);

                if (currentRow) {
                    currentRow.querySelector('.med-input').value = med.brandName || "";
                    currentRow.querySelector('.med-id').value = med.medicineId || "";
                    const dosageSelect = currentRow.querySelector('.med-dosage');

                    if (med.dosage && dosageSelect) {
                        let optionExists = Array.from(dosageSelect.options)
                            .some(opt => opt.value === med.dosage);

                        if (!optionExists) {
                            let newOpt = new Option(med.dosage, med.dosage);
                            dosageSelect.add(newOpt);
                        }

                        dosageSelect.value = med.dosage;
                    }
                    if(med.durationDays) {
                        const durationInput = currentRow.querySelector('.med-duration');
                        if(durationInput) {
                            durationInput.value = med.durationDays;
                        }
                    }
                }
            });

            switchTab('manual');

            document.getElementById('tab-manual').classList.add('bg-white', 'text-blue-600', 'shadow-sm');
            document.getElementById('tab-pdf').classList.remove('bg-white', 'text-blue-600', 'shadow-sm');

            //alert(`Found ${extractedMedicines.length} medicines! Please verify.`);
            showStatusModal('success', 'Extraction Complete', `${extractedMedicines.length}টি ওষুধ পাওয়া গেছে। দয়া করে যাচাই করে নিন।`);
        } else {
            alert("No medicines recognized in this PDF. Try manual entry.");
        }

    } catch (error) {
        console.error("❌ Extraction Error:", error);
        // নেটওয়ার্ক বা অন্য কোনো বড় এরর হলে
        showStatusModal('error', 'Connection Error', 'সার্ভারের সাথে যোগাযোগ করা যাচ্ছে না। আপনার ইন্টারনেট চেক করুন।');
    }
}


function showStatusModal(type, title, message, callback = null) {
    const modal = document.getElementById('statusModal');
    const content = document.getElementById('statusModalContent');
    const iconBg = document.getElementById('modalIconBg');
    const icon = document.getElementById('modalIcon');
    const titleEl = document.getElementById('modalTitle');
    const messageEl = document.getElementById('modalMessage');
    const actions = document.getElementById('modalActions');


    if (type === 'success') {
        iconBg.className = "w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl";
        icon.innerText = "✓";
        actions.innerHTML = `<button id="modalOkBtn" class="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">Go to Dashboard</button>`;
    } else if (type === 'error') {
        iconBg.className = "w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl";
        icon.innerText = "✕";
        actions.innerHTML = `<button id="modalOkBtn" class="w-full bg-gray-800 text-white py-3 rounded-xl font-bold hover:bg-gray-900 transition">Try Again</button>`;
    } else if (type === 'warning') {
        iconBg.className = "w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl";
        icon.innerText = "!";
        actions.innerHTML = `<button id="modalOkBtn" class="w-full bg-yellow-600 text-white py-3 rounded-xl font-bold hover:bg-yellow-700 transition">Got it</button>`;
    }

    titleEl.innerText = title;
    messageEl.innerText = message;

    modal.classList.remove('hidden');
    setTimeout(() => {
        content.classList.remove('scale-95', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 10);

    document.getElementById('modalOkBtn').onclick = () => {
        modal.classList.add('hidden');
        content.classList.add('scale-95', 'opacity-0');
        if (callback) callback();
    };
}


