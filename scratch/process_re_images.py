import shutil
import os
from PIL import Image

src_brain = r"C:\Users\Photoseries\.gemini\antigravity-ide\brain\62367062-6a67-4aa9-bbe9-8c11b7a87f34"
dest_assets = r"c:\Users\Photoseries\Music\scratch\nothing\Homeads.ae\assets"

# 1. Emaar
shutil.copyfile(os.path.join(src_brain, "case_emaar_1789284715196.jpg"), os.path.join(dest_assets, "case-emaar.jpg"))
print("Copied case-emaar.jpg")

# 2. DAMAC
shutil.copyfile(os.path.join(src_brain, "case_damac_1789284736369.jpg"), os.path.join(dest_assets, "case-damac.jpg"))
print("Copied case-damac.jpg")

# 3. Sobha
shutil.copyfile(os.path.join(src_brain, "case_sobha_1789285009662.jpg"), os.path.join(dest_assets, "case-sobha.jpg"))
print("Copied case-sobha.jpg")

# 4. Omniyat - crop from dubai_luxury_skyline to vertical 3:4 focusing on the illuminated Burj & canal
skyline_path = os.path.join(src_brain, "dubai_luxury_skyline_1788809249960.jpg")
if os.path.exists(skyline_path):
    img = Image.open(skyline_path)
    # img is 1920x1080. Crop center 810x1080 (3:4 ratio)
    w, h = img.size
    target_w = int(h * 3 / 4)
    left = (w - target_w) // 2
    cropped = img.crop((left, 0, left + target_w, h))
    cropped.save(os.path.join(dest_assets, "case-omniyat.jpg"), quality=90)
    print("Created case-omniyat.jpg (cropped 3:4 from skyline)")

# 5. Nakheel - crop case-nakheel.jpg to 3:4
nakheel_src = os.path.join(dest_assets, "case-nakheel.jpg")
if os.path.exists(nakheel_src):
    img = Image.open(nakheel_src)
    w, h = img.size
    target_w = int(h * 3 / 4)
    left = max(0, (w - target_w) // 2)
    cropped = img.crop((left, 0, left + target_w, h))
    cropped.save(os.path.join(dest_assets, "case-nakheel.jpg"), quality=90)
    print("Optimized case-nakheel.jpg")

# 6. Danube - crop case-danube.jpg to 3:4
danube_src = os.path.join(dest_assets, "case-danube.jpg")
if os.path.exists(danube_src):
    img = Image.open(danube_src)
    w, h = img.size
    target_w = int(h * 3 / 4)
    left = max(0, (w - target_w) // 2)
    cropped = img.crop((left, 0, left + target_w, h))
    cropped.save(os.path.join(dest_assets, "case-danube.jpg"), quality=90)
    print("Optimized case-danube.jpg")

print("All real estate images processed!")
