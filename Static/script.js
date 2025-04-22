// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/static/service-worker.js')
    .then(reg => {
      console.log("Service Worker registered:", reg.scope);
    })
    .catch(err => {
      console.error("Service Worker registration failed:", err);
    });
}


const socket = io.connect('http://localhost:5000');  // Adjust if needed
let allVoices = [];
let userMarker;
let map;

// Initialize on load
window.onload = function () {
  loadVoices();  // Wait until voices are fully loaded
  updateGuide();
  updateKit();
  renderCards();
  startLiveLocationTracking();
  
  
  
  generateVoiceAlert(".........WELCOME TO THE Disaster Management System.......")
};

// Load speech synthesis voices
function loadVoices() {
  return new Promise(resolve => {
    window.speechSynthesis.onvoiceschanged = () => {
      allVoices = window.speechSynthesis.getVoices();
      resolve(allVoices);
    };
  });
}


// Speak a voice alert
function generateVoiceAlert(message) {
  const msg = new SpeechSynthesisUtterance(message);
  msg.voice = allVoices[0];
  msg.rate = 1;
  msg.volume = 1;
  window.speechSynthesis.speak(msg);
}




let nearbyMarkers = []; // To manage & remove old markers if needed

function fetchNearbyLocations(lat, lon, type) {
  return fetch(`/api/nearby-locations?lat=${lat}&lon=${lon}&type=${type}`)
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return res.json();
    })
    .then(locations => {
      if (locations.length === 0) {
        alert(`No nearby ${type}s found.`);
      } else {
        displayLocationsOnMap(locations, type);
      }
    })
    .catch(err => {
      console.error(`Error fetching ${type} locations:`, err);
      alert("Failed to fetch nearby locations.");
    });
}

function displayLocationsOnMap(locations, type) {
  console.log("Displaying locations:", locations);

  // Optional: Remove old markers to avoid clutter
  nearbyMarkers.forEach(marker => map.removeLayer(marker));
  nearbyMarkers = [];

  const iconUrl = type === "hospital"
    ? "https://cdn-icons-png.flaticon.com/512/2965/2965567.png"
    : "https://cdn-icons-png.flaticon.com/512/2276/2276931.png";

  const icon = L.icon({
    iconUrl,
    iconSize: [28, 28]
  });

  locations.forEach(loc => {
    const marker = L.marker([loc.lat, loc.lon], { icon })
      .addTo(map)
      .bindPopup(`<strong>${loc.name || type}</strong><br>${loc.address || "No address available"}`);

    nearbyMarkers.push(marker);
  });
}

//Headline
async function fetchDisasters() {
  try {
    const res = await fetch("http://localhost:5000/api/disasters");
    const data = await res.json();

    const ticker = document.getElementById("disaster-ticker");
    ticker.innerHTML = ""; // Clear old items

    data.disasters.forEach((disaster) => {
      const span = document.createElement("span");
      span.textContent = disaster + " | ";
      ticker.appendChild(span);
    });
  } catch (error) {
    console.error("Error fetching disaster updates:", error);
    const ticker = document.getElementById("disaster-ticker");
    ticker.innerHTML = "⚠ Unable to fetch disaster updates |";
  }
}

// Fetch every 60 seconds
fetchDisasters();
setInterval(fetchDisasters, 60000);
//Alert 
//function showPopup(message) {
 // const popup = document.getElementById('disasterNotify');
  //const text = document.querySelector('.notify-text');
  //const sound = document.getElementById('alertSound');

 // text.innerText = 🚨 ${message};
 // popup.classList.remove('hidden');

  // Play sound
 // sound.currentTime = 0;
  //sound.play();

  // Auto-close after 10 seconds
 // setTimeout(() => {
   // closePopup();
  //}, 10000);
//}

//function closePopup() {
  //const popup = document.getElementById('disasterNotify');
 // popup.classList.add('hidden');
//}

// Simulated logic – Replace with real API + geolocation later
function stopVoiceAlert() {
  if (alertInterval){
    clearInterval(alertInterval);
    alertInterval = null;
  }
}


