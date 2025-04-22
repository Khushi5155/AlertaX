//Navbar
const toggleBtn = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');

toggleBtn.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});



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
    ticker.innerHTML = "⚠️ Unable to fetch disaster updates |";
  }
}

// Fetch every 60 seconds
fetchDisasters();
setInterval(fetchDisasters, 60000);



// Initialize the map
const map = L.map("smartMap").setView([20.5937, 78.9629], 5); // India center

// Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

// Sample disaster-prone areas
const disasterZones = [
  { lat: 28.6139, lon: 77.2090, label: "⚠️ Delhi - High Pollution Alert" },
  { lat: 19.0760, lon: 72.8777, label: "🌊 Mumbai - Flood Risk" },
  { lat: 26.8467, lon: 80.9462, label: "🔥 Lucknow - Forest Fire Nearby" }
];

const shelters = [
  { lat: 28.5355, lon: 77.3910, label: "🏠 Shelter in Noida" },
  { lat: 19.2183, lon: 72.9781, label: "🏠 Shelter in Navi Mumbai" }
];

// Add disaster markers
disasterZones.forEach((zone) => {
  L.marker([zone.lat, zone.lon]).addTo(map).bindPopup(zone.label);
});

// Add shelter circle markers
shelters.forEach((shelter) => {
  L.circleMarker([shelter.lat, shelter.lon], {
    color: "green",
    radius: 8,
    fillOpacity: 0.8
  })
    .addTo(map)
    .bindPopup(shelter.label);
});




//ChatBot
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

  // Simulate AI reply
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

userInput.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') sendMessage();
});



//Emergency Section
function updateGuide() {
  const guideType = document.getElementById("guide-type").value;
  const guideItems = {
    flood: [
      "Don't Panic",
      "Know evacuation routes",
      "Pack essential bag",
      "Listen to weather updates",
      "Heed official warnings"
    ],
    earthquake: [
      "Drop, Cover, and Hold",
      "Avoid windows and heavy objects",
      "Secure furniture",
      "Have a family meeting spot",
      "Keep emergency contacts ready"
    ],
    fire: [
      "Stay low to avoid smoke",
      "Know all exits",
      "Stop, Drop, and Roll if on fire",
      "Turn off electricity/gas",
      "Call 101 immediately"
    ],
    cyclone: [
      "Secure loose items",
      "Stay indoors away from windows",
      "Have a flashlight ready",
      "Stock food and water",
      "Evacuate if advised"
    ],
    landslide: [
      "Avoid steep areas",
      "Watch for cracks or bulges",
      "Stay alert during heavy rain",
      "Do not cross flowing water",
      "Move to high ground"
    ]
  };

  const list = document.getElementById("guide-items");
  list.innerHTML = "";
  guideItems[guideType].forEach(item => {
    const li = document.createElement("li");
    li.textContent = "• " + item;
    list.appendChild(li);
  });
}

function updateKit() {
  const kitType = document.getElementById("kit-type").value;
  const kitItems = {
    flood: [
      "💧 Clean drinking water",
      "🧥 Waterproof clothing",
      "📻 Battery radio",
      "🗺️ Local map"
    ],
    earthquake: [
      "🔦 Flashlight",
      "🩹 First Aid Kit",
      "🥾 Sturdy shoes",
      "📁 ID & documents"
    ],
    fire: [
      "😷 Mask for smoke",
      "🧯 Fire extinguisher",
      "🧤 Gloves",
      "🚪 Door wedge"
    ],
    cyclone: [
      "🌂 Emergency tarp",
      "🧳 Packed go-bag",
      "🔋 Extra batteries",
      "📱 Emergency contacts"
    ],
    landslide: [
      "🚨 Warning whistle",
      "🛑 Reflective vest",
      "🎒 Evacuation bag",
      "📞 Mobile + charger"
    ]
  };

  const itemsList = document.getElementById("kit-items");
  itemsList.innerHTML = "";
  kitItems[kitType].forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    itemsList.appendChild(li);
  });
}

window.onload = function () {
  updateGuide();
  updateKit();
};



//Resources Section
const data = {
  floods: {
    north: [
      { title: "Nearby Shelter", desc: "Flood relief camps with food, water & beds.", btn: "View Shelter" },
      { title: "Medical Center", desc: "Flood-related emergency aid centers.", btn: "View Hospitals" }
    ],
    south: [
      { title: "Nearby Shelter", desc: "Safe shelters in lowland regions.", btn: "Check Locations" },
      { title: "Medical Center", desc: "Medical assistance for waterborne diseases.", btn: "View Clinics" }
    ]
  },
  earthquake: {
    north: [
      { title: "Nearby Shelter", desc: "Temporary shelters in quake-safe zones.", btn: "Locate Shelter" },
      { title: "Medical Center", desc: "Trauma centers for quake injuries.", btn: "Check Hospitals" }
    ],
    south: [
      { title: "Nearby Shelter", desc: "Open spaces & quake shelters.", btn: "Shelter Map" },
      { title: "Medical Center", desc: "Seismic emergency response teams.", btn: "View Support" }
    ]
  },
  fire: {
    north: [
      { title: "Nearby Shelter", desc: "Fire-safe buildings with amenities.", btn: "Find Shelter" },
      { title: "Medical Center", desc: "Burn units and fire trauma care.", btn: "Check Units" }
    ],
    south: [
      { title: "Nearby Shelter", desc: "Designated fire evacuation areas.", btn: "Evacuation Zones" },
      { title: "Medical Center", desc: "Emergency treatment for smoke inhalation.", btn: "Find Aid" }
    ]
  }
};

const disasterSelect = document.getElementById("disasterSelect");
const regionSelect = document.getElementById("regionSelect");
const cardsContainer = document.getElementById("cardsContainer");

function renderCards() {
  const disaster = disasterSelect.value;
  const region = regionSelect.value;
  const selectedData = data[disaster][region] || [];

  cardsContainer.innerHTML = selectedData.map(card => `
      <div class="card">
        <h3>${card.title}</h3>
        <p>${card.desc}</p>
        <button>${card.btn}</button>
      </div>
    `).join("");
}

disasterSelect.addEventListener("change", renderCards);
regionSelect.addEventListener("change", renderCards);

// Initial render
renderCards();



//Report Disaster 
const form = document.querySelector('.disaster-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);

    const response = await fetch('http://localhost:5000/report', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    alert(result.message);
    form.reset();
  });