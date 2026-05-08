const BASE_URL = "http://localhost:8080/api/v1/auth";

window.togglePassword = function(inputId, iconId) {
    const passwordField = document.getElementById(inputId);
    const eyeIcon = document.getElementById(iconId);

    if (passwordField && eyeIcon) {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);


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

                    showStatusMessage("লগইন সফল হয়েছে!", "success");

                    setTimeout(() => {
                        window.location.href = "index.html";
                    }, 1500);
                } else {
                    showStatusMessage(data.message || 'Login failed! Please check credentials.',"error");
                }
            } catch (error) {
                showStatusMessage('Server connection failed!',"error");
            } finally {
                loginBtn.innerText = "Sign In";
                loginBtn.disabled = false;
            }
        });
    }



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
                    showStatusMessage('Registration Successful! Please login.',"success");
                    window.location.href = 'login.html';
                } else {
                    const errorText = await response.text();
                    showStatusMessage(errorText || 'Signup failed! Check your data.',"error");
                }
            } catch (error) {
                showStatusMessage('Server error occurred.',"error");
            } finally {
                signupBtn.innerText = "Register Now";
                signupBtn.disabled = false;
            }
        });
    }

    updateUI();
});





function updateUI() {
    const userName = localStorage.getItem('userName');
    const authSection = document.querySelector('.flex.items-center.space-x-4.border-r');
    const profileBtn = document.getElementById('profileBtn');
    const userInitial = document.getElementById('userInitial');

    if (userName) {
        if (authSection) {
            authSection.innerHTML = `
                <div class="flex items-center space-x-3">
                    <span class="text-blue-700 font-bold hidden md:block">👋 ${userName}</span>
                    <button onclick="handleLogout()" class="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded-full border border-red-100 transition">
                        Logout
                    </button>
                </div>
            `;
        }
        if (profileBtn) {
            profileBtn.classList.remove('hidden');
            userInitial.innerText = userName.charAt(0).toUpperCase();
        }
    }
}



window.handleLogout = function() {
    const confirmLogout = document.createElement('div');
    confirmLogout.className = "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4";
    confirmLogout.innerHTML = `
        <div class="bg-white p-6 rounded-2xl max-w-sm w-full shadow-2xl text-center">
            <div class="text-red-500 text-4xl mb-4">👋</div>
            <h3 class="text-xl font-bold text-gray-800 mb-2">লগআউট করতে চান?</h3>
            <p class="text-gray-500 mb-6">আপনার সেশনটি শেষ হয়ে যাবে।</p>
            <div class="flex space-x-3">
                <button onclick="this.parentElement.parentElement.parentElement.remove()" class="flex-1 px-4 py-2 border rounded-xl hover:bg-gray-50 transition">ফিরে যান</button>
                <button id="confirmLogoutBtn" class="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition">হ্যাঁ, লগআউট</button>
            </div>
        </div>
    `;
    document.body.appendChild(confirmLogout);

    document.getElementById('confirmLogoutBtn').onclick = () => {
        localStorage.clear();
        window.location.href = "index.html";
    };
};


function showStatusMessage(message, type) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `fixed top-10 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full shadow-lg text-white font-medium z-50 transition-all transform animate-bounce ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`;
    msgDiv.innerText = message;
    document.body.appendChild(msgDiv);

    setTimeout(() => { msgDiv.remove(); }, 3000);
}