import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# High-resolution Unsplash images of Dubai skyscrapers & luxury architecture
# Unsplash direct source URLs for Dubai luxury real estate:
unsplash_images = [
    ("https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1000&q=85", "case-nakheel.jpg"), # Dubai Palm / Coast
    ("https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1000&q=85", "case-binghatti.jpg"), # Dubai architecture / futuristic tower
    ("https://images.unsplash.com/photo-1546412414-e1885259563a?auto=format&fit=crop&w=1000&q=85", "case-danube.jpg"), # Luxury Dubai residential towers
]

for url, fname in unsplash_images:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req, context=ctx, timeout=15) as r:
            data = r.read()
            with open(f"assets/{fname}", "wb") as f:
                f.write(data)
            print(f"Downloaded {fname} successfully! ({len(data)} bytes)")
    except Exception as e:
        print(f"Error {fname}: {e}")
