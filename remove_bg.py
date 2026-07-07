import os
from rembg import remove
from PIL import Image

input_path = 'IMG-20260207-WA0038.jpg.jpeg'
output_path = 'public/images/profile.png'

print('Loading image...')
input_img = Image.open(input_path)
print('Removing background...')
output_img = remove(input_img)
print('Saving...')
output_img.save(output_path)
print('Done!')
