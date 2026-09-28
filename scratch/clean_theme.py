import os
import re

def clean_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Strip orphan dark artifacts like ':bg-slate-700', ':bg-slate-800', ':text-white', ':border-slate-700'
    content = re.sub(r'\s:[a-zA-Z0-9\-\/\[\]\.]+', '', content)

    # Replace dark hover states with crisp light hover states
    content = re.sub(r'\bhover:bg-slate-700\b', 'hover:bg-slate-200', content)
    content = re.sub(r'\bhover:bg-slate-800\b', 'hover:bg-slate-200', content)
    content = re.sub(r'\bhover:bg-slate-900\b', 'hover:bg-slate-100', content)

    # Clean double spaces inside classNames
    content = re.sub(r'className="([^"]+)"', lambda m: 'className="' + ' '.join(m.group(1).split()) + '"', content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Cleaned artifacts in: {filepath}")

def main():
    src_dir = '/Users/chakradhar/.gemini/antigravity/scratch/logistics-os/src'
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                clean_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
