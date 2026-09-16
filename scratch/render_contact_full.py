import time
import subprocess
from http.server import HTTPServer, SimpleHTTPRequestHandler
import threading

port = 8994
class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=r"c:\Users\Photoseries\Music\scratch\nothing\Homeads.ae", **kwargs)

server = HTTPServer(('localhost', port), Handler)
t = threading.Thread(target=server.serve_forever)
t.daemon = True
t.start()

html_no_preloader = ""
with open(r"c:\Users\Photoseries\Music\scratch\nothing\Homeads.ae\contact.html", "r", encoding="utf-8") as f:
    html_no_preloader = f.read()

# Disable preloader for instant rendering
html_no_preloader = html_no_preloader.replace('id="preloader"', 'id="preloader" style="display:none !important;"')

with open(r"c:\Users\Photoseries\Music\scratch\nothing\Homeads.ae\contact_test.html", "w", encoding="utf-8") as f:
    f.write(html_no_preloader)

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
out_img = r"C:\Users\Photoseries\.gemini\antigravity-ide\brain\62367062-6a67-4aa9-bbe9-8c11b7a87f34\contact_rendered_full.png"

cmd = [
    chrome_path,
    "--headless",
    "--disable-gpu",
    "--window-size=1280,1100",
    f"--screenshot={out_img}",
    f"http://localhost:{port}/contact_test.html"
]
subprocess.run(cmd, timeout=20)
server.shutdown()
print("Captured contact_rendered_full.png")
