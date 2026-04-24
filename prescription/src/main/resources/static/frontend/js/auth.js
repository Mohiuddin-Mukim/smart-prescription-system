const BASE_URL = "http://localhost:8080/api/v1/auth";

// --- ১. পাসওয়ার্ড দেখা বা লুকানোর লজিক (Global Toggle) ---
window.togglePassword = function(inputId, iconId) {
    const passwordField = document.getElementById(inputId);
    const eyeIcon = document.getElementById(iconId);

    if (passwordField && eyeIcon) {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);

        // কালার টগল করা
        if (type === 'text') {
            eyeIcon.classList.add('text-blue-600');
            eyeIcon.classList.remove('text-gray-400');
        } else {
            eyeIcon.classList.remove('text-blue-600');
            eyeIcon.classList.add('text-gray-400');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {

    // --- ২. লগইন সাবমিট লজিক ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('loginPassword').value;
            const loginBtn = document.getElementById('loginBtn');

            loginBtn.innerText = "Processing...";
            loginBtn.disabled = true;

            try {
                const response = await fetch(`${BASE_URL}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('accessToken', data.accessToken);
                    localStorage.setItem('refreshToken', data.refreshToken);
                    localStorage.setItem('userName', data.fullName);
                    localStorage.setItem('userId', data.userId);

                    // এখানে আপনার রোল হ্যান্ডলিং লজিক (যদি ব্যাকএন্ড রোল পাঠায়)
                    // উদাহরণের জন্য: window.location.href = "index.html";
                    alert("লগইন সফল!");
                    window.location.href = "index.html";
                } else {
                    alert(data.message || 'Login failed! Please check credentials.');
                }
            } catch (error) {
                alert('Server connection failed!');
            } finally {
                loginBtn.innerText = "Sign In";
                loginBtn.disabled = false;
            }
        });
    }

    // --- ৩. সাইনআপ সাবমিট লজিক ---
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const signupBtn = signupForm.querySelector('button[type="submit"]');
            const formData = {
                fullName: document.getElementById('fullName').value,
                phoneNumber: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };

            signupBtn.innerText = "Creating Account...";
            signupBtn.disabled = true;

            try {
                const response = await fetch(`${BASE_URL}/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });

                if (response.ok) {
                    alert('Registration Successful! Please login.');
                    window.location.href = 'login.html';
                } else {
                    const errorText = await response.text();
                    alert(errorText || 'Signup failed! Check your data.');
                }
            } catch (error) {
                alert('Server error occurred.');
            } finally {
                signupBtn.innerText = "Register Now";
                signupBtn.disabled = false;
            }
        });
    }

    updateUI();
});

// --- ৪. UI আপডেট লজিক ---
function updateUI() {
    const userName = localStorage.getItem('userName');
    const authSection = document.querySelector('.flex.items-center.space-x-4.border-r');

    if (userName && authSection) {
        authSection.innerHTML = `
            <div class="flex items-center space-x-3">
                <span class="text-blue-700 font-bold">👋 ${userName}</span>
                <button onclick="logout()" class="text-xs bg-gray-100 hover:bg-red-50 text-red-600 px-3 py-1 rounded-full border border-red-100 transition">
                    Logout
                </button>
            </div>
        `;
    }
}

// --- ৫. লগআউট লজিক ---
window.logout = function() {
    if (confirm("আপনি কি লগআউট করতে চান?")) {
        localStorage.clear();
        window.location.href = "index.html";
    }
};