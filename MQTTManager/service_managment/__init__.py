import subprocess
import logging
import time


class Services:
    def __init__(self,processName):
        self.log = logging.getLogger(f"{__name__}.{processName}")
        self.processName = processName

    def start(self):
        err = None
        status = None
        try:
            if not self.check_status()[1]:
                self.log.info(f"Starting the {self.processName} process!")
                subprocess.run(["sudo", "service", self.processName,
                                "start"], check=True, capture_output=True)
                time.sleep(5)
                if self.check_status()[1]:
                    status = f"{self.processName} started!"
                else:
                    status = f"{self.processName} failed to start!"
            else:
                status = f"{self.processName} already started!"
            self.log.debug(status)
            return err, status
        except Exception as e:
            err = f"Could not start the {self.processName} service!\nReason: {e}"
            self.log.error(status)
            return err, status

    def stop(self):
        err = None
        status = None
        try:
            if self.check_status()[1]:
                self.log.info(f"Stopping the {self.processName} process!")
                subprocess.run(
                    ["sudo", "service", self.processName, "stop"], check=True, capture_output=True)
                time.sleep(5)
                if not self.check_status()[1]:
                    status = f"{self.processName} stopped!"
                else:
                    status = f"{self.processName} still running!"
            else:
                status = f"{self.processName} is already stopped!"
            self.log.debug(status)
            return err, status
        except Exception as e:
            err = f"Could not stop {self.processName} service!\nReason: {e}"
            self.log.error(err)
            return err, status

    def reload(self):
        err = None
        status = None
        try:
            self.log.info(f"Reloading the {self.processName} process!")
            subprocess.run(
                ["sudo", "service", self.processName, "reload"], check=True, capture_output=True)
            time.sleep(5)
            if self.check_status()[1]:
                status = f"{self.processName} reloaded and started!"
            else:
                status = f"{self.processName} reloaded but failed to start!"
            self.log.debug(status)
            return err, status
        except Exception as e:
            err = f"Could not reload {self.processName} service!\nReason: {e}"
            self.log.error(err)
            return err, status

    def check_status(self) -> bool:
        '''
        Check wether the broker is running or not.

                Returns:
                        True/False (bool): Status of the command
        '''
        err = None
        status = None
        try:
            self.log.debug(f"Checking the {self.processName} service status!")
            res = subprocess.run(
                ["sudo", "service", self.processName, "status"], capture_output=True)
            # Might check if broker is installed look for unrecognized service
            if f"is running" in res.stdout.decode():
                status = True
            else:
                status = False
            # self.log.debug(status)
            return err, status
        except Exception as e:
            err = f"Could not read {self.processName} status!\nReason: {e}"
            self.log.error(err)
            return err, False

    def start_on_startup(self):
        # Check wether is or not the broker start on startup
        pass
