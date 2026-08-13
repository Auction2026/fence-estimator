import os, re
for root, dirs, files in os.walk('/home/runner/work/fence-estimator/fence-estimator'):
    if 'node_modules' in root or '.git' in root: continue
    for file in files:
        if file.endswith('.js') or file.endswith('.html'):
            path = os.path.join(root, file)
            content = open(path, 'r', encoding='utf-8', errors='ignore').read()
            if 'while' in content:
                print(f"WHILE found in {path}")
            if 'for ' in content or 'for(' in content:
                print(f"FOR found in {path}")
            if 'setInterval' in content:
                print(f"SETINTERVAL found in {path}")
