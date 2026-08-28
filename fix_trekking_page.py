import re

with open('app/trekking/page.tsx', 'r') as f:
    content = f.read()

interface_regex = re.compile(r'interface PageProps \{\s*searchParams:\s*Promise<\{\s*page\?:\s*string;\s*\}>;\s*\}')
new_interface = """interface PageProps {
  searchParams: Promise<{
    page?: string;
    q?: string;
    destination?: string;
    duration?: string;
    difficulty?: string;
    price?: string;
  }>;
}"""
content = interface_regex.sub(new_interface, content)

with open('app/trekking/page.tsx', 'w') as f:
    f.write(content)

