import base64
import os
import re
from PIL import Image
import io

with open('easy_dart_presentation.html', 'r', encoding='utf-8') as f:
    html = f.read()

def optimize_and_encode(match):
    rel_path = match.group(1)
    clean_path = rel_path.lstrip('./').replace('/', os.sep)
    if os.path.exists(clean_path):
        with Image.open(clean_path) as img:
            # Resize if overly large (> 1400px width)
            if img.width > 1400:
                new_height = int(img.height * (1400 / img.width))
                img = img.resize((1400, new_height), Image.Resampling.LANCZOS)
            
            # Convert RGBA to RGB if needed for jpeg/webp
            buffer = io.BytesIO()
            if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                img.save(buffer, format='WEBP', quality=85, method=6)
                mime = 'image/webp'
            else:
                img.save(buffer, format='WEBP', quality=85, method=6)
                mime = 'image/webp'
            
            b64_data = base64.b64encode(buffer.getvalue()).decode('utf-8')
            print(f'Optimized {clean_path}: {len(b64_data):,} base64 chars')
            return f'src="data:{mime};base64,{b64_data}"'
    else:
        print(f'Warning: {clean_path} not found!')
        return match.group(0)

new_html = re.sub(r'src="(\./presentation_assets/[^"]+)"', optimize_and_encode, html)

# Let's save both easy_dart_presentation_standalone.html and also update easy_dart_presentation.html if needed
output_filename = 'easy_dart_presentation_standalone.html'
with open(output_filename, 'w', encoding='utf-8') as f:
    f.write(new_html)

print(f'Saved {output_filename}, size: {os.path.getsize(output_filename):,} bytes')
