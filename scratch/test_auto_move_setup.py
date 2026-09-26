import subprocess
import os

test_html = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="../style.css">
  <style>
    body { background: #050505; margin: 0; padding: 40px 0; overflow-x: hidden; }
  </style>
</head>
<body>
"""

with open(r"c:\Users\Photoseries\Music\scratch\nothing\Homeads.ae\index.html", "r", encoding="utf-8") as f:
    content = f.read()

start_marker = '<section class="featured-work-section"'
end_marker = '</section>'
start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx) + len(end_marker)
section = content[start_idx:end_idx].replace('src="assets/', 'src="../assets/')

test_html += section + """
<script>
  // Continuous auto moving slider script test
</script>
</body>
</html>
"""
with open(r"c:\Users\Photoseries\Music\scratch\nothing\Homeads.ae\scratch\test_auto_move.html", "w", encoding="utf-8") as f:
    f.write(test_html)
print("Created test html")
