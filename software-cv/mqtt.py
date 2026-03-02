import paho.mqtt.client as mqtt
import json
import time

class MQTTClient:
    def __init__(self, broker="localhost", port=1883, topic="surveillance/detections"):
        self.broker = broker
        self.port = port
        self.topic = topic
        self.client = mqtt.Client()
        self.connected = False
        
    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            print(f"Connected to MQTT Broker at {self.broker}:{self.port}")
            self.connected = True
        else:
            print(f"Failed to connect, return code {rc}")
    
    def connect(self):
        self.client.on_connect = self.on_connect
        try:
            self.client.connect(self.broker, self.port, 60)
            self.client.loop_start()
            time.sleep(1) 
        except Exception as e:
            print(f"Connection error: {e}")
    
    def publish_detection(self, detections):
        if not self.connected:
            return False
        
        message = {
            "timestamp": time.time(),
            "detections": detections,
            "count": len(detections)
        }
        
        self.client.publish(self.topic, json.dumps(message))
        return True
    
    def disconnect(self):
        self.client.loop_stop()
        self.client.disconnect()