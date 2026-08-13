import re, os
def find_funcs(code):
    funcs = re.findall(r'function\s+(\w+)', code)
    funcs += re.findall(r'(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?(?:\([^)]*\)|[a-zA-Z_]\w*)\s*=>', code)
    funcs += re.findall(r'(?:^|\s)(\w+)\s*\([^)]*\)\s*\{', code)
    return set(funcs)

for root, dirs, files in os.walk('/home/runner/work/fence-estimator/fence-estimator'):
    if 'node_modules' in root or '.git' in root: continue
    for file in files:
        if file.endswith('.js') or file.endswith('.html'):
            path = os.path.join(root, file)
            content = open(path, 'r', encoding='utf-8', errors='ignore').read()
            funcs = find_funcs(content)
            for f in funcs:
                if f and len(f)>1 and f not in ('if', 'for', 'while', 'catch', 'switch', 'return'):
                    # check if f is called inside f
                    # simplified check: just find occurrences of f inside the function body
                    pass
