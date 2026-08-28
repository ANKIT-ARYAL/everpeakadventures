import re

with open('app/components/home/Hero.tsx', 'r') as f:
    content = f.read()

# Add import
content = content.replace('import HeroContent from "./HeroContent";', 'import HeroContent from "./HeroContent";\nimport HeroSearchBar from "./HeroSearchBar";')

# Replace the HTML block
html_block_regex = re.compile(r'\{\/\* MODERN SEARCH FUNCTIONALITY - Floating Pill Design \*\/\}.*?<\/div>\s*<\/div>', re.DOTALL)
new_component = "{/* MODERN SEARCH FUNCTIONALITY - Floating Pill Design */}\n      <HeroSearchBar />"
content = html_block_regex.sub(new_component, content)

with open('app/components/home/Hero.tsx', 'w') as f:
    f.write(content)