// Show popup alert on UI
function showPopup(message) {
  const existing = document.querySelector('.popup-alert');
  if (existing) existing.remove();

  const popup = document.createElement('div');
  popup.classList.add('popup-alert');
  popup.innerHTML = `
    <strong>🚨 Disaster Alert</strong><br>${message}
    <span class="popup-close">&times;</span>
  `;
  document.body.appendChild(popup);

  // Close button logic
  popup.querySelector('.popup-close').onclick = () => {
    popup.remove();
    stopVoiceAlert();
  };

  // Auto-remove after 10s
  setTimeout(() => {
    popup.remove();
    stopVoiceAlert();
  }, 100000);
}



// Handle WebSocket disaster alerts
let alertInterval; // Global or higher scope

socket.on('disaster_alert', (msg) => {
  const data = JSON.parse(msg.data);
  console.log("Received:", data);

  const alertMessage = `${data.disaster_type} in ${data.location}. Severity: ${data.severity}`;
  showPopup(alertMessage);

  //Start repeating voice alert every 3 seconds
  alertInterval = setInterval(() => {
    generateVoiceAlert(alertMessage);
  }, 3000);

  // Optional: show extra details somewhere after a delay
  setTimeout(() => {
    const alertsDiv = document.getElementById('alerts');
    const alertElement = document.createElement('div');
    alertElement.classList.add('alert');
    alertElement.innerHTML = `
      <strong>${data.disaster_type}</strong><br>
      Location: ${data.location}<br>
      Severity: ${data.severity}<br>
      Timestamp: ${data.timestamp}
    `;
    alertsDiv.appendChild(alertElement);
  }, 1000);

  // Show nearby shelters/hospitals
  const tryShowNearby = setInterval(() => {
    if (userMarker && map) {
      clearInterval(tryShowNearby);
      const { lat, lng } = userMarker.getLatLng();
      fetchNearbyLocations(lat, lng, "shelter");
      fetchNearbyLocations(lat, lng, "hospital");
    }
  }, 100);
});

function closePopup() {
  const popup = document.getElementById('disasterNotify');
  popup.classList.add('hidden');

  // Stop voice alert loop
  //if (alertInterval) {
    //clearInterval(alertInterval);
    //alertInterval = null;
  //}
}

  


// Track live user location on the map
function startLiveLocationTracking() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported.");
    return;
  }

  navigator.geolocation.watchPosition(
    position => {
      const { latitude, longitude } = position.coords;
      map.setView([latitude, longitude], 13);

      if (userMarker) {
        userMarker.setLatLng([latitude, longitude]);
      } else {
        userMarker = L.marker([latitude, longitude], {
          icon: L.icon({
            iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149060.png',
            iconSize: [30, 30]
          })
        }).addTo(map)
          .bindPopup("📍 You are here")
          .openPopup();
      }
    },
    error => {
      console.error("Location error:", error);
      alert("Location error occurred. Check permissions.");
    },
    {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 10000
    }
  );
}

// Initialize Leaflet map
map = L.map("smartMap").setView([20.5937, 78.9629], 5); // India center
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

// Navbar toggle
document.getElementById('menu-toggle').addEventListener('click', () => {
  document.getElementById('nav-links').classList.toggle('active');
});

// Chatbot
const chatBody = document.getElementById('chatBody');
const userInput = document.getElementById('userInput');
const chatbot = document.getElementById('chatbot');

function toggleChat() {
  chatbot.classList.toggle('hidden');
}

function sendMessage() {
  const msg = userInput.value.trim();
  if (!msg) return;
  appendMessage(msg, 'user-msg');
  userInput.value = '';
  setTimeout(() => {
    const botReply = getBotReply(msg);
    appendMessage(botReply, 'bot-msg');
    chatBody.scrollTop = chatBody.scrollHeight;
  }, 600);
}

function appendMessage(text, className) {
  const div = document.createElement('div');
  div.className = `chatbot-msg ${className}`;
  div.innerText = text;
  chatBody.appendChild(div);
}

