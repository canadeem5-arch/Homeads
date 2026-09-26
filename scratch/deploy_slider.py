import ftplib
import os

FTP_HOST = "82.112.228.16"
FTP_USER = "u152757066.homeads.photoseries.in"
FTP_PASS = "User@2563"
BASE_DIR = r"c:\Users\Photoseries\Music\scratch\nothing\Homeads.ae"

files_to_upload = [
    ("index.html", "/public_html/index.html"),
    ("style.css", "/public_html/style.css"),
]

print("Connecting to FTP...")
ftp = ftplib.FTP(FTP_HOST, FTP_USER, FTP_PASS, timeout=30)
print("Connected!")

for local_rel, remote_path in files_to_upload:
    local_path = os.path.join(BASE_DIR, local_rel)
    print(f"Uploading {local_rel} -> {remote_path}...")
    with open(local_path, "rb") as f:
        ftp.storbinary(f"STOR {remote_path}", f)
    print(f"Successfully uploaded {local_rel}!")

ftp.quit()
print("All files deployed to Hostinger FTP successfully!")
