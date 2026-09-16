import ftplib
import os

FTP_HOST = "82.112.228.16"
FTP_USER = "u152757066.homeads.photoseries.in"
FTP_PASS = "User@2563"
BASE_DIR = r"c:\Users\Photoseries\Music\scratch\nothing\Homeads.ae"

files_to_upload = [
    ("index.html", "/public_html/index.html"),
    ("assets/case-emaar.jpg", "/public_html/assets/case-emaar.jpg"),
    ("assets/case-damac.jpg", "/public_html/assets/case-damac.jpg"),
    ("assets/case-sobha.jpg", "/public_html/assets/case-sobha.jpg"),
    ("assets/case-omniyat.jpg", "/public_html/assets/case-omniyat.jpg"),
    ("assets/case-nakheel.jpg", "/public_html/assets/case-nakheel.jpg"),
    ("assets/case-danube.jpg", "/public_html/assets/case-danube.jpg"),
]

print("Connecting to FTP...")
ftp = ftplib.FTP(FTP_HOST, FTP_USER, FTP_PASS, timeout=30)
print("Connected!")

for local_rel, remote_path in files_to_upload:
    local_path = os.path.join(BASE_DIR, local_rel.replace("/", os.sep))
    print(f"Uploading {local_rel} -> {remote_path}...")
    with open(local_path, "rb") as f:
        ftp.storbinary(f"STOR {remote_path}", f)
    print(f"Uploaded {local_rel}!")

ftp.quit()
print("All real estate assets and index.html uploaded to Hostinger successfully!")
