import subprocess
import time
from http.server import HTTPServer, SimpleHTTPRequestHandler
import threading

port = 8991
class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=r"c:\Users\Photoseries\Music\scratch\nothing\Homeads.ae", **kwargs)

server = HTTPServer(('localhost', port), Handler)
t = threading.Thread(target=server.serve_forever)
t.daemon = True
t.start()

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
out_img = r"C:\Users\Photoseries\.gemini\antigravity-ide\brain\62367062-6a67-4aa9-bbe9-8c11b7a87f34\auto_moving_slider_test.png"

cmd = [
    chrome_path,
    "--headless",
    "--disable-gpu",
    "--window-size=1600,900",
    f"--screenshot={out_img}",
    f"http://localhost:{port}/index.html#portfolio"
]
subprocess.run(cmd, timeout=20)
server.shutdown()
print("Captured verification to", out_img)
