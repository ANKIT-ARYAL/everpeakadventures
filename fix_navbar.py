import re

with open('app/components/layout/NavbarClient.tsx', 'r') as f:
    content = f.read()

# Fix gap by removing `mt-1` and adding `pt-2` padding inside the container so it overlaps the gap,
# or simply removing `mt-1` because `py-2` on the parent is enough. Let's just remove `mt-1`.
content = content.replace('py-2 mt-1 flex flex-col', 'py-2 flex flex-col')

# The parent `div` has `py-2`. Let's increase it to `py-4` so the hover area touches the dropdown.
# Actually, the parent has `className="relative group py-2"`. Let's change it to `py-4`.
content = content.replace('className="relative group py-2"', 'className="relative group py-4"')

# Also `Link href="/" className="hover:text-accent-amber transition-colors py-2"` to `py-4` for consistency
content = content.replace('className="hover:text-accent-amber transition-colors py-2"', 'className="hover:text-accent-amber transition-colors py-4"')

# Increase text size from `text-[11px]` to `text-[13px]`
content = content.replace('px-4 py-2.5 text-[11px] font-medium', 'px-4 py-3 text-[13px] font-semibold')

with open('app/components/layout/NavbarClient.tsx', 'w') as f:
    f.write(content)

