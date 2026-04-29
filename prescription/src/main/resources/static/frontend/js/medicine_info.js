document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const medicineId = urlParams.get('id');
    const mainContent = document.getElementById('main-content');

    if (!medicineId) {
        window.location.href = 'search.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/v1/medicines/${medicineId}`);

        if (!response.ok) throw new Error("Medicine not found");

        const data = await response.json();

        document.getElementById('brand-name').innerText = data.brandName || 'N/A';
        document.getElementById('dosage-form').innerText = data.dosageForm || 'N/A';
        document.getElementById('generic-name').innerText = `Generic: ${data.genericName || 'N/A'}`;
        document.getElementById('manufacturer-name').innerText = `Manufactured by: ${data.manufacturerName || 'N/A'}`;
        document.getElementById('strength').innerText = data.strength || '--';
        document.getElementById('indication').innerText = data.indication || "No information available.";
        document.getElementById('dosage-desc').innerText = data.dosageDescription || "Consult a doctor for dosage.";
        document.getElementById('storage-condition').innerText = data.storageCondition || "Keep in a cool, dry place.";

        document.getElementById('pharmacology').innerText = data.pharmacology || "No pharmacological data available.";
        document.getElementById('contraindications').innerText = data.contraindications || "Consult a physician for details.";
        document.getElementById('pregnancy-lactation').innerText = data.pregnancyAndLactation || "No specific warning found.";

        document.getElementById('storage-condition').innerText = data.storageConditions || "Keep in a cool, dry place.";


        const sideEffectArea = document.getElementById('side-effects-list');
        sideEffectArea.innerHTML = '';
        if(data.sideEffects) {
            const effects = data.sideEffects.split(/[.,]/);
            effects.forEach(effect => {
                if(effect.trim().length > 0) {
                    sideEffectArea.innerHTML += `<span class="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">${effect.trim()}</span>`;
                }
            });
        } else {
            sideEffectArea.innerHTML = '<span class="text-gray-400 text-xs">No side effects listed.</span>';
        }
        mainContent.classList.remove('opacity-0');
        mainContent.classList.add('opacity-100');

    } catch (error) {
        console.error("Failed to load medicine details:", error);
        alert("Could not load medicine details. Please try again.");
    }
});