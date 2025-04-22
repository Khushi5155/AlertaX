from flask import Flask, request, render_template, jsonify
from flask_socketio import SocketIO
from pymongo import MongoClient
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
import os

load_dotenv()

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")
client = MongoClient("mongodb://103.101.118.19:27017/")

@app.route('/')
def index():
    return render_template('index.html')


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