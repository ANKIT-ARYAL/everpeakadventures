import os

with open('/tmp/old_blog_card.tsx', 'r') as f:
    old_card = f.read()

with open('/tmp/new_blog_card.tsx', 'r') as f:
    new_card = f.read()

files = [
    'app/blog/page.tsx'
]

for file_path in files:
    with open(file_path, 'r') as f:
        content = f.read()
    
    if old_card in content:
        content = content.replace(old_card, new_card)
        with open(file_path, 'w') as f:
            f.write(content)
        print(f"Replaced in {file_path}")
    else:
        print(f"Could not find old_card in {file_path}")
