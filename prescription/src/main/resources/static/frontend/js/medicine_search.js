const searchInput = document.getElementById('medicineSearch');
const resultsArea = document.getElementById('results-area');
const emptyState = document.getElementById('empty-state');

searchInput.addEventListener('input', async (e) => {
    const query = e.target.value;
    if (query.length < 2) return;

    try {
        const response = await fetch(`http://localhost:8080/api/v1/medicines/search?q=${query}`);
        const medicines = await response.json();

        renderResults(medicines);
    } catch (error) {
        console.error("Search failed:", error);
    }
});

function renderResults(medicines) {
    resultsArea.innerHTML = '';

    if (medicines.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    medicines.forEach(med => {
        const card = `
            <a href="medicineInfo.html?id=${med.id}" class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition flex justify-between items-center group">
                <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">💊</div>
                    <div>
                        <h4 class="font-bold text-gray-800 text-lg">${med.brandName}</h4>
                        <p class="text-sm text-gray-500">Generic: ${med.genericName} | ${med.strength}</p>
                    </div>
                </div>
                <div class="text-right">
                    <span class="text-green-600 font-bold">${med.dosageForm}</span>
                    <p class="text-xs text-gray-400">${med.manufacturerName}</p>
                </div>
            </a>
        `;
        resultsArea.insertAdjacentHTML('beforeend', card);
    });
}