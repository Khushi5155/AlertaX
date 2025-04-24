from flask import Flask, request, render_template, jsonify
from flask_socketio import SocketIO
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
from werkzeug.utils import secure_filename
import os
import requests


load_dotenv()

app = Flask(__name__)

socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/')
def index():
    return render_template('index.html')



@app.route('/api/disasters')
def get_disasters():
    today = datetime.now(timezone.utc)
    seven_days_ago = today - timedelta(days=7)

    url = "https://api.reliefweb.int/v1/disasters?appname=live-disaster-app&profile=list&limit=20&sort[]=date.created:desc"

    try:
        response = requests.get(url)
        data = response.json()

        disasters_raw = data.get('data', [])

        recent_disasters = []
        for disaster in disasters_raw:
            fields = disaster.get('fields', {})
            name = fields.get('name')
            date_str = fields.get('date', {}).get('created') or fields.get('date', {}).get('start')
            
            if not name or not date_str:
                continue
            
            try:
                event_date = datetime.fromisoformat(date_str.split("T")[0]).replace(tzinfo=timezone.utc)
            except ValueError:
                continue

            if seven_days_ago <= event_date <= today:
                recent_disasters.append(f"{name} - {event_date.date()}")

        # Fallback: use latest 10 if none in last 7 days
        if not recent_disasters:
            for disaster in disasters_raw[:10]:
                fields = disaster.get('fields', {})
                name = fields.get('name')
                date_str = fields.get('date', {}).get('created') or fields.get('date', {}).get('start')
                if name and date_str:
                    date_only = date_str.split("T")[0]
                    recent_disasters.append(f"{name} - {date_only}")

        return jsonify({"disasters": recent_disasters})

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Failed to fetch disaster updates"}), 500



@app.route("/receive", methods=["POST"])
def receive_data():
    try:
        data = request.json.get("data")
        print(f"[ALERT RECEIVED]: {data}")
        socketio.emit("disaster_alert", {"data": data})
        return jsonify({"status": "ok"}), 200
    except Exception as e:
        print("[ERROR]:", e)
        return jsonify({"status": "error", "message": str(e)}), 400

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# MongoDB setup
client = MongoClient(os.getenv("MONGO_URI"))
db = client["alertaX"]
reports = db["reports"]



@app.route('/api/nearby-locations')
def get_nearby_locations():
    lat = request.args.get('lat')
    lng = request.args.get('lng')
    loc_type = request.args.get('type')  # 'shelter' or 'hospital'

    if not lat or not lng or not loc_type:
        return jsonify([]), 400

    # Example using OpenStreetMap Nominatim or Overpass API
    query = f"""
    [out:json];
    (
      node["amenity"="{loc_type}"](around:5000,{lat},{lng});
      way["amenity"="{loc_type}"](around:5000,{lat},{lng});
      relation["amenity"="{loc_type}"](around:5000,{lat},{lng});
    );
    out center;
    """

    response = requests.post(
        "https://overpass-api.de/api/interpreter",
        data={"data": query},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )

    if response.status_code != 200:
        return jsonify([]), 500

    data = response.json()
    locations = []

    for element in data["elements"]:
        if "lat" in element and "lon" in element:
            locations.append({
                "lat": element["lat"],
                "lon": element["lon"],
                "name": element.get("tags", {}).get("name", loc_type.title()),
                "address": element.get("tags", {}).get("addr:full", "Unknown address")
            })
        elif "center" in element:
            locations.append({
                "lat": element["center"]["lat"],
                "lon": element["center"]["lon"],
                "name": element.get("tags", {}).get("name", loc_type.title()),
                "address": element.get("tags", {}).get("addr:full", "Unknown address")
            })

    return jsonify(locations)




@app.route('/report', methods=['POST'])
def report_disaster():
    data = {
        "type": request.form.get("type"),
        "location": request.form.get("location"),
        "description": request.form.get("description"),
        "name": request.form.get("name"),
        "contact": request.form.get("contact"),
    }

    # Handle media upload
    file = request.files.get("media")
    if file:
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        data["media_path"] = file_path

    reports.insert_one(data)
    return jsonify({"message": "Disaster reported successfully"}), 200



if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000)
