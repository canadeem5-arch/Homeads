import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# Query Wikimedia API for direct original image URLs
queries = {
    "case-nakheel.jpg": "Palm Jumeirah",
    "case-binghatti.jpg": "Dubai modern skyscraper",
    "case-danube.jpg": "Dubai luxury apartment architecture",
    "case-omniyat.jpg": "The Opus Dubai Zaha Hadid"
}

for filename, q in queries.items():
    api_url = f"https://en.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch={urllib.parse.quote(q)}&gsrlimit=5&prop=pageimages&piprop=original"
    req = urllib.request.Request(api_url, headers={'User-Agent': 'HomeAdsBot/1.0 (contact@homeads.ae)'})
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as r:
            res = json.loads(r.read().decode('utf-8'))
            pages = res.get('query', {}).get('pages', {})
            found = False
            for pid, pdata in pages.items():
                if 'original' in pdata:
                    img_url = pdata['original']['source']
                    print(f"Found {filename} -> {img_url}")
                    img_req = urllib.request.Request(img_url, headers={'User-Agent': 'HomeAdsBot/1.0 (contact@homeads.ae)'})
                    with urllib.request.urlopen(img_req, context=ctx, timeout=15) as img_resp:
                        with open(f"assets/{filename}", "wb") as f:
                            f.write(img_resp.read())
                    print(f"Saved assets/{filename}")
                    found = True
                    break
            if not found:
                print(f"No original for {q}")
    except Exception as e:
        print(f"Error {filename}: {e}")
