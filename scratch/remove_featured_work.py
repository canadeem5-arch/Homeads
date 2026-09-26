import os

def remove_from_index(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove HTML Section
    sec_marker_start = '<!-- ===== FEATURED WORK & CASE STUDIES SHOWCASE ===== -->'
    sec_marker_end = '<!-- ===== OUR SERVICES ===== -->'
    
    if sec_marker_start in content and sec_marker_end in content:
        start_idx = content.find(sec_marker_start)
        end_idx = content.find(sec_marker_end)
        content = content[:start_idx] + content[end_idx:]
        print(f"Removed HTML section from {filepath}")
    else:
        print(f"Markers not found in {filepath}")

    # 2. Remove JS Slider Controller
    js_marker_start = '<!-- Featured Work Continuous Auto-Moving Slider Controller -->'
    js_marker_end = '<!-- Hero Video 0.33x Slow Speed -->'

    if js_marker_start in content and js_marker_end in content:
        start_idx = content.find(js_marker_start)
        end_idx = content.find(js_marker_end)
        content = content[:start_idx] + content[end_idx:]
        print(f"Removed JS controller from {filepath}")
    else:
        print(f"JS markers not found in {filepath}")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Saved {filepath}")

def remove_from_style(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    css_marker = '/* ===== FEATURED WORK & CASE STUDIES SHOWCASE ===== */'
    if css_marker in content:
        idx = content.find(css_marker)
        content = content[:idx].rstrip() + '\n'
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Removed CSS from {filepath}")
    else:
        print(f"CSS marker not found in {filepath}")

index_paths = [
    r'c:\Users\Photoseries\Music\scratch\nothing\Homeads.ae\index.html',
    r'c:\Users\Photoseries\Music\scratch\photoseries\homeads.ae\index.html'
]

style_paths = [
    r'c:\Users\Photoseries\Music\scratch\nothing\Homeads.ae\style.css',
    r'c:\Users\Photoseries\Music\scratch\photoseries\homeads.ae\style.css'
]

for p in index_paths:
    if os.path.exists(p):
        remove_from_index(p)

for p in style_paths:
    if os.path.exists(p):
        remove_from_style(p)
