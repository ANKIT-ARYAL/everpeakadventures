import os

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()
    
    # We want to add max-w-[1400px] mx-auto w-full to px-5 lg:px-20 if it doesn't already have a max-w
    # Be careful not to replace twice.
    if 'max-w-[1400px]' in content:
        return
        
    new_content = content.replace('px-5 lg:px-20', 'px-5 lg:px-20 max-w-[1400px] mx-auto w-full')
    
    if new_content != content:
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")

for root, _, files in os.walk('app/components'):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            fix_file(os.path.join(root, file))
