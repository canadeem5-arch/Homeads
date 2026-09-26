import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# We can search Wikimedia Commons for high-res public domain / CC images of Dubai landmarks & developers
urls = [
    # Palm Jumeirah (Nakheel)
    ("https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Palm_Jumeirah_aerial_view%2C_2020.jpg/1200px-Palm_Jumeirah_aerial_view%2C_2020.jpg", "case-nakheel.jpg"),
    # Binghatti / Dubai Canal / Downtown
    ("https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Dubai_Marina_skyline%2C_2021.jpg/1200px-Dubai_Marina_skyline%2C_2021.jpg", "case-binghatti.jpg"),
    # Danube / Business Bay
    ("https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Business_Bay_Dubai_skyscrapers.jpg/1200px-Business_Bay_Dubai_skyscrapers.jpg", "case-danube.jpg")
]

for url, filename in urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            data = resp.read()
            out_path = f"assets/{filename}"
            with open(out_path, "wb") as f:
                f.write(data)
            print(f"Downloaded {filename} ({len(data)} bytes)")
    except Exception as e:
        print(f"Error {filename}: {e}")
