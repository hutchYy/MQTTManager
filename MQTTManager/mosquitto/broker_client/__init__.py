from queue import Queue
import paho.mqtt.client as mqtt
from threading import Thread, Event
import datetime
import calendar
import logging
import json
import base64
import time


class BrokerClient(Thread):
    def __init__(self, q: Queue) -> None:
        Thread.__init__(self)
        self.qeue = q
        self._stop_event = Event()
        self.log = logging.getLogger(f"{__name__}")
        self.terminate = False
        self.client = mqtt.Client()

    def run(self) -> None:
        self._stop_event = Event()
        self.set_callbacks()
        try:
            self.client.connect("localhost", 1883, 60)
        except Exception as e:
            print(e)
            return
        self.loop()

    def set_callbacks(self):
        # The callback for when the client receives a CONNACK response from the server.
        def on_connect(client, userdata, flags, rc):
            self.log.debug("Connected with result code " + str(rc))

            # Subscribing in on_connect() means that if we lose the connection and
            # reconnect then subscriptions will be renewed.
            client.subscribe("$SYS/#")

        # The callback for when a PUBLISH message is received from the server.
        def on_message(client, userdata, msg):
            self.log.debug(f"{msg.topic} {str(msg.payload)}")
            # {timestamp:"",topic:"",payload:""}
            """
            msg contains:
            topic : String/bytes. topic that the message was published on.
            payload : String/bytes the message payload.
            qos : Integer. The message Quality of Service 0, 1 or 2.
            retain : Boolean. If true, the message is a retained message and not fresh.
            mid : Integer. The message id.
            properties: Properties class. In MQTT v5.0, the properties associated with the message.
            """
            t = (
                datetime.datetime.utcnow()
                .replace(tzinfo=datetime.timezone.utc)
                .strftime("%Y-%m-%dT%H:%M:%SZ")
            )
            base64_bytes = base64.b64encode(msg.payload)
            base64_string = base64_bytes.decode("ascii")

            json_payload = json.dumps(
                {
                    "timestamp": t,
                    "topic": msg.topic,
                    "payload": base64_string,
                    "qos": msg.qos,
                    "retain": msg.retain,
                    "mid": msg.mid,
                }
            )
            self.qeue.put(json_payload)

        self.client.on_connect = on_connect
        self.client.on_message = on_message

    def reconnect(self):
        while not self.client.is_connected():
            self.log.info("Reconnecting to the broker")
            try:
                self.client.reconnect()
            except Exception as e:
                self.log.error(f"{e}")
            time.sleep(10)
        self.log.info("Reconnected to the broker")

    def loop(self):
        self.client.loop_start()
        while not self._stop_event.is_set():
            if not self.client.is_connected():
                self.log.info("Could not connect to the broker!")
                self.reconnect()

        self.client.loop_stop()
        self.log.info("BrokerClient as been killed!")

    def stop(self):
        self.log.info("Killing BrokerClient!")
        self._stop_event.set()
