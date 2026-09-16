import subprocess
import time
import os

html_path = r"c:\Users\Photoseries\Music\scratch\nothing\Homeads.ae\index.html"
out_img = r"C:\Users\Photoseries\.gemini\antigravity-ide\brain\62367062-6a67-4aa9-bbe9-8c11b7a87f34\single_row_slider_preview.png"

# Use chrome to screenshot the portfolio section
chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
if not os.path.exists(chrome_path):
    chrome_path = r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"

# We can create a lightweight preview page focused on the portfolio section or use selenium/playwright or python HTTP server
port = 8899
from http.server import HTTPServer, SimpleHTTPRequestHandler
import threading

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=r"c:\Users\Photoseries\Music\scratch\nothing\Homeads.ae", **kwargs)

server = HTTPServer(('localhost', port), Handler)
t = threading.Thread(target=server.serve_forever)
t.daemon = True
t.start()

cmd = [
    chrome_path,
    "--headless",
    "--disable-gpu",
    "--window-size=1600,1100",
    f"--screenshot={out_img}",
    f"http://localhost:{port}/index.html#portfolio"
]
subprocess.run(cmd, timeout=20)
server.shutdown()
print("Captured screenshot to", out_img)
