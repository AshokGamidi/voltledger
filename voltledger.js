let chart;
let captchaValue;

// CAPTCHA
function generateCaptcha() {
    let num1 = Math.floor(Math.random() * 10);
    let num2 = Math.floor(Math.random() * 10);
    captchaValue = num1 + num2;

    document.getElementById("captchaQuestion").innerText =
        "Solve: " + num1 + " + " + num2 + " = ?";
}

// REGISTER
function register() {
    let email = regEmail.value;
    let password = regPassword.value;

    if (email && password) {
        localStorage.setItem("user", JSON.stringify({ email, password }));
        alert("Registered Successfully!");
        showLogin();
    }
}

// SHOW LOGIN
function showLogin() {
    registerSection.style.display = "none";
    loginSection.style.display = "block";
    generateCaptcha();
}

// LOGIN
function login() {
    let email = loginEmail.value;
    let password = loginPassword.value;
    let userCaptcha = parseInt(captchaAnswer.value);

    let user = JSON.parse(localStorage.getItem("user"));

    if (userCaptcha !== captchaValue) {
        alert("Captcha Incorrect!");
        generateCaptcha();
        return;
    }

    if (user && user.email === email && user.password === password) {
        loginSection.style.display = "none";
        dashboardSection.style.display = "block";
        logoutBtn.style.display = "block";
        loadHistory();
        updateChart();
    } else {
        alert("Invalid Credentials!");
        generateCaptcha();
    }
}

// LOGOUT
function logout() {
    dashboardSection.style.display = "none";
    logoutBtn.style.display = "none";
    loginSection.style.display = "block";
    generateCaptcha();
}

// BILL CALCULATION
function calculateBill() {
    let units = parseFloat(document.getElementById("units").value);
    if (!units) return;

    let rate = 5;
    let energy = units * rate;
    let fixed = 50;
    let gst = (energy + fixed) * 0.18;
    let total = energy + fixed + gst;

    energyCharge.innerText = energy.toFixed(2);
    gst.innerText = gst.toFixed(2);
    totalBill.innerText = total.toFixed(2);

    let history = JSON.parse(localStorage.getItem("transactions")) || [];

    history.push({
        date: new Date().toLocaleDateString(),
        units,
        total: total.toFixed(2)
    });

    localStorage.setItem("transactions", JSON.stringify(history));

    loadHistory();
    updateChart();
}

// LOAD HISTORY
function loadHistory() {
    let history = JSON.parse(localStorage.getItem("transactions")) || [];
    historyTable.innerHTML = "";

    history.forEach((item, index) => {
        historyTable.innerHTML += `
            <tr>
                <td>${item.date}</td>
                <td>${item.units}</td>
                <td>${item.total}</td>
                <td><button onclick="deleteTransaction(${index})">Delete</button></td>
            </tr>
        `;
    });
}

// DELETE
function deleteTransaction(index) {
    let history = JSON.parse(localStorage.getItem("transactions"));
    history.splice(index, 1);
    localStorage.setItem("transactions", JSON.stringify(history));
    loadHistory();
    updateChart();
}

// CHART
function updateChart() {
    let history = JSON.parse(localStorage.getItem("transactions")) || [];
    let labels = history.map(item => item.date);
    let totals = history.map(item => item.total);

    const ctx = document.getElementById("billChart");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Total Bill (₹)",
                data: totals,
                borderWidth: 2,
                tension: 0.3
            }]
        }
    });
}