function getBotReply(userMsg) {
  userMsg = userMsg.toLowerCase();
  if (userMsg.includes("hello") || userMsg.includes("hi")) return "Hello there!";
  if (userMsg.includes("help")) return "Sure! What do you need help with?";
  if (userMsg.includes("your name")) return "I'm your friendly chatbot 🤖";
  return "Sorry, I didn't understand that.";
}

userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// Guide & Kit Logic
function updateGuide() {
  const type = document.getElementById("guide-type").value;
  const guides = {
    flood: ["Don't Panic", "Know evacuation routes", "Pack essential bag", "Listen to weather updates", "Heed official warnings"],
    earthquake: ["Drop, Cover, and Hold", "Avoid windows", "Secure furniture", "Have a meeting spot", "Emergency contacts ready"],
    fire: ["Stay low", "Know exits", "Stop, Drop, Roll", "Turn off gas/electricity", "Call 101"],
    cyclone: ["Secure items", "Stay away from windows", "Keep flashlight", "Stock food/water", "Evacuate if advised"],
    landslide: ["Avoid steep areas", "Watch for cracks", "Stay alert in rain", "Don’t cross flowing water", "Move to high ground"]
  };
  const list = document.getElementById("guide-items");
  list.innerHTML = "";
  guides[type].forEach(item => {
    const li = document.createElement("li");
    li.textContent = "• " + item;
    list.appendChild(li);
  });
}

function updateKit() {
  const type = document.getElementById("kit-type").value;
  const kits = {
    flood: ["💧 Clean water", "🧥 Waterproof clothes", "📻 Radio", "🗺️ Map"],
    earthquake: ["🔦 Flashlight", "🩹 First Aid", "🥾 Shoes", "📁 ID/docs"],
    fire: ["😷 Mask", "🧯 Extinguisher", "🧤 Gloves", "🚪 Door wedge"],
    cyclone: ["🌂 Tarp", "🧳 Go-bag", "🔋 Batteries", "📱 Contacts"],
    landslide: ["🚨 Whistle", "🛑 Vest", "🎒 Evac bag", "📞 Phone + charger"]
  };
  const list = document.getElementById("kit-items");
  list.innerHTML = "";
  kits[type].forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}

// Disaster Resource Cards
const disasterSelect = document.getElementById("disasterSelect");
const regionSelect = document.getElementById("regionSelect");
const cardsContainer = document.getElementById("cardsContainer");

const data = {
  floods: {
    north: [
      { title: "Nearby Shelter", desc: "Flood relief camps with essentials.", btn: "View Shelter" },
      { title: "Medical Center", desc: "Emergency flood-related aid.", btn: "View Hospitals" }
    ],
    south: [
      { title: "Nearby Shelter", desc: "Lowland safe zones.", btn: "Check Locations" },
      { title: "Medical Center", desc: "Waterborne disease clinics.", btn: "View Clinics" }
    ]
  }
};

function renderCards() {
  const disaster = disasterSelect.value;
  const region = regionSelect.value;
  const selected = data[disaster]?.[region] || [];
  cardsContainer.innerHTML = selected.map(card => `
    <div class="card">
      <h3>${card.title}</h3>
      <p>${card.desc}</p>
      <button>${card.btn}</button>
    </div>
  `).join("");
}

disasterSelect.addEventListener("change", renderCards);
regionSelect.addEventListener("change", renderCards);

// Load speech voices on init
loadVoices().then(() => console.log("Voices loaded"));
document.getElementById('report-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const formData = new FormData();
  formData.append("type", document.querySelector('select').value);
  formData.append("location", document.querySelector('input[placeholder*="enter manually"]').value);
  formData.append("description", document.querySelector('textarea').value);
  formData.append("name", document.querySelector('input[placeholder="Your Name"]').value);
  formData.append("contact", document.querySelector('input[placeholder="Contact"]').value);

  const fileInput = document.querySelector('input[type="file"]');
  if (fileInput.files.length > 0) {
    formData.append("media", fileInput.files[0]);
  }

  fetch('http://localhost:5000/report', {
    method: 'POST',
    body: formData
  })
  .then(res => res.json())
  .then(response => {
    alert(response.message);
    document.getElementById('report-form').reset();
  })
  .catch(err => {
    alert("Submission failed");
    console.error(err);
  });
});
