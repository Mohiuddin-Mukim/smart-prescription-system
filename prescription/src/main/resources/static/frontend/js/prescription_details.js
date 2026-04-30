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
    // ... আগের কোড (fetch অংশ) ...
    .then(data => {
        document.getElementById('doctor').innerText = data.doctorName;
        document.getElementById('date').innerText = data.date;

        const container = document.getElementById('medicines');
        container.innerHTML = "";



        // MedicineDetailDTO এর লিস্ট লুপ হচ্ছে
        data.medicines.forEach(med => {
            const div = document.createElement('div');
            div.className = "p-4 border rounded-xl bg-gray-50 mb-4"; // একটু মার্জিন যোগ করলাম

            div.innerHTML = `
        <h3 class="font-bold text-lg">${med.brandName} (${med.genericName})</h3>
        <p><strong>Type:</strong> ${med.type} | <strong>Strength:</strong> ${med.strength}</p>
        <p><strong>Dosage Form:</strong> ${med.dosageForm}</p>
        
        <details class="mt-2">
            <summary class="cursor-pointer text-blue-600 font-medium">Side Effects</summary>
            <p class="text-sm mt-1 text-gray-700">${med.sideEffects || 'Not specified'}</p>
        </details>

        <details class="mt-2">
            <summary class="cursor-pointer text-blue-600 font-medium">Storage Conditions</summary>
            <p class="text-sm mt-1 text-gray-700">${med.storageConditions || 'Not specified'}</p>
        </details>
        
        <details class="mt-2">
            <summary class="cursor-pointer text-blue-600 font-medium">Indication</summary>
            <p>${med.indication || 'N/A'}</p>
        </details>
        
        <details class="mt-2">
            <summary class="cursor-pointer text-blue-600 font-medium">Pharmacology</summary>
            <p>${med.pharmacology || 'N/A'}</p>
        </details>
        
        <details class="mt-2">
           <summary class="cursor-pointer text-blue-600 font-medium">Dosage Description</summary>
           <p>${med.dosageDescription || 'N/A'}</p>
        </details>
        
        <details class="mt-2">
            <summary class="cursor-pointer text-blue-600 font-medium">Contraindications</summary>
            <p>${med.contraindications || 'N/A'}</p>
        </details>
        
        <details class="mt-2">
           <summary class="cursor-pointer text-blue-600 font-medium">Pregnancy & Lactation</summary>
           <p>${med.pregnancyAndLactation || 'N/A'}</p>
        </details>
        `;
            container.appendChild(div);
        });





        document.getElementById('viewPdf').onclick = () => {
            // pdfUrl যদি ব্যাকএন্ড থেকে PrescriptionDetailsDTO তে আসে তবেই কাজ করবে
            window.open(`http://localhost:8080/${data.pdfUrl}`, '_blank');
        };
    })
    // ... বাকি কোড ...
    .catch(err => {
        console.error(err);
        alert("Error loading prescription");
    });