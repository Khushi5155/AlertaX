import requests
from fluvio import Fluvio, Offset

# URL of your Flask backend
BACKEND_URL = "http://localhost:5000/receive"

def send_to_backend(data):
    try:
        response = requests.post(BACKEND_URL, json={"data": data})
        print("✅ Sent to backend:", response.text)
    except Exception as e:
        print("❌ Error sending to backend:", e)

def main():
    print("listening to fluvio topic:")
    fluvio = Fluvio.connect()
    consumer = fluvio.partition_consumer("disaster",0)

    print("🔁 Listening to Fluvio topic: disaster")
    for record in consumer.stream(Offset.beginning()):
        data = record.value_string()
        print("📥 Received from Fluvio:", data)
        send_to_backend(data)

if __name__ == "__main__":
    main()