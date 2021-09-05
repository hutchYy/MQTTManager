from queue import Queue
import logging
from flask import Flask


logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.DEBUG)
log = logging.getLogger(f"{__name__}")
webapp = Flask(__name__, template_folder="./gui/templates",static_folder="./gui/templates/static")

def startMosquittoDaemon() -> None:
    from MQTTManager.service_managment import Services
    MosquittoService = Services("mosquitto")
    err,_=MosquittoService.start()

def startMosquittoClient():
    mqtt_queue = Queue()
    from MQTTManager.mosquitto.broker_client import BrokerClient
    broker_client = BrokerClient(mqtt_queue)
    broker_client.start()
    return mqtt_queue,broker_client

def startWebApp(mqtt_queue:Queue):
    import MQTTManager.gui
    webapp.run()

def run():
    startMosquittoDaemon()
    mqtt_queue, broker_client  = startMosquittoClient()
    startWebApp(mqtt_queue)
    broker_client.join()

    
    