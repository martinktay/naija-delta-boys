#!/usr/bin/env python3
"""Check Naija Delta Boys overlay source files against its manifest (stdlib only)."""
import hashlib, json, pathlib, sys
ROOT=pathlib.Path(__file__).resolve().parents[1]
manifest=json.loads((ROOT/'asset_manifest.json').read_text(encoding='utf-8'))
errors=[]
counts={}
for item in manifest['files']:
    p=ROOT/item['file']
    counts[item['role']]=counts.get(item['role'],0)+1
    if not p.is_file():
        errors.append('MISSING: '+item['file']);continue
    h=hashlib.sha256(p.read_bytes()).hexdigest()
    if h != item['sha256']: errors.append('SHA256 MISMATCH: '+item['file'])
print('Game:',manifest['game'])
print('Source sheets:',counts.get('source_sheet',0))
print('Reference images:',counts.get('reference_image',0))
print('Errors:',len(errors))
for e in errors:print(e)
sys.exit(1 if errors else 0)
