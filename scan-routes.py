import re
content = open('/home/runner/work/fence-estimator/fence-estimator/backend/server.js').read()

routes = re.findall(r'app\.(?:get|post|put|delete|patch|use)\([^,]+,\s*(?:auth,\s*)?(?:authorizeRole[^,]+,\s*)?async\s*\(\s*req,\s*res\s*(?:,\s*next)?\s*\)\s*=>\s*\{(.*?)\}\);', content, re.DOTALL)

for i, body in enumerate(routes):
    if 'res.json' not in body and 'res.send' not in body and 'res.status' not in body and 'next(' not in body:
        print("Missing response in route:", body[:100])
