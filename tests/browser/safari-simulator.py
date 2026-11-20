"""Smoke-test the public page in the Safari app on an Apple Simulator."""
import json
import os
import subprocess
import sys
import time
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

device_type = sys.argv[1]
site = os.environ["HANDOFF_TEST_URL"]
driver_url = "http://127.0.0.1:4444"
simctl = ["xcrun", "simctl"]
runtimes = json.loads(subprocess.check_output(simctl + ["list", "devices", "available", "-j"]))["devices"]
devices = [d for runtime, group in reversed(list(runtimes.items())) if ".iOS-" in runtime
           for d in group if d["name"].startswith(device_type) and d.get("isAvailable")]
device = next(iter(devices))
print("Simulator:", device["name"], device["udid"], flush=True)
if device["state"] == "Shutdown":
    subprocess.run(simctl + ["boot", device["udid"]], check=True)
subprocess.run(simctl + ["bootstatus", device["udid"], "-b"], check=True)


def command(method, path, data=None):
    body = None if data is None else json.dumps(data).encode()
    req = Request(driver_url + path, data=body, method=method, headers={"Content-Type": "application/json"})
    try:
        with urlopen(req, timeout=100) as response:
            return json.load(response)["value"]
    except HTTPError as error:
        raise RuntimeError(error.read().decode()) from error


with subprocess.Popen(["/usr/bin/safaridriver", "-p", "4444"]) as driver:
    try:
        for attempt in range(30):
            try:
                command("GET", "/status")
                break
            except URLError:
                if attempt == 29:
                    raise
                time.sleep(1)
        session = command("POST", "/session", {"capabilities": {"alwaysMatch": {
            "browserName": "Safari", "platformName": "iOS",
            "safari:useSimulator": True, "safari:deviceUDID": device["udid"]}}})
        print("Safari session:", session["capabilities"], flush=True)
        prefix = "/session/" + session["sessionId"]

        def execute(js):
            return command("POST", prefix + "/execute/sync", {"script": js, "args": []})

        def click(selector):
            element = command("POST", prefix + "/element", {"using": "css selector", "value": selector})
            eid = element["element-6066-11e4-a52e-4f735466cecf"]
            command("POST", prefix + "/element/" + eid + "/click", {})

        try:
            command("POST", prefix + "/url", {"url": site})
            assert execute("return document.querySelector('#handoff') !== null")
            assert execute("return document.documentElement.scrollWidth <= innerWidth")
            click("#load")
            execute("""
                document.querySelector('#mode').value = 'review';
                document.querySelector('#commitments').value = 'Передать макет | Редактор | open';
            """)
            click("button[type=submit]")
            preview = execute("return document.querySelector('#preview').textContent")
            assert "Selected: REVIEW" in preview and "Передать макет" in preview
            assert execute("return ['json','md','copy'].every(id => !document.getElementById(id).disabled)")
            click("#load")
            assert execute("return ['json','md','copy'].every(id => document.getElementById(id).disabled)")
            print("Live Safari page, layout, generation and stale export checks passed.", flush=True)
        finally:
            command("DELETE", prefix)
    finally:
        driver.terminate()
