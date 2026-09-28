import os
import re

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 1. Map faint/light text classes to high-contrast dark text classes
    content = re.sub(r'\btext-slate-100\b', 'text-slate-900', content)
    content = re.sub(r'\btext-slate-200\b', 'text-slate-800', content)
    content = re.sub(r'\btext-slate-300\b', 'text-slate-700', content)
    content = re.sub(r'\btext-slate-400\b', 'text-slate-500', content)
    
    content = re.sub(r'\btext-gray-100\b', 'text-slate-900', content)
    content = re.sub(r'\btext-gray-200\b', 'text-slate-800', content)
    content = re.sub(r'\btext-gray-300\b', 'text-slate-700', content)
    content = re.sub(r'\btext-gray-400\b', 'text-slate-500', content)

    content = re.sub(r'\btext-zinc-100\b', 'text-slate-900', content)
    content = re.sub(r'\btext-zinc-200\b', 'text-slate-800', content)
    content = re.sub(r'\btext-zinc-300\b', 'text-slate-700', content)
    content = re.sub(r'\btext-zinc-400\b', 'text-slate-500', content)

    # 2. Fix faint background badges and overlays
    content = re.sub(r'\bbg-indigo-500\/10\b', 'bg-indigo-50', content)
    content = re.sub(r'\bbg-sky-500\/10\b', 'bg-sky-50', content)
    content = re.sub(r'\bbg-emerald-500\/10\b', 'bg-emerald-50', content)
    content = re.sub(r'\bbg-amber-500\/10\b', 'bg-amber-50', content)
    content = re.sub(r'\bbg-rose-500\/10\b', 'bg-rose-50', content)

    content = re.sub(r'\bborder-indigo-500\/20\b', 'border-indigo-200', content)
    content = re.sub(r'\bborder-sky-500\/20\b', 'border-sky-200', content)
    content = re.sub(r'\bborder-emerald-500\/20\b', 'border-emerald-200', content)

    # 3. Fix placeholder text
    content = re.sub(r'\bplaceholder-slate-500\b', 'placeholder-slate-400', content)

    # Clean double spaces inside classNames
    content = re.sub(r'className="([^"]+)"', lambda m: 'className="' + ' '.join(m.group(1).split()) + '"', content)

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed contrast in: {filepath}")

def main():
    src_dir = '/Users/chakradhar/.gemini/antigravity/scratch/logistics-os/src'
    for root, dirs, files in os.walk(src_dir):
        for file in files:
            if file.endswith('.tsx') or file.endswith('.ts'):
                fix_file(os.path.join(root, file))

if __name__ == '__main__':
    main()
