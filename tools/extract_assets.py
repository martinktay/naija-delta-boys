"""Auditable sprite extraction for the Naija Delta prototype.

Raw source sheets are never modified. Coordinates below are intentionally
explicit so every game-ready crop can be traced back to its source artwork.
"""
from __future__ import annotations

import json
import shutil
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "assets" / "raw_sheets"
OUT = ROOT / "public" / "assets" / "naija-delta-boys"
SPRITES = OUT / "sprites"

# name, sheet, (left, top, right, bottom), intended scale, footpoint, collision
CROPS = [
    ("mangrove_large", "tropical_delta_village_asset_atlas.png", (0, 0, 270, 235), .62, (.50, .88), {"shape":"ellipse","rx":54,"ry":22}),
    ("mangrove_small", "tropical_delta_village_asset_atlas.png", (665, 45, 805, 215), .62, (.50, .88), {"shape":"ellipse","rx":34,"ry":15}),
    ("jetty", "tropical_delta_village_asset_atlas.png", (15, 640, 385, 825), .60, (.50, .78), {"shape":"rect","w":190,"h":58}),
    ("palm", "tropical_coastal_game_asset_atlas.png", (0, 0, 158, 360), .58, (.48, .94), {"shape":"ellipse","rx":26,"ry":14}),
    ("stilt_house", "isometric_nigerian_village_asset_pack.png", (15, 15, 325, 345), .70, (.50, .88), {"shape":"rect","w":165,"h":76}),
    ("mama_ebi_kitchen", "isometric_nigerian_village_asset_pack.png", (390, 350, 715, 612), .76, (.50, .92), {"shape":"rect","w":210,"h":76}),
    ("fish_market", "isometric_nigerian_village_asset_pack.png", (5, 350, 372, 605), .72, (.50, .92), {"shape":"rect","w":220,"h":72}),
    ("community_hall", "isometric_nigerian_village_asset_pack.png", (410, 640, 888, 892), .60, (.50, .92), {"shape":"rect","w":240,"h":70}),
    ("pos_shop", "isometric_nigerian_village_asset_pack.png", (750, 370, 920, 585), .70, (.50, .94), {"shape":"rect","w":112,"h":62}),
    ("passenger_boat", "nigerian_coastal_transport_asset_sheet.png", (15, 330, 610, 655), .54, (.50, .80), {"shape":"rect","w":250,"h":62}),
    ("billboard_frame", "isometric_niger_delta_infrastructure_asset_sheet.png", (690, 570, 900, 845), .70, (.50, .94), {"shape":"rect","w":115,"h":24}),
    ("player", "nigerian_community_character_sprite_sheet.png", (0, 105, 185, 630), .29, (.50, .96), {"shape":"ellipse","rx":17,"ry":10}),
    ("timi", "nigerian_community_character_sprite_sheet.png", (360, 105, 525, 630), .27, (.50, .96), {"shape":"ellipse","rx":17,"ry":10}),
    ("tari", "nigerian_community_character_sprite_sheet.png", (555, 100, 710, 630), .27, (.50, .96), {"shape":"ellipse","rx":17,"ry":10}),
    ("representative", "nigerian_community_character_sprite_sheet.png", (735, 690, 900, 1240), .26, (.50, .96), {"shape":"ellipse","rx":17,"ry":10}),
]

def clean_crop(im: Image.Image, box: tuple[int,int,int,int]) -> Image.Image:
    crop = im.crop(box).convert("RGBA")
    alpha = crop.getchannel("A")
    alpha = alpha.point(lambda p: 0 if p < 18 else (255 if p > 245 else p))
    crop.putalpha(alpha)
    bbox = crop.getbbox()
    return crop.crop(bbox) if bbox else crop

