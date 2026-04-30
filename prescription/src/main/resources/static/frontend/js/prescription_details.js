const token = localStorage.getItem('accessToken');
const id = new URLSearchParams(window.location.search).get("id");

fetch(`http://localhost:8080/api/v1/prescriptions/${id}`, {
    headers: {
        'Authorization': `Bearer ${token}`
    }
})
    .then(res => {
        if (!res.ok) throw new Error("Unauthorized or error");
        return res.json();
    })
    .then(data => {
        // Basic Info rendering
        document.getElementById('doctor').innerText = data.doctorName;
        document.getElementById('date').innerText = data.date;

        const container = document.getElementById('medicines');
        container.innerHTML = "";

        // Iterate through medicines using the new UI layout
        data.medicines.forEach(med => {
            const div = document.createElement('div');
            div.className = "p-6 border rounded-2xl bg-white shadow-sm mb-6 border-l-4 border-l-blue-500";

            // Progress bar & Status logic
            const progressPercent = med.durationDays > 0 ? Math.min((med.daysPassed / med.durationDays) * 100, 100) : 0;
            const statusColor = med.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700';

            div.innerHTML = `
                <div class="flex justify-between items-start mb-4">
                    <div>
                        <h3 class="font-bold text-xl text-gray-800">${med.brandName} <span class="text-sm font-normal text-gray-500">(${med.genericName})</span></h3>
                        <p class="text-xs text-gray-400 mt-1">${med.type} | ${med.strength} | ${med.dosageForm}</p>
                    </div>
                    <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColor}">
                        ${med.status || 'Active'}
                    </span>
                </div>

                <div class="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl mb-4 border border-gray-100">
                    <div>
                        <p class="text-[10px] text-gray-400 uppercase font-bold">Dosage Schedule</p>
                        <p class="text-md font-bold text-blue-600">${med.dosage || 'N/A'}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-[10px] text-gray-400 uppercase font-bold">Treatment Timeline</p>
                        <p class="text-sm font-bold text-gray-700">Day ${med.daysPassed || 0} of ${med.durationDays || '∞'}</p>
                    </div>
                    <div class="col-span-2 mt-2">
                        <div class="w-full bg-gray-200 rounded-full h-1.5">
                            <div class="bg-blue-500 h-1.5 rounded-full transition-all duration-500" style="width: ${progressPercent}%"></div>
                        </div>
                        <div class="flex justify-between mt-1">
                            <p class="text-[10px] text-gray-400">Started: ${med.startDate || 'N/A'}</p>
                            <p class="text-[10px] font-bold text-blue-500">${med.daysRemaining || 0} days left</p>
                        </div>
                    </div>
                </div>

                <div class="space-y-1">
                    ${createDetailRow("Side Effects", med.sideEffects)}
                    ${createDetailRow("Indication", med.indication)}
                    ${createDetailRow("Storage", med.storageConditions)}
                    ${createDetailRow("Pharmacology", med.pharmacology)}
                    ${createDetailRow("Dosage Description", med.dosageDescription)}
                    ${createDetailRow("Contraindications", med.contraindications)}
                    ${createDetailRow("Pregnancy & Lactation", med.pregnancyAndLactation)}
                </div>
            `;
            container.appendChild(div);
        });

        // PDF functionality
        document.getElementById('viewPdf').onclick = () => {
            if (data.pdfUrl) {
                window.open(`http://localhost:8080/${data.pdfUrl}`, '_blank');
            } else {
                alert("PDF not available");
            }
        };
    })
    .catch(err => {
        console.error(err);
        alert("Error loading prescription");
    });

/**
 * Helper function to create expandable detail rows
 */
function createDetailRow(label, value) {
    if (!value || value === 'N/A' || value === 'Not specified') return '';
    return `
        <details class="group cursor-pointer">
            <summary class="text-xs text-blue-600 font-medium hover:underline py-1 flex justify-between items-center">
                ${label} <span class="text-[10px] group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p class="text-[11px] text-gray-600 pl-2 pb-2 leading-relaxed border-l-2 border-gray-100 ml-1">
                ${value}
            </p>
        </details>
    `;
}