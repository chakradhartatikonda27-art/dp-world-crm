import os
import re

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # Add dark: variants alongside light container classes if dark: is missing
    # 1. Outer container / cards: bg-white -> bg-white dark:bg-slate-900
    # but not if dark:bg- already present!
    def replace_bg_white(match):
        full = match.group(0)
        if 'dark:bg-' in full:
            return full
        return full.replace('bg-white', 'bg-white dark:bg-slate-900')

    content = re.sub(r'\bbg-white\b(?!\s*dark:bg-)', 'bg-white dark:bg-slate-900', content)
    content = re.sub(r'\bbg-slate-50\b(?!\s*dark:bg-)', 'bg-slate-50 dark:bg-slate-950', content)
    content = re.sub(r'\bbg-slate-100\b(?!\s*dark:bg-)', 'bg-slate-100 dark:bg-slate-800', content)

    content = re.sub(r'\bborder-slate-200\b(?!\s*dark:border-)', 'border-slate-200 dark:border-slate-800', content)
    content = re.sub(r'\bborder-slate-300\b(?!\s*dark:border-)', 'border-slate-300 dark:border-slate-700', content)

    content = re.sub(r'\btext-slate-900\b(?!\s*dark:text-)', 'text-slate-900 dark:text-slate-100', content)
    content = re.sub(r'\btext-slate-800\b(?!\s*dark:text-)', 'text-slate-800 dark:text-slate-200', content)
    content = re.sub(r'\btext-slate-700\b(?!\s*dark:text-)', 'text-slate-700 dark:text-slate-300', content)
    content = re.sub(r'\btext-slate-600\b(?!\s*dark:text-)', 'text-slate-600 dark:text-slate-400', content)

    # Clean double spaces inside classNames
    content = re.sub(r'className="([^"]+)"', lambda m: 'className="' + ' '.join(m.group(1).split()) + '"', content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Enabled dual theme in: {filepath}")

def main():
    src_dir = '/Users/chakradhar/.gemini/antigravity/scratch/logistics-os/src'
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                process_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
