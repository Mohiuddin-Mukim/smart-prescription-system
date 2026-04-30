const token = localStorage.getItem('accessToken');

fetch('http://localhost:8080/api/v1/prescriptions', {
    headers: {
        'Authorization': `Bearer ${token}`
    }
})
    .then(async res => {
        if (!res.ok) {
            throw new Error("Failed to load");
        }
        return res.json();
    })
    .then(data => {

        const tbody = document.querySelector("tbody");
        tbody.innerHTML = "";

        data.forEach(p => {

            const tr = document.createElement("tr");

            tr.innerHTML = `
            <td class="px-6 py-4">${p.date}</td>
            <td class="px-6 py-4 font-semibold">${p.doctorName}</td>
            <td class="px-6 py-4 text-gray-500">
                ${p.medicines.join(", ")}
            </td>
            <td class="px-6 py-4">
                <span class="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs font-bold uppercase">
                    Active
                </span>
            </td>
            <td class="px-6 py-4">
                <button onclick="openPrescription(${p.id})"
                        class="text-blue-600 font-bold hover:underline">
                    Open
                </button>
            </td>
        `;

            tbody.appendChild(tr);
        });

    })
    .catch(err => {
        console.error(err);
        alert("Error loading prescriptions");
    });

function openPrescription(id) {
    window.location.href = `prescription_details.html?id=${id}`;
}