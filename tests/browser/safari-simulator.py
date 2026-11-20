"""Open the public URL in Mobile Safari and verify the rendered page on screen."""
import json
import os
import subprocess
import sys
import time
from pathlib import Path

site = os.environ["HANDOFF_TEST_URL"]
device_type = sys.argv[1]
evidence = Path(os.environ["RUNNER_TEMP"]) / "handoff-safari"
evidence.mkdir(exist_ok=True)
screenshot = evidence / (device_type + ".png")
simctl = ["xcrun", "simctl"]
runtimes = json.loads(subprocess.check_output(simctl + ["list", "devices", "available", "-j"]))["devices"]
sdk = subprocess.check_output(["xcrun", "--sdk", "iphonesimulator", "--show-sdk-version"], text=True).strip()
runtime = "com.apple.CoreSimulator.SimRuntime.iOS-" + "-".join(sdk.split(".")[:2])
devices = [d for d in runtimes.get(runtime, [])
           if d["name"].startswith(device_type) and d.get("isAvailable")]
if not devices:
    raise RuntimeError("No available " + device_type + " simulator for the active Xcode SDK " + sdk)
device = devices[0]
udid = device["udid"]
print("Simulator:", device["name"], "iOS/iPadOS", sdk, udid, flush=True)
if device["state"] == "Shutdown":
    subprocess.run(simctl + ["boot", udid], check=True)
subprocess.run(simctl + ["bootstatus", udid, "-b"], check=True)
scanner = evidence.parent / "handoff-screen-text"
subprocess.run(["xcrun", "swiftc", "tests/browser/screen-text.swift", "-o", scanner], check=True)
developer = Path(subprocess.check_output(["xcode-select", "-p"], text=True).strip())
subprocess.run(["open", "-a", developer / "Applications/Simulator.app", "--args", "-CurrentDeviceUDID", udid], check=True)
subprocess.run(simctl + ["launch", udid, "com.apple.mobilesafari"], check=False)
opened = subprocess.run(simctl + ["openurl", udid, site])
if opened.returncode != 0:
    # A cold Safari launch can time out before SpringBoard finishes handling the URL.
    subprocess.run(simctl + ["openurl", udid, site], check=False)
deadline = time.monotonic() + 120
while True:
    subprocess.run(simctl + ["io", udid, "screenshot", screenshot], check=True, capture_output=True)
    text = subprocess.check_output([scanner, screenshot], text=True)
    normalized = " ".join(text.lower().split())
    if "continue the work" in normalized and "create a handoff" in normalized:
        print("Visible in native Safari on", device["name"], "at", site, flush=True)
        print(text, flush=True)
        break
    if time.monotonic() >= deadline:
        raise RuntimeError("The expected builder headings were not visible. Screen text:\n" + text)
    time.sleep(4)
