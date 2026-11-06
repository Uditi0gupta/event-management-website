// Sample Event Data
const events = [
    { id: 1, title: "Tech Innovators Hackathon", date: "2026-11-20", venue: "Campus Auditorium", category: "Technical", image: "https://picsum.photos/400/200?random=1", description: "Join 24 hours of coding, innovation, and fun!" },
    { id: 2, title: "Annual Music & Dance Fest", date: "2026-11-25", venue: "Open Air Theatre", category: "Cultural", image: "https://picsum.photos/400/200?random=2", description: "Experience the vibrant cultural performances of the year." },
    { id: 3, title: "Web Dev & UI/UX Workshop", date: "2026-12-05", venue: "Lab 3, CS Block", category: "Workshop", image: "https://picsum.photos/400/200?random=3", description: "Hands-on session on building modern responsive web apps." }
];

document.addEventListener("DOMContentLoaded", () => {
    displayEvents(events);
    populateDropdown();
    startCountdown(new Date("2026-11-20T09:00:00").getTime());
});

// Render Cards
function displayEvents(data) {
    const grid = document.getElementById("event-grid");
    grid.innerHTML = data.map(e => `
        <div class="card">
            <img src="${e.image}" alt="${e.title}">
            <div class="card-body">
                <h3>${e.title}</h3>
                <p><strong>Date:</strong> ${e.date}</p>
                <p><strong>Venue:</strong> ${e.venue}</p>
                <button class="btn" onclick="openModal(${e.id})">View Details</button>
            </div>
        </div>
    `).join("");
}

// Populate Registration Options
function populateDropdown() {
    const select = document.getElementById("event-select");
    events.forEach(e => {
        const option = document.createElement("option");
        option.value = e.title;
        option.textContent = e.title;
        select.appendChild(option);
    });
}

// Search & Filter
document.getElementById("search-input").addEventListener("input", filterEvents);
document.getElementById("category-filter").addEventListener("change", filterEvents);

function filterEvents() {
    const query = document.getElementById("search-input").value.toLowerCase();
    const category = document.getElementById("category-filter").value;

    const filtered = events.filter(e => {
        const matchesSearch = e.title.toLowerCase().includes(query) || e.venue.toLowerCase().includes(query);
        const matchesCategory = category === "all" || e.category === category;
        return matchesSearch && matchesCategory;
    });

    displayEvents(filtered);
}

// Modal View
const modal = document.getElementById("event-modal");
document.querySelector(".close-btn").onclick = () => modal.style.display = "none";

function openModal(id) {
    const event = events.find(e => e.id === id);
    document.getElementById("modal-details").innerHTML = `
        <h2>${event.title}</h2>
        <p><strong>Category:</strong> ${event.category}</p>
        <p><strong>Date & Venue:</strong> ${event.date} | ${event.venue}</p>
        <p>${event.description}</p>
    `;
    modal.style.display = "flex";
}

// Form Validation & Local Storage
const form = document.getElementById("registration-form");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const name = document.getElementById("full-name");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const selectedEvent = document.getElementById("event-select");
    
    let isValid = true;

    if (!name.value.trim()) { showError(name, "Name is required"); isValid = false; } else clearError(name);
    if (!email.value.includes("@") || !email.value.includes(".")) { showError(email, "Enter a valid email"); isValid = false; } else clearError(email);
    if (!/^\d{10}$/.test(phone.value.trim())) { showError(phone, "Enter a valid 10-digit phone number"); isValid = false; } else clearError(phone);
    if (!selectedEvent.value) { showError(selectedEvent, "Please select an event"); isValid = false; } else clearError(selectedEvent);

    if (isValid) {
        const registrant = { name: name.value, email: email.value, phone: phone.value, event: selectedEvent.value };
        
        // Save to LocalStorage (Bonus Requirement)
        let registrations = JSON.parse(localStorage.getItem("registrations") || "[]");
        registrations.push(registrant);
        localStorage.setItem("registrations", JSON.stringify(registrations));

        const confirmation = document.getElementById("confirmation-message");
        confirmation.textContent = `Thank you, ${name.value}! You have successfully registered for ${selectedEvent.value}.`;
        confirmation.classList.remove("hidden");
        form.reset();
    }
});

function showError(input, message) {
    input.nextElementSibling.textContent = message;
}
function clearError(input) {
    input.nextElementSibling.textContent = "";
}

// Dark/Light Theme Toggle (Bonus Requirement)
const themeBtn = document.getElementById("theme-toggle");
themeBtn.addEventListener("click", () => {
    const currentTheme = document.body.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.body.setAttribute("data-theme", newTheme);
    themeBtn.innerHTML = newTheme === "dark" ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
});

// Countdown Timer (Bonus Requirement)
function startCountdown(targetTime) {
    setInterval(() => {
        const now = new Date().getTime();
        const diff = targetTime - now;

        if (diff > 0) {
            document.getElementById("days").innerText = Math.floor(diff / (1000 * 60 * 60 * 24));
            document.getElementById("hours").innerText = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            document.getElementById("minutes").innerText = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            document.getElementById("seconds").innerText = Math.floor((diff % (1000 * 60)) / 1000);
        }
    }, 1000);
}