def apply_manual_mask(name: str, sprite: Image.Image) -> Image.Image:
    """Remove reviewed neighbouring fragments without guessing across overlaps."""
    masks = {
        "jetty": [(300, 0, 400, 82), (0, 145, 72, 210)],
        "billboard_frame": [(190, 0, 260, 275)],
        "representative": [(145, 0, 210, 550)],
    }
    if name not in masks:
        return sprite
    alpha = sprite.getchannel("A")
    draw = ImageDraw.Draw(alpha)
    for rect in masks[name]: draw.rectangle(rect, fill=0)
    sprite.putalpha(alpha)
    bbox = sprite.getbbox()
    return sprite.crop(bbox) if bbox else sprite

def keep_largest_component(name: str, sprite: Image.Image) -> Image.Image:
    if name not in {"jetty"}:
        return sprite
    alpha = sprite.getchannel("A")
    px = alpha.load(); w, h = alpha.size; seen=set(); groups=[]
    for y in range(h):
        for x in range(w):
            if (x,y) in seen or px[x,y] == 0: continue
            stack=[(x,y)]; seen.add((x,y)); group=[]
            while stack:
                cx,cy=stack.pop(); group.append((cx,cy))
                for nx,ny in ((cx-1,cy),(cx+1,cy),(cx,cy-1),(cx,cy+1)):
                    if 0<=nx<w and 0<=ny<h and (nx,ny) not in seen and px[nx,ny]>0:
                        seen.add((nx,ny)); stack.append((nx,ny))
            groups.append(group)
    if groups:
        keep=set(max(groups,key=len)); out=Image.new("L",(w,h),0); opx=out.load()
        for x,y in keep: opx[x,y]=px[x,y]
        sprite.putalpha(out)
    bbox=sprite.getbbox()
    return sprite.crop(bbox) if bbox else sprite

def make_ad() -> None:
    ad_dir = OUT / "ads"
    ad_dir.mkdir(parents=True, exist_ok=True)
    im = Image.new("RGBA", (640, 300), "#123a70")
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((12,12,628,288), 26, fill="#136fb0", outline="#6ee7c5", width=8)
    d.ellipse((455,50,575,170), fill="#f5c451")
    d.arc((480,72,550,142), 205, 335, fill="white", width=10)
    d.arc((466,58,565,157), 205, 335, fill="white", width=10)
    d.text((42,48), "CreekConnect", fill="white", font=ImageFont.truetype("arialbd.ttf", 54))
    d.text((45,125), "Stronger signal. Closer community.", fill="#d8fff3", font=ImageFont.truetype("arial.ttf", 26))
    d.text((45,194), "FICTIONAL DEMO CAMPAIGN", fill="#f5c451", font=ImageFont.truetype("arialbd.ttf", 22))
    im.save(ad_dir / "creekconnect_demo.png", optimize=True)

