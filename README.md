![github-submission-banner](/banner_readme.png)

# 🚀 AlertaX - Disaster Alert System

> Stay Alert, Stay Safe with AlertaX

---

## 📌 Problem Statement

**Problem Statement 3 – Real-Time Data Experiences with Fluvio**

---

## 🎯 Objective

> Stream data from environmental sensors (or simulate them) to trigger alerts for floods, wildfires, or earthquakes.
> 
> **Use Case & Value:**
> 
> The system streams or simulates real-time sensor data to detect floods, wildfires, or earthquakes and trigger alerts. It enables early warnings, helping authorities take timely action to save lives and reduce damage.

---

## 🧠 Team & Approach

### Team Name:

`Code trio`

### Team Members:

- Khushi Kumari (([Khushi5155 (Khushi Kumari) · GitHub](https://github.com/Khushi5155))/ [LinkedIn](https://www.linkedin.com/in/khushi-kumari-329370348/) / Team Leader)

- Pratyush Jha (([pratyushjha06 (Pratyush Jha ) · GitHub](https://github.com/pratyush</u>jha06)) / [LinkedIn](https://www.linkedin.com/in/pratyushjha06/) )  

- Sunidhi Singh (([Sunidhi037 · GitHub](https://github.com/Sunidhi037)) / [LinkedIn ](https://www.linkedin.com/in/sunidhi-singh-08021b344/))

### Our Approach:

- **Why We Chose This Problem:**
  
  Natural disasters cause massive loss of life and property, especially in areas with poor early warning systems. I chose this problem to build a solution that can make a real-world impact by enabling timely alerts using sensor data. It combines tech with purpose—using data to save lives. 

- **Key Challenges Addressed:**
  
  - **Real-time data handling:** Processing continuous sensor data streams efficiently.
  
  - **Accurate alert triggering:** Setting reliable thresholds to minimize false alarms.
  
  - **Scalability:** Designing a system that can monitor multiple locations simultaneously.

---

## 🛠️ Tech Stack

### Core Technologies Used:

- Frontend: HTML, CSS, JavaScript 
- Backend: JavaScript, Python(flask)
- Database: MongoDB (for storing data)
- APIs: ReliefWeb Disasters API, ReliefWeb Disasters API, Web Speech API (SpeechSynthesis ), Socket.io, The WebSocket API (WebSockets)
- Hosting: Render

### Sponsor Technologies Used (if any):

- [ ] **Groq:** _How you used Groq_  
- [ ] **Monad:** _Your blockchain implementation_  
- [x] **Fluvio:** _Real-time data handling_  
- [ ] **Base:** _AgentKit / OnchainKit / Smart Wallet usage_  
- [ ] **Screenpipe:** _Screen-based analytics or workflows_  
- [ ] **Stellar:** _Payments, identity, or token usage_
  *(Mark with ✅ if completed)*

---

## ✨ Key Features

**Most Important Features:**

- **Disaster Reporting:** Users can access their live location on map.

- **Interactive Map:** Shows nearby reported disasters and available shelters.

- **Safety Information:** Provides users with essential safety tips for each type of disaster.

- **Real-time Alerts:** Triggers automatic alerts based on sensor/simulated data.

---

## 📽️ Demo & Deliverables

- **Demo Video Link:** [https://youtu.be/ikwBY7nrzO8]   

---

## ✅ Tasks & Bonus Checklist

- [x] **All members of the team completed the mandatory task - Followed at least 2 of our social channels and filled the form** (Details in Participant Manual)  
- [x] **All members of the team completed Bonus Task 1 - Sharing of Badges and filled the form (2 points)**  (Details in Participant Manual)
- [x] **All members of the team completed Bonus Task 2 - Signing up for Sprint.dev and filled the form (3 points)**  (Details in Participant Manual)

*(Mark with ✅ if completed)

---

---

## 🧪 How to Run the Project

### Requirements:

- Python 3.10
- Flask
- Flask-SocketIO
- Fluvio CLI (for real-time alert data streaming)
- Browser with Geolocation support
- Internet access (for map tiles & APIs)

### Local Setup:

```bash
# Clone the repo
git clone https://github.com/Khushi5155/AlertaX.git

# Install dependencies
cd AlertaX
pip install -r requirements.txt

# Install Fluvio CLI (refer https://fluvio.io/docs/)
# Start Fluvio cluster and create a topic
fluvio topic create disaster-alerts

#Disaster producer
python alert_producer.py

# Start the Flask app
python3  app.py

```

## 🧬 Future Scope

List improvements, extensions, or follow-up features:

- 📈 More integrations  
  
  - - **Social Media Feeds:** Integrate real-time disaster alerts from X (Twitter), Facebook, and Instagram.
    
    - **Government APIs:** Plug into official APIs (e.g., NDMA, IMD, FEMA) for verified disaster data.
    
    - **Communication Platforms:** Connect with platforms like WhatsApp, Telegram, or SMS gateways for alert broadcasting.
    
    - **Mapping Tools:** Integrate Google Maps or Mapbox for better geospatial visualizations of disaster reports.

- 🛡️ Security enhancements  
  
  - - **User Authentication:** Add role-based logins for admin, reporter, and general users using JWT or OAuth.
    
    - **Spam Protection:** CAPTCHA/recaptcha on report forms to avoid fake entries.
    
    - **Rate Limiting & API Security:** Prevent abuse by limiting requests, using secure headers, and validation checks.
    
    - **Encryption:** Encrypt sensitive data (e.g., user location or contact) during both transmission and storage.

- 🌐 Localization / broader accessibility  
  
  - - **Multi-language Support:** Add options for regional languages (Hindi, Bengali, Tamil, etc.) using i18n libraries.
    
    - **Screen Reader Compatibility:** Make your UI accessible with ARIA labels and proper HTML semantics.
    
    - **Voice Assistance:** Implement voice input or text-to-speech features for people with disabilities.
    
    - **Offline Support (PWA):** Enable offline disaster reporting in poor network areas using Progressive Web App features.

---

## 📎 Resources / Credits

- [ReliefWeb Disasters API](https://apidoc.reliefweb.int/) 
- [Leaflet map](https://leafletjs.com/)
- [Web Speech API - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Socket.io](https://socket.io/)
- [The WebSocket API (WebSockets) - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [Font Awesome](https://fontawesome.com/)

---

## 🏁 Final Words

🏁 Final Words

In the middle of the night (and a lot of chai), we thought — what if we had a single platform that could instantly report, track, and alert people about disasters in real-time?  
That's how *alertaX* was born — a disaster awareness and reporting tool designed to save lives with speed and clarity.

⚔ The Challenges:

- Balancing *real-time data handling* without complex APIs was tricky — finding that “easy but powerful” solution took time.

- Designing something *accessible* to everyone, from urban dwellers to rural communities, wasn’t as easy as it sounds.

📚 The Learnings:

- Importance of *modular code structure*.

- Learned about *secure data handling* and why even small projects need security planning.

- Got hands-on with *progressive enhancement*, making sure the site works well even in low bandwidth areas.

😂 Fun Moments:

- Arguing over button colors at 3AM — because obviously, the Save Lives button can’t be plain blue 🙄

  ---
  

🙌 Shout-outs:

- Huge thanks to my teammate(s), late-night playlist, and VS Code.

- And a special mention to *ctrl+Z*

---
