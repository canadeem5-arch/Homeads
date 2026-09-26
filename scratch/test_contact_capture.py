import subprocess
import os

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
out_img = r"C:\Users\Photoseries\.gemini\antigravity-ide\brain\62367062-6a67-4aa9-bbe9-8c11b7a87f34\test_contact_render.png"
contact_url = r"file:///c:/Users/Photoseries/Music/scratch/nothing/Homeads.ae/contact.html"

cmd = [
    chrome_path,
    "--headless",
    "--disable-gpu",
    "--window-size=1280,800",
    f"--screenshot={out_img}",
    contact_url
]
subprocess.run(cmd, timeout=20)
print("Saved screenshot to", out_img)