def main() -> None:
    SPRITES.mkdir(parents=True, exist_ok=True)
    before = OUT / "sprites_before"
    if not before.exists() and any(SPRITES.glob("*.png")):
        shutil.copytree(SPRITES, before)
    records = []
    previews = []
    for name, source, box, scale, footpoint, collision in CROPS:
        raw = Image.open(RAW / source)
        sprite = keep_largest_component(name, apply_manual_mask(name, clean_crop(raw, box)))
        sprite.save(SPRITES / f"{name}.png", optimize=True)
        review = "needs_manual_art" if name in {"timi","tari","representative"} else "approved_prototype"
        records.append({"key":name,"file":f"sprites/{name}.png","source":f"assets/raw_sheets/{source}","crop":list(box),"dimensions":list(sprite.size),"scale":scale,"footpoint":{"x":footpoint[0],"y":footpoint[1]},"collision":collision,"review_status":review,"review_notes":"Static pose; dedicated directional animation required." if review == "needs_manual_art" else "Curated crop accepted for prototype gameplay."})
        thumb = sprite.copy(); thumb.thumbnail((170,150), Image.Resampling.LANCZOS)
        previews.append((name, thumb))
    make_ad()
    (OUT / "game_assets.json").write_text(json.dumps({"version":1,"assets":records}, indent=2), encoding="utf-8")

    sheet = Image.new("RGB", (800, ((len(previews)+3)//4)*200), "#17312d")
    draw = ImageDraw.Draw(sheet)
    for i, (name, thumb) in enumerate(previews):
        x=(i%4)*200; y=(i//4)*200
        for yy in range(y, y+160, 16):
            for xx in range(x, x+200, 16):
                draw.rectangle((xx,yy,xx+15,yy+15), fill="#d9ddd7" if (xx//16+yy//16)%2 else "#aab5aa")
        sheet.paste(thumb, (x+(200-thumb.width)//2, y+(150-thumb.height)//2), thumb)
        draw.rectangle((x,y+160,x+199,y+199), fill="#0b201d")
        draw.text((x+10,y+172), name, fill="white")
    sheet.save(OUT / "sprite_contact_sheet.jpg", quality=92)

    # Comparison sheets at gameplay scale on three diagnostic backgrounds.
    def comparison(bg: str, filename: str) -> None:
        canvas = Image.new("RGB", (1200, len(CROPS) * 150), bg)
        draw = ImageDraw.Draw(canvas)
        if bg == "#d8d8d8":
            for yy in range(0, canvas.height, 20):
                for xx in range(0, canvas.width, 20):
                    if (xx//20 + yy//20) % 2: draw.rectangle((xx,yy,xx+19,yy+19), fill="#f4f4f4")
        for row, (name, *_rest) in enumerate(CROPS):
            y=row*150
            for col, folder in enumerate((before, SPRITES)):
                path=folder/f"{name}.png"
                if path.exists():
                    item=Image.open(path).convert("RGBA"); item.thumbnail((330,125),Image.Resampling.LANCZOS)
                    canvas.paste(item,(150+col*520,y+(125-item.height)//2),item)
            draw.text((12,y+18),name,fill="#ef8a34" if bg=="#102b28" else "#18342f")
            draw.text((220,y+128),"BEFORE",fill="#ef8a34");draw.text((740,y+128),"AFTER",fill="#37a77b")
        canvas.save(OUT/filename,quality=92)
    comparison("#d8d8d8","sprites_before_after_checker.jpg")
    comparison("#102b28","sprites_before_after_dark.jpg")
    comparison("#d9b76f","sprites_before_after_terrain.jpg")

    cards="".join(f'<article><h2>{r["key"]}</h2><div><figure><img src="assets/naija-delta-boys/sprites_before/{r["key"]}.png"><figcaption>Before</figcaption></figure><figure><img src="assets/naija-delta-boys/{r["file"]}"><figcaption>After · {r["review_status"]}</figcaption></figure></div><code>{r["source"]} · crop {r["crop"]} · foot {r["footpoint"]}</code></article>' for r in records)
    html=f'''<!doctype html><meta charset="utf-8"><title>Naija Delta Sprite Audit</title><style>body{{margin:0;background:#102b28;color:#fff;font:14px Arial;padding:30px}}h1{{color:#f0b64a}}main{{display:grid;grid-template-columns:repeat(auto-fit,minmax(360px,1fr));gap:18px}}article{{background:#173b37;padding:16px;border-radius:14px}}article div{{display:grid;grid-template-columns:1fr 1fr;gap:8px;background:linear-gradient(45deg,#ddd 25%,#aaa 25% 50%,#ddd 50% 75%,#aaa 75%);background-size:24px 24px}}figure{{margin:0;min-height:170px;display:grid;place-items:center}}img{{max-width:100%;max-height:150px}}figcaption{{background:#102b28;padding:4px 8px}}code{{display:block;margin-top:10px;color:#b9d8ce;font-size:11px}}</style><h1>Naija Delta Boys — Sprite Audit</h1><p>Curated MVP assets at comparable display scale. Static characters remain placeholders and are explicitly flagged.</p><main>{cards}</main>'''
    (ROOT/"public"/"asset-audit.html").write_text(html,encoding="utf-8")

if __name__ == "__main__":
    main()
