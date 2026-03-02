import cv2
from ultralytics import YOLO
from mqtt import MQTTClient
import time

MQTT_BROKER = "broker.emqx.io"
MQTT_PORT = 1883
MQTT_TOPIC = "surveillance/detections"
CONFIDENCE_THRESHOLD = 0.5
CAMERA_SOURCE = "http://10.108.62.151/stream"

model = YOLO('best.pt')
mqtt_client = MQTTClient(broker=MQTT_BROKER, port=MQTT_PORT, topic=MQTT_TOPIC)
mqtt_client.connect()

cap = cv2.VideoCapture(CAMERA_SOURCE)

if not cap.isOpened():
    print("Failed to open camera stream. Check the URL.")
    mqtt_client.disconnect()
    exit()

print("Surveillance camera started. Press 'q' to quit.")

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break
    
    results = model(frame, conf=CONFIDENCE_THRESHOLD)
    
    detections = []
    for result in results:
        for box in result.boxes:
            detection = {
                "class": result.names[int(box.cls)],
                "confidence": float(box.conf),
                "bbox": box.xyxy[0].tolist()  
            }
            detections.append(detection)
    
    if detections:
        mqtt_client.publish_detection(detections)
        print(f"Detected {len(detections)} objects: {[d['class'] for d in detections]}")
    
    annotated_frame = results[0].plot()
    
    cv2.imshow('Surveillance Camera', annotated_frame)
    
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
mqtt_client.disconnect()
print("Surveillance camera stopped.")