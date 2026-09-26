import subprocess
import os

with open(r"c:\Users\Photoseries\Music\scratch\nothing\Homeads.ae\index.html", "r", encoding="utf-8") as f:
    full = f.read()

start_marker = '<section class="featured-work-section"'
end_marker = '</section>'
start_idx = full.find(start_marker)
end_idx = full.find(end_marker, start_idx) + len(end_marker)
section_html = full[start_idx:end_idx]

# rewrite assets/ to ../assets/
section_html = section_html.replace('src="assets/', 'src="../assets/')

html_code = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="../style.css">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body {{ background: #050505; margin: 0; padding: 60px 0; overflow-x: hidden; font-family: 'Poppins', sans-serif; }}
  </style>
</head>
<body>
{section_html}
</body>
</html>
"""

preview_file = r"c:\Users\Photoseries\Music\scratch\nothing\Homeads.ae\scratch\preview_slider_fixed.html"
with open(preview_file, "w", encoding="utf-8") as f:
    f.write(html_code)

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
out_img = r"C:\Users\Photoseries\.gemini\antigravity-ide\brain\62367062-6a67-4aa9-bbe9-8c11b7a87f34\single_row_slider_verified.png"

cmd = [
    chrome_path,
    "--headless",
    "--disable-gpu",
    "--window-size=1600,900",
    f"--screenshot={out_img}",
    preview_file
]
subprocess.run(cmd, timeout=20)
print("Saved preview image to", out_img)
