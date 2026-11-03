/* Rail & Thread — clothing rail with pendulum physics, product view, cart */
(() => {
  'use strict';

  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const G = typeof window.gsap !== 'undefined' ? window.gsap : null;
  if (G && window.ScrollTrigger) G.registerPlugin(window.ScrollTrigger);
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const money = (n) => '$' + Math.round(n).toLocaleString('en-US');

  /* ------------------------------------------------------------------ */
  /* Catalogue                                                           */
  /* ------------------------------------------------------------------ */
  const TYPE_LABEL = { hoodie: 'Hoodie', tee: 'T-shirt', jacket: 'Jacket', tank: 'Tank', crew: 'Sweatshirt', long: 'Longsleeve' };
  const PRODUCTS = [
    { id: 'mill-hoodie', name: 'Mill Hoodie', type: 'hoodie', price: 148, print: 'arch',
      blurb: 'Our heaviest pullover. Double-layer hood, kangaroo pocket and a boxy drop shoulder that holds its shape.',
      specs: [['Fabric', '480 gsm loopback'], ['Fit', 'Boxy, drop shoulder'], ['Made in', 'Small runs of 200']],
      colors: [['Bone', '#e7e0d1', '#2a2724'], ['Coal', '#2d2c2a', '#ebe5d8'], ['Moss', '#6b7358', '#efe9dc'], ['Clay', '#b17a5a', '#f6efe3']] },
    { id: 'standard-tee', name: 'Standard Tee', type: 'tee', price: 58, print: 'chest',
      blurb: 'The tee everything else is measured against. Dense 260 gsm jersey with a tight, flat collar.',
      specs: [['Fabric', '260 gsm jersey'], ['Fit', 'Relaxed'], ['Collar', '1×1 rib, taped']],
      colors: [['Chalk', '#f3f1ec', '#1f1e1c'], ['Ink', '#1e1f23', '#f3f1ec'], ['Sky', '#a8bbca', '#1d2a36']] },
    { id: 'coach-jacket', name: 'Yard Coach Jacket', type: 'jacket', price: 210, print: 'chestw',
      blurb: 'Waxed-cotton coach jacket with snap front, drawcord hem and a quilted inner that takes the edge off.',
      specs: [['Shell', 'Waxed cotton twill'], ['Lining', 'Quilted, 120 gsm'], ['Hardware', 'Matte steel snaps']],
      colors: [['Navy', '#26334b', '#e9e4d8'], ['Olive', '#5e6247', '#ece6d6'], ['Black', '#1c1c1d', '#d8d3c8']] },
    { id: 'rib-tank', name: 'Rib Tank', type: 'tank', price: 42, print: 'none',
      blurb: 'A heavy 2×2 rib tank cut long. Wear it alone in July, under everything in January.',
      specs: [['Fabric', '2×2 rib, 300 gsm'], ['Fit', 'Slim, long body'], ['Binding', 'Self-fabric']],
      colors: [['Ecru', '#ebe3d1'], ['Charcoal', '#3b3a37'], ['Rust', '#a85a3e']] },
    { id: 'heavy-crew', name: 'Heavy Crew', type: 'crew', price: 128, print: 'stack',
      blurb: 'The sweatshirt in its purest form. Wide rib collar, long cuffs, and a print that cracks beautifully with age.',
      specs: [['Fabric', '480 gsm loopback'], ['Print', 'Water-based, hand-pulled'], ['Fit', 'Regular']],
      colors: [['Heather', '#bcb9b2', '#1f1e1c'], ['Forest', '#2f4a3c', '#efe9dc'], ['Bone', '#e7e0d1', '#7a3b26']] },
    { id: 'threadwork-tee', name: 'Threadwork Tee', type: 'tee', price: 64, print: 'emblem',
      blurb: 'Garment-dyed graphic tee with our ring emblem. Every dye bath is a little different — so is every shirt.',
      specs: [['Fabric', '260 gsm jersey'], ['Dye', 'Garment-dyed'], ['Print', 'Discharge ink']],
      colors: [['Rust', '#a9563b', '#f4ece0'], ['Chalk', '#f3f1ec', '#a9563b'], ['Coal', '#2d2c2a', '#e3b48f']] },
    { id: 'zip-hoodie', name: 'Loop Zip Hoodie', type: 'hoodie', zip: true, price: 164, print: 'chest',
      blurb: 'Full-zip version of the Mill Hoodie with a two-way metal zip and split pocket.',
      specs: [['Fabric', '480 gsm loopback'], ['Zip', 'Two-way, matte nickel'], ['Fit', 'Boxy']],
      colors: [['Oat', '#d8cbb1', '#3b342a'], ['Slate', '#5e656d', '#ece6da'], ['Black', '#1d1d1e', '#cfc8bb']] },
    { id: 'rail-longsleeve', name: 'Rail Longsleeve', type: 'long', price: 72, print: 'sleeve',
      blurb: 'A long-sleeve tee with our rail wordmark running down the arm. Ribbed cuffs, longer body.',
      specs: [['Fabric', '260 gsm jersey'], ['Print', 'Sleeve + chest'], ['Fit', 'Relaxed']],
      colors: [['Ink', '#202125', '#efe9dc'], ['Chalk', '#f3f1ec', '#202125'], ['Wine', '#5f2b30', '#f0dccf']] },
    { id: 'pocket-tee', name: 'Pocket Tee', type: 'tee', pocket: true, price: 58, print: 'none',
      blurb: 'The Standard Tee with a bar-tacked chest pocket. Nothing to read, everything to feel.',
      specs: [['Fabric', '260 gsm jersey'], ['Pocket', 'Bar-tacked'], ['Fit', 'Relaxed']],
      colors: [['Sage', '#9ba68c'], ['Sand', '#d7c6a5'], ['Ink', '#1e1f23']] },
    { id: 'overdyed-hoodie', name: 'Overdyed Hoodie', type: 'hoodie', price: 152, print: 'slow',
      blurb: 'Dyed twice for a washed, lived-in tone from the first wear. Printed with our club mark.',
      specs: [['Fabric', '480 gsm loopback'], ['Dye', 'Double overdye'], ['Fit', 'Boxy']],
      colors: [['Washed Blue', '#6f8296', '#f3efe6'], ['Faded Black', '#3c3c3e', '#e2dccf'], ['Dusk', '#8d6f78', '#f3efe6']] },
  ];
  const SIZES = ['S', 'M', 'L', 'XL'];
  const sel = PRODUCTS.map(() => ({ ci: 0, size: 1 }));

  /* ------------------------------------------------------------------ */
  /* Garment illustration builder                                        */
  /* ------------------------------------------------------------------ */
  const BODY = {
    tee: 'M78 60 C86 72 114 72 122 60 L156 68 C166 72 172 78 176 86 L192 120 L166 132 L152 106 L153 246 C120 250 80 250 47 246 L48 106 L34 132 L8 120 L24 86 C28 78 34 72 44 68 Z',
    long: 'M76 62 C86 76 114 76 124 62 L156 70 C168 74 174 84 177 96 L190 214 L168 220 L156 122 L157 252 C120 256 80 256 43 252 L44 122 L32 220 L10 214 L23 96 C26 84 32 74 44 70 Z',
    tank: 'M72 58 L84 58 C88 94 112 94 116 58 L128 58 C129 84 140 100 154 108 L155 248 C120 252 80 252 45 248 L46 108 C60 100 71 84 72 58 Z',
  };
  const NECK = {
    tee: { front: 'M78 60 C86 72 114 72 122 60', inner: 'M78 60 C88 53 112 53 122 60 C114 72 86 72 78 60Z', rib: 'M80 64.5 C88 76.5 112 76.5 120 64.5' },
    long: { front: 'M76 62 C86 76 114 76 124 62', inner: 'M76 62 C88 54 112 54 124 62 C114 76 86 76 76 62Z', rib: 'M78 67 C88 81 112 81 122 67' },
    tank: { front: 'M84 58 C88 94 112 94 116 58', inner: 'M84 58 C92 54 108 54 116 58 C112 94 88 94 84 58Z', rib: 'M86.5 61 C90.5 91 109.5 91 113.5 61' },
  };
  const FOLDS = {
    tee: {
      d: ['M64 112 C70 150 66 196 72 244', 'M136 108 C130 150 136 200 128 244', 'M48 108 C62 118 78 116 92 130', 'M152 106 C140 118 124 118 110 132', 'M84 200 C92 214 96 230 94 246', 'M26 92 C34 104 40 112 44 124', 'M174 92 C166 104 160 112 156 124'],
      l: ['M100 84 C96 140 104 190 100 246', 'M78 140 C80 170 78 200 82 230', 'M122 150 C120 180 124 210 120 236', 'M20 104 C26 108 30 112 32 118'],
    },
    long: {
      d: ['M66 128 C72 170 66 210 72 250', 'M134 126 C128 170 134 210 128 250', 'M46 124 C62 134 78 132 92 146', 'M154 124 C140 134 122 134 108 148', 'M28 112 C24 140 30 170 24 204', 'M38 134 C40 156 34 176 36 202', 'M172 112 C176 140 170 170 176 204', 'M162 134 C160 156 166 176 164 202', 'M84 208 C92 222 96 236 94 252', 'M20 150 C28 154 34 152 40 158', 'M180 150 C172 154 166 152 160 158'],
      l: ['M100 92 C96 150 104 200 100 250', 'M78 150 C80 180 78 210 82 240', 'M122 156 C120 186 124 214 120 242', 'M20 130 C18 160 20 180 16 200', 'M180 130 C182 160 180 180 184 200'],
    },
    tank: {
      d: ['M70 120 C74 160 68 200 74 244', 'M130 120 C126 160 132 200 126 244', 'M90 150 C96 180 92 220 96 246', 'M50 112 C64 118 74 122 84 132'],
      l: ['M100 96 C97 150 103 200 100 246', 'M116 130 C114 170 118 210 114 240'],
    },
  };
  const SEAMS = {
    tee: ['M44 68 L78 60', 'M122 60 L156 68', 'M44 68 C46 82 46 96 48 106', 'M156 68 C154 82 154 96 152 106', 'M12 114 L36 125', 'M188 114 L164 125', 'M48 240 C80 244 120 244 152 240'],
    long: ['M44 70 L76 62', 'M124 62 L156 70', 'M44 70 C46 90 44 108 44 122', 'M156 70 C154 90 156 108 156 122'],
    tank: ['M75 62 C74 86 62 102 48 110', 'M125 62 C126 86 138 102 152 110', 'M46 242 C80 246 120 246 154 242'],
  };
  const HEM = 'M44 238 L156 238 L157 252 C120 256 80 256 43 252 Z';
  const CUFF_L = 'M11.1 204 L33.2 209 L32 220 L10 214 Z';
  const CUFF_R = 'M188.9 204 L166.8 209 L168 220 L190 214 Z';
  const HANGER = 'M100 44 C88 47 56 55 36 61 C30 63 30 67 36 67 L164 67 C170 67 170 63 164 61 C144 55 112 47 100 44 Z';
  const HOOK = 'M100 46 L100 30 C100 23 106 20 106 13 C106 7 101 4 96 5 C91 6 89 10 90 14';
  const TAG_FROM = { tee: [151, 108], long: [155, 124], tank: [153, 112] };

  // clip paths for folds, injected once into the shared defs
  const defs = $('#sharedDefs');
  defs.insertAdjacentHTML('beforeend', Object.keys(BODY).map((k) =>
    `<clipPath id="clip-${k}"><path d="${BODY[k]}"/></clipPath>`).join(''));

  const lum = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
  };
  const bodyOf = (p) => (p.type === 'tee' ? 'tee' : p.type === 'tank' ? 'tank' : 'long');
  const colorOf = (p, ci) => {
    const c = p.colors[ci];
    return { name: c[0], c: c[1], p: c[2] || (lum(c[1]) > 0.55 ? '#25231f' : '#efe9dc') };
  };

  let uid = 0;
  const strokeSet = (arr, attrs) => arr.map((d) => `<path d="${d}" ${attrs}/>`).join('');
  const seamAttr = 'fill="none" stroke="#000" stroke-opacity=".34" stroke-width=".7" stroke-dasharray="2.2 1.6"';

  function printSVG(p, u) {
    switch (p.print) {
      case 'arch':
        return `<path id="a${u}" d="M56 134 A44 44 0 0 1 144 134" fill="none"/>
          <text class="fp t-blk" font-size="12.5" letter-spacing="1.4"><textPath href="#a${u}" startOffset="50%" text-anchor="middle">RAIL &amp; THREAD</textPath></text>
          <path class="fp" d="M100 116.5 l2.1 4.6 5 .5 -3.8 3.3 1.1 4.9 -4.4 -2.6 -4.4 2.6 1.1 -4.9 -3.8 -3.3 5 -.5z"/>
          <text class="fp t-sans" x="100" y="146" font-size="5.4" letter-spacing="1.8" text-anchor="middle">HEAVYWEIGHT GOODS</text>
          <text class="fp t-ser" x="100" y="157" font-size="8" text-anchor="middle" font-style="italic">est. Mill Yard</text>`;
      case 'chest':
        return `<text class="fp t-ser" x="129" y="106" font-size="12" font-style="italic" text-anchor="middle">R&amp;T</text>
          <path class="sp" d="M120 110 H138" stroke-width=".7"/>`;
      case 'chestw':
        return `<text class="fp t-blk" x="130" y="124" font-size="5.2" letter-spacing=".7" text-anchor="middle">RAIL·THREAD</text>
          <text class="fp t-sans" x="130" y="131" font-size="3.4" letter-spacing="1.2" text-anchor="middle">YARD DIVISION</text>`;
      case 'stack':
        return `<text class="fp t-blk" x="100" y="128" font-size="21" text-anchor="middle" textLength="86" lengthAdjust="spacingAndGlyphs">HEAVY</text>
          <text class="fp t-blk" x="100" y="150" font-size="21" text-anchor="middle" textLength="86" lengthAdjust="spacingAndGlyphs">WEIGHT</text>
          <path class="sp" d="M58 157 H142" stroke-width=".8"/>
          <text class="fp t-sans" x="100" y="166" font-size="5" letter-spacing="2" text-anchor="middle">NO. 480 — GSM</text>`;
      case 'emblem':
        return `<circle cx="100" cy="134" r="27" fill="none" class="sp" stroke-width="1.4"/>
          <circle cx="100" cy="134" r="18.5" fill="none" class="sp" stroke-width=".7"/>
          <path id="e${u}" d="M100 111.6 a22.4 22.4 0 1 1 -.01 0" fill="none"/>
          <text class="fp t-sans" font-size="5.2" letter-spacing="1.5" dy="1.8"><textPath href="#e${u}">THREADWORK · SLOW CLOTH ·</textPath></text>
          <text class="fp t-ser" x="100" y="140" font-size="18" text-anchor="middle" font-style="italic">tw</text>`;
      case 'slow':
        return `<text class="fp t-ser" x="100" y="128" font-size="27" font-style="italic" text-anchor="middle">Slow</text>
          <text class="fp t-blk" x="100" y="144" font-size="10" letter-spacing="1.4" text-anchor="middle">CLOTH CLUB</text>
          <text class="fp t-sans" x="100" y="153" font-size="4.4" letter-spacing="1.5" text-anchor="middle">MEMBERS — RAIL &amp; THREAD</text>`;
      case 'sleeve':
        return `<text class="fp t-ser" x="129" y="106" font-size="11" font-style="italic" text-anchor="middle">R&amp;T</text>
          <text class="fp t-blk" font-size="5" letter-spacing="1.4" transform="translate(163 106) rotate(84)">RAIL — THREAD — 26</text>`;
      default:
        return '';
    }
  }

  /**
   * Build a garment SVG. Colours come from CSS custom properties (--c, --p),
   * so recolouring is a single style change (and animatable via @property).
   */
  function garmentSVG(p, ci, opt = {}) {
    const { hanger = true, tag = true } = opt;
    const u = ++uid;
    const b = bodyOf(p);
    const col = colorOf(p, ci);
    const N = NECK[b];
    const F = FOLDS[b];
    const hoodie = p.type === 'hoodie';
    const ribbed = hoodie || p.type === 'crew';

    // back layer: neck interior or hood
    let back;
    if (hoodie) {
      back = `<path class="fc" d="M66 72 C56 44 76 28 100 28 C124 28 144 44 134 72 C120 64 80 64 66 72Z"/>
        <path d="M66 72 C56 44 76 28 100 28 C124 28 144 44 134 72 C120 64 80 64 66 72Z" fill="url(#shX)"/>
        <path d="M66 72 C56 44 76 28 100 28 C124 28 144 44 134 72" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="2.2" filter="url(#fsoft)"/>
        <path d="M70 68 C62 46 78 33 100 33 C122 33 138 46 130 68" ${seamAttr}/>
        <path class="fc" d="M80 64 C80 45 120 45 120 64 C112 74 88 74 80 64Z"/>
        <path d="M80 64 C80 45 120 45 120 64 C112 74 88 74 80 64Z" fill="#000" opacity=".5"/>`;
    } else {
      back = `<path class="fc" d="${N.inner}"/><path d="${N.inner}" fill="#000" opacity=".42"/>`;
    }

    const hangerSVG = hanger ? `<g class="hanger">
        <path d="${HOOK}" fill="none" stroke="#83878c" stroke-width="2.6" stroke-linecap="round"/>
        <path d="${HOOK}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width=".8" stroke-linecap="round" transform="translate(-.5 -.5)"/>
        <path d="M100 44 V54" stroke="#83878c" stroke-width="2.6"/>
        <g transform="translate(100 54) scale(.94 1) translate(-100 -46)">
          <path d="${HANGER}" fill="url(#wood)"/>
          <path d="M38 62.5 C60 56 88 49 100 46.5 C112 49 140 56 162 62.5" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width=".8"/>
          <circle cx="100" cy="46" r="2.4" fill="#7e5a39"/></g></g>` : '';

    let f = `<path class="fc" d="${BODY[b]}"/>`;
    // ribbed hem + cuffs
    if (ribbed) {
      f += `<path class="fc" d="${HEM}"/><path d="${HEM}" fill="url(#rib)"/>`;
    }
    if (ribbed || p.type === 'jacket' || p.type === 'long') {
      f += `<path d="${CUFF_L}" fill="url(#rib)"/><path d="${CUFF_R}" fill="url(#rib)"/>`;
    }
    // neck finish
    if (p.type === 'crew') {
      f += `<path class="sc" d="${N.front}" fill="none" stroke-width="8"/><path d="${N.front}" fill="none" stroke="#000" stroke-opacity=".16" stroke-width="8" stroke-dasharray=".9 1.5"/>`;
    } else if (hoodie) {
      f += `<path class="sc" d="${N.front}" fill="none" stroke-width="5"/><path d="${N.front}" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="5"/>`;
    } else if (p.type !== 'jacket') {
      const w = p.type === 'tank' ? 3 : 4.6;
      f += `<path class="sc" d="${N.front}" fill="none" stroke-width="${w}"/><path d="${N.front}" fill="none" stroke="#000" stroke-opacity=".14" stroke-width="${w}" stroke-dasharray=".8 1.4"/>`;
    }
    // pockets
    if (hoodie && !p.zip) {
      const P = 'M60 174 L140 174 C144 196 148 214 152 236 L48 236 C52 214 56 196 60 174Z';
      f += `<path class="fc" d="${P}"/><path d="${P}" fill="url(#gloss)"/>
        <path d="M60 174 C56 196 52 214 48 236" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="2.2"/>
        <path d="M140 174 C144 196 148 214 152 236" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="2.2"/>
        <path d="M62 178 L138 178" ${seamAttr}/>`;
    } else if (hoodie && p.zip) {
      const L = 'M58 176 L97 176 L97 236 L48 236 C52 214 55 196 58 176Z';
      const R = 'M142 176 L103 176 L103 236 L152 236 C148 214 145 196 142 176Z';
      f += `<path class="fc" d="${L}"/><path d="${L}" fill="url(#gloss)"/><path class="fc" d="${R}"/><path d="${R}" fill="url(#gloss)"/>
        <path d="M58 176 C55 196 52 214 48 236 M142 176 C145 196 148 214 152 236" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="2.2"/>
        <path d="M60 180 H95 M105 180 H140" ${seamAttr}/>`;
    } else if (p.pocket) {
      const P = 'M114 98 H138 V121 C132 124 120 124 114 121 Z';
      f += `<path class="fc" d="${P}"/><path d="${P}" fill="url(#gloss)"/><path d="M114 98 H138" fill="none" stroke="#000" stroke-opacity=".3" stroke-width="1"/>
        <path d="M115.5 101 H136.5 M115.5 99.5 V120 M136.5 99.5 V120" ${seamAttr}/>`;
    }
    f += `<g class="prt" opacity=".93">${printSVG(p, u)}</g>`;
    // folds (blurred, clipped to the body) + shading
    f += `<g clip-path="url(#clip-${b})"><g filter="url(#fsoft)">
        ${strokeSet(F.d, 'fill="none" stroke="#000" stroke-opacity=".17" stroke-width="6" stroke-linecap="round"')}
        ${strokeSet(F.l, 'fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="7" stroke-linecap="round"')}
      </g></g>
      <path d="${BODY[b]}" fill="url(#knit)"/>
      <path d="${BODY[b]}" fill="url(#shX)"/>
      <path d="${BODY[b]}" fill="url(#shY)"/>
      <path d="${BODY[b]}" fill="none" stroke="#000" stroke-opacity=".2" stroke-width=".8" stroke-linejoin="round"/>`;
    // stitched seams
    f += strokeSet(SEAMS[b], seamAttr);
    f += `<path d="${N.rib}" ${seamAttr}/>`;
    if (ribbed) f += `<path d="M44 238 H156" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="1"/>`;
    if (ribbed || p.type === 'jacket' || p.type === 'long') {
      f += `<path d="M11.1 204 L33.2 209 M188.9 204 L166.8 209" fill="none" stroke="#000" stroke-opacity=".25" stroke-width=".9"/>`;
    }
    if (p.type === 'long') f += `<path d="M43.5 246 C80 250 120 250 156.5 246" ${seamAttr}/>`;
    // hoodie extras
    if (hoodie) {
      f += `<circle cx="91" cy="77" r="1.8" fill="#9a9da1" stroke="#5e6164" stroke-width=".4"/><circle cx="109" cy="77" r="1.8" fill="#9a9da1" stroke="#5e6164" stroke-width=".4"/>`;
      if (!p.zip) {
        f += `<path class="sc" d="M91 77 C90 94 92 110 89 128" fill="none" stroke-width="2.2" stroke-linecap="round"/>
          <path class="sc" d="M109 77 C111 95 108 110 111 122" fill="none" stroke-width="2.2" stroke-linecap="round"/>
          <path d="M91 77 C90 94 92 110 89 128 M109 77 C111 95 108 110 111 122" fill="none" stroke="#000" stroke-opacity=".18" stroke-width="2.2"/>
          <path d="M90.6 78 C89.6 94 91.6 110 88.6 127 M108.6 78 C110.6 95 107.6 110 110.6 121" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width=".7"/>
          <path d="M89 128 L88.6 134 M111 122 L111.4 128" stroke="#a6a9ad" stroke-width="2.6" stroke-linecap="round"/>`;
      } else {
        f += `<path d="M100 75 V251" stroke="#000" stroke-opacity=".28" stroke-width="4.4"/>
          <path d="M100 75 V251" stroke="#b9babb" stroke-width="2.6" stroke-dasharray="1 1.1"/>
          <rect x="97.4" y="82" width="5.2" height="10" rx="1.5" fill="#cfd0d1" stroke="#6b6d70" stroke-width=".5"/>
          <rect x="98.8" y="91" width="2.4" height="7" rx="1" fill="#a8aaad"/>`;
      }
    }
    // jacket extras
    if (p.type === 'jacket') {
      const CL = 'M76 62 L58 70 L86 104 L100 84 Z';
      const CR = 'M124 62 L142 70 L114 104 L100 84 Z';
      f += `<path d="M100 84 V252" stroke="#000" stroke-opacity=".3" stroke-width="1.1"/>
        <path d="M103 86 V251" ${seamAttr}/>
        ${[112, 140, 168, 196, 224].map((y) => `<circle cx="100" cy="${y}" r="3.1" fill="#bfc1c3" stroke="#5e6164" stroke-width=".5"/><circle cx="99" cy="${y - 1}" r="1" fill="#fff" opacity=".7"/>`).join('')}
        <path class="fc" d="${CL}"/><path d="${CL}" fill="url(#gloss)"/><path d="${CL}" fill="#000" opacity=".06"/>
        <path class="fc" d="${CR}"/><path d="${CR}" fill="url(#gloss)"/><path d="${CR}" fill="#000" opacity=".1"/>
        <path d="M60.5 71 L86 101.5 M139.5 71 L114 101.5" ${seamAttr}/>
        <path d="${CL} ${CR}" fill="none" stroke="#000" stroke-opacity=".22" stroke-width=".7"/>
        <path d="M44 243 C80 247 120 247 157 243" ${seamAttr}/>
`;
    }
    // hanging price tag
    if (tag) {
      const [sx, sy] = TAG_FROM[b];
      const tx = sx + 8; const ty = sy + 38;
      f += `<g class="tag"><path d="M${sx} ${sy} C${sx + 6} ${sy + 12} ${tx - 3} ${ty - 16} ${tx} ${ty + 3}" fill="none" stroke="#8f887c" stroke-width=".6"/>
        <g transform="translate(${tx} ${ty}) rotate(-7)">
          <path d="M-10 4 L-6 0 H6 L10 4 V34 H-10 Z" fill="#fbf9f4" stroke="#000" stroke-opacity=".14" stroke-width=".5"/>
          <path d="M-10 26 H10 V34 H-10 Z" fill="#000" opacity=".04"/>
          <circle cy="4" r="1.5" fill="#cfc9bd"/>
          <text y="13" font-size="3.6" text-anchor="middle" class="t-sans" fill="#6f6a62" letter-spacing=".6">R&amp;T</text>
          <text y="23.5" font-size="6.4" text-anchor="middle" class="t-blk" fill="#171614">$${p.price}</text>
          <text y="31" font-size="2.8" text-anchor="middle" class="t-sans" fill="#6f6a62" letter-spacing=".5">HEAVY · 26</text>
        </g></g>`;
    }

    return `<svg class="g-svg" viewBox="0 0 200 280" aria-hidden="true" focusable="false" style="--c:${col.c};--p:${col.p}">
      <g class="cloth">${back}</g>${hangerSVG}<g class="cloth">${f}</g></svg>`;
  }

  // font helpers for the svg <text> elements
  document.head.insertAdjacentHTML('beforeend', `<style>
    .fc{fill:var(--c)} .sc{stroke:var(--c)} .fp{fill:var(--p)} .sp{stroke:var(--p);fill:none}
    .t-blk{font-family:'Archivo Black',Impact,sans-serif} .t-sans{font-family:'Inter Tight',sans-serif;font-weight:600}
    .t-ser{font-family:'Instrument Serif',serif}
  </style>`);

  /* ------------------------------------------------------------------ */
  /* Rail                                                                */
  /* ------------------------------------------------------------------ */
  const viewport = $('#railViewport');
  const track = $('#railTrack');
  const sheen = $('#sheen');
  const bgWord = $('#bgWord');
  const progress = $('#railProgress');
  const hint = $('#railHint');
  $('#pieceCount').textContent = PRODUCTS.length;

  track.innerHTML = PRODUCTS.map((p, i) => `
    <button type="button" class="garment" data-i="${i}" aria-label="${p.name}, ${TYPE_LABEL[p.type]}, ${money(p.price)}. View details">
      <div class="sway">${garmentSVG(p, 0)}</div>
      <span class="g-label">${p.name}<b>${money(p.price)}</b></span>
    </button>`).join('');

  const items = $$('.garment', track).map((el, i) => ({
    el, i, sway: $('.sway', el), svg: $('.g-svg', el),
    th: 0, om: 0, left: 0, w: 0, h: 0,
    w2: 11 * (0.84 + ((i * 37) % 10) / 30), // natural frequency² varies per garment
  }));

  const S = {
    x: 0, vx: 0, prevX: 0, prevV: 0, a: 0,
    minX: 0, maxX: 0, vw: 0,
    down: false, dragging: false, justDragged: false, tween: null,
    startX: 0, startY: 0, startRail: 0, samples: [],
    sx: 0, sxT: 0, top: 0,
    locked: false,
  };
  const FRICTION = 3.4; // exponential decay per second

  function measure() {
    S.vw = viewport.clientWidth;
    S.minX = Math.min(0, S.vw - track.offsetWidth);
    S.maxX = 0;
    S.top = track.offsetTop;
    items.forEach((it) => { it.left = it.el.offsetLeft; it.w = it.el.offsetWidth; it.h = it.el.offsetHeight; });
    if (!S.tween) S.x = clamp(S.x, S.minX, S.maxX);
    S.sxT = S.vw * 0.32;
    render();
  }

  function render() {
    track.style.transform = `translate3d(${S.x.toFixed(2)}px,0,0)`;
    bgWord.style.transform = `translate3d(${(S.x * 0.16).toFixed(2)}px,-50%,0)`;
    sheen.style.transform = `translate3d(${S.sx.toFixed(1)}px,0,0)`;
    const range = S.maxX - S.minX;
    const prog = range > 0 ? (S.maxX - S.x) / range : 0;
    const vis = range > 0 ? clamp(S.vw / (S.vw + range), 0.12, 1) : 1;
    progress.style.transform = `translateX(${(clamp(prog, 0, 1) * (1 - vis) * 100).toFixed(2)}%) scaleX(${vis.toFixed(3)})`;
  }

  let heroVisible = true;
  let raf = 0;
  let last = 0;
  function wake() {
    if (!raf && heroVisible) { last = performance.now(); raf = requestAnimationFrame(tick); }
  }

  function tick(t) {
    raf = 0;
    let dt = (t - last) / 1000;
    last = t;
    dt = clamp(dt, 1 / 240, 1 / 30);

    // momentum + rubber band
    let out = false;
    if (!S.dragging && !S.tween && !S.locked) {
      S.x += S.vx * dt;
      S.vx *= Math.exp(-FRICTION * dt);
      if (S.x > S.maxX || S.x < S.minX) {
        out = true;
        const bound = S.x > S.maxX ? S.maxX : S.minX;
        S.x += (bound - S.x) * (1 - Math.exp(-9 * dt));
        S.vx *= Math.exp(-14 * dt);
        if (Math.abs(bound - S.x) < 0.3) { S.x = bound; out = false; }
      }
      if (Math.abs(S.vx) < 2) S.vx = 0;
    }

    // rail kinematics feed the pendulums
    const v = (S.x - S.prevX) / dt;
    const acc = (v - S.prevV) / dt;
    S.a += (clamp(acc, -7000, 7000) - S.a) * 0.35;
    S.prevX = S.x; S.prevV = v;
    const vC = clamp(v, -3200, 3200);

    let swinging = false;
    for (const it of items) {
      if (RM) { it.th = 0; it.om = 0; continue; }
      const alpha = -it.w2 * Math.sin(it.th) - 1.05 * it.om + S.a * 0.00042 + vC * 0.00085;
      it.om += alpha * dt;
      it.th = clamp(it.th + it.om * dt, -0.6, 0.6);
      if (Math.abs(it.th) > 0.0006 || Math.abs(it.om) > 0.002) swinging = true;
      it.sway.style.transform = `rotate(${it.th.toFixed(4)}rad)`;
    }

    // sheen follows the pointer lazily
    S.sx += (S.sxT - S.sx) * (1 - Math.exp(-5 * dt));
    const sheenMoving = Math.abs(S.sxT - S.sx) > 0.5;

    render();
    if (S.dragging || S.tween || out || S.vx !== 0 || swinging || sheenMoving || Math.abs(v) > 0.5) {
      raf = requestAnimationFrame(tick);
    }
  }

  function nudge(dir, count = 2) {
    const step = (items[1].left - items[0].left) || 220;
    const target = clamp(S.x - dir * step * count, S.minX, S.maxX);
    S.vx = (target - S.x) * FRICTION;
    hideHint();
    wake();
  }

  function hideHint() { hint.classList.add('gone'); }

  // drag
  viewport.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || S.locked) return;
    S.down = true; S.dragging = false;
    S.startX = e.clientX; S.startY = e.clientY; S.startRail = S.x;
    S.samples = [{ t: e.timeStamp, x: S.x }];
    S.vx = 0;
    if (S.tween) { S.tween.kill(); S.tween = null; }
  });
  viewport.addEventListener('pointermove', (e) => {
    if (!S.down) return;
    const dx = e.clientX - S.startX;
    const dy = e.clientY - S.startY;
    if (!S.dragging) {
      if (Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) {
        S.dragging = true;
        viewport.setPointerCapture(e.pointerId);
        viewport.classList.add('grabbing');
        hideHint();
        S.startX = e.clientX; S.startRail = S.x;
      } else if (Math.abs(dy) > 10) { S.down = false; }
      return;
    }
    let target = S.startRail + (e.clientX - S.startX);
    if (target > S.maxX) target = S.maxX + (target - S.maxX) * 0.35;
    if (target < S.minX) target = S.minX + (target - S.minX) * 0.35;
    S.x = target;
    S.samples.push({ t: e.timeStamp, x: S.x });
    if (S.samples.length > 8) S.samples.shift();
    wake();
  });
  const endDrag = () => {
    if (S.dragging) {
      const now = S.samples[S.samples.length - 1];
      let first = S.samples[0];
      for (const s of S.samples) if (now.t - s.t < 90) { first = s; break; }
      const dt = (now.t - first.t) / 1000;
      S.vx = dt > 0 ? clamp((now.x - first.x) / dt, -5200, 5200) : 0;
      S.justDragged = true;
      setTimeout(() => { S.justDragged = false; }, 60);
      viewport.classList.remove('grabbing');
    }
    S.down = false; S.dragging = false;
    wake();
  };
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);
  viewport.addEventListener('lostpointercapture', endDrag);
  viewport.addEventListener('click', (e) => {
    if (S.justDragged) { e.stopPropagation(); e.preventDefault(); }
  }, true);

  // horizontal wheel / trackpad
  viewport.addEventListener('wheel', (e) => {
    if (S.locked) return;
    const horiz = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    if (!horiz && !e.shiftKey) return;
    e.preventDefault();
    const d = horiz ? e.deltaX : e.deltaY;
    if (S.tween) { S.tween.kill(); S.tween = null; }
    S.x = clamp(S.x - d, S.minX - 60, S.maxX + 60);
    S.vx = 0;
    hideHint();
    wake();
  }, { passive: false });

  // cursor brushing past the garments
  let lastMove = null;
  const hero = $('.hero');
  hero.addEventListener('pointermove', (e) => {
    const vr = viewport.getBoundingClientRect();
    S.sxT = e.clientX - vr.left;
    if (lastMove && !S.dragging && !S.locked && !RM) {
      const dtm = Math.max(8, e.timeStamp - lastMove.t) / 1000;
      const mvx = clamp((e.clientX - lastMove.x) / dtm, -4000, 4000);
      const pivotY = vr.top + S.top + 5;
      for (const it of items) {
        const cx = vr.left + S.x + it.left + it.w / 2;
        const rel = (e.clientY - pivotY) / it.h;
        if (Math.abs(e.clientX - cx) < it.w * 0.42 && rel > 0.15 && rel < 1) {
          it.om = clamp(it.om - mvx * 0.00055 * rel, -3, 3);
        }
      }
    }
    lastMove = { t: e.timeStamp, x: e.clientX };
    wake();
  });
  hero.addEventListener('pointerleave', () => { lastMove = null; S.sxT = S.vw * 0.32; wake(); });

  $('#prevBtn').addEventListener('click', () => nudge(-1));
  $('#nextBtn').addEventListener('click', () => nudge(1));
  viewport.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); nudge(1, 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); nudge(-1, 1); }
  });

  items.forEach((it) => {
    it.el.addEventListener('focus', () => {
      if (!it.el.matches(':focus-visible') || S.locked) return;
      const sx = S.x + it.left;
      if (sx < 24 || sx + it.w > S.vw - 24) {
        const target = clamp(S.vw / 2 - it.left - it.w / 2, S.minX, S.maxX);
        S.vx = (target - S.x) * FRICTION;
        wake();
      }
    });
    it.el.addEventListener('click', () => openProduct(it.i));
  });

  // pause the loop when the hero is offscreen
  new IntersectionObserver((entries) => {
    heroVisible = entries[0].isIntersecting;
    if (heroVisible) wake();
  }).observe(viewport);

  window.addEventListener('resize', () => { measure(); wake(); });

  /* ------------------------------------------------------------------ */
  /* Product view                                                        */
  /* ------------------------------------------------------------------ */
  const stage = $('#stage');
  const panel = $('#panel');
  const page = [$('main'), $('.nav'), $('.site-foot')];
  let view = null; // { i, fly, origin }

  const setInert = (on) => page.forEach((el) => { if (on) el.setAttribute('inert', ''); else el.removeAttribute('inert'); });

  function targetRect() {
    const vw = window.innerWidth; const vh = window.innerHeight;
    if (vw > 900) {
      const areaW = vw - panel.offsetWidth;
      const h = Math.min(vh * 0.8, areaW * 0.82 * 1.4, 760);
      return { w: h / 1.4, h, cx: areaW / 2, cy: vh / 2 + 18 };
    }
    const areaH = vh - panel.offsetHeight;
    const h = Math.min(areaH * 0.94, vw * 0.8 * 1.4);
    return { w: h / 1.4, h, cx: vw / 2, cy: areaH / 2 + 10 };
  }

  function originRect(it) {
    const prev = it.sway.style.transform;
    it.sway.style.transform = 'none';
    const r = it.svg.getBoundingClientRect();
    it.sway.style.transform = prev;
    return r;
  }

  function openProduct(i) {
    if (view) return;
    const it = items[i];
    const p = PRODUCTS[i];
    S.vx = 0; S.locked = true;
    if (S.tween) { S.tween.kill(); S.tween = null; }
    measure();
    const r = originRect(it);
    const T = targetRect();

    const fly = document.createElement('div');
    fly.className = 'fly';
    fly.innerHTML = `<div class="float">${garmentSVG(p, sel[i].ci, { hanger: false, tag: false })}</div>`;
    Object.assign(fly.style, { left: `${T.cx - T.w / 2}px`, top: `${T.cy - T.h / 2}px`, width: `${T.w}px`, height: `${T.h}px` });
    stage.appendChild(fly);

    const s0 = r.height / T.h;
    const dx = r.left + r.width / 2 - T.cx;
    const dy = r.top + r.height / 2 - T.cy;
    view = { i, fly };

    it.el.classList.add('is-lifted');
    it.om += 1.4; // the empty hanger swings once the garment is lifted
    wake();

    fillPanel(i);
    document.body.classList.add('viewing', 'locked');
    setInert(true);
    panel.removeAttribute('inert');
    panel.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => panel.classList.add('open'));

    if (G && !RM) {
      G.set(fly, { x: dx, y: dy, scale: s0, rotation: it.th * 57.3 });
      G.timeline()
        .to(fly, { y: dy - 26, rotation: -2.5, scale: s0 * 1.04, duration: 0.3, ease: 'power2.out' })
        .to(fly, { x: 0, y: 0, scale: 1, rotation: 0, duration: 0.95, ease: 'expo.inOut' })
        .add(() => {
          view.floatTw = G.to(fly.firstElementChild, { y: -8, rotation: 0.8, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1, transformOrigin: '50% 0%' });
        });
    } else if (G) {
      G.fromTo(fly, { opacity: 0 }, { opacity: 1, duration: 0.2 });
    }
    setTimeout(() => $('#panelClose').focus({ preventScroll: true }), 80);
  }

  function closeProduct() {
    if (!view) return;
    const { i, fly, floatTw } = view;
    const it = items[i];
    const done = () => {
      fly.remove();
      it.el.classList.remove('is-lifted');
      it.om -= 1.1; // settles back onto the hanger with a swing
      S.locked = false;
      view = null;
      wake();
    };
    if (floatTw) floatTw.kill();
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    panel.setAttribute('inert', '');
    document.body.classList.remove('viewing', 'locked');
    setInert(false);
    it.el.focus({ preventScroll: true });

    if (G && !RM) {
      const r = originRect(it);
      const fr = { cx: parseFloat(fly.style.left) + parseFloat(fly.style.width) / 2, cy: parseFloat(fly.style.top) + parseFloat(fly.style.height) / 2, h: parseFloat(fly.style.height) };
      G.to(fly.firstElementChild, { y: 0, rotation: 0, duration: 0.3 });
      G.timeline({ onComplete: done })
        .to(fly, { x: r.left + r.width / 2 - fr.cx, y: r.top + r.height / 2 - fr.cy - 18, scale: r.height / fr.h, rotation: 2, duration: 0.85, ease: 'expo.inOut' })
        .to(fly, { y: r.top + r.height / 2 - fr.cy, rotation: 0, duration: 0.22, ease: 'power2.in' });
    } else {
      done();
    }
  }

  const pEls = {
    eyebrow: $('#pEyebrow'), name: $('#pName'), price: $('#pPrice'), blurb: $('#pBlurb'),
    colorName: $('#pColorName'), swatches: $('#pSwatches'), sizes: $('#pSizes'), sizeName: $('#pSizeName'),
    specs: $('#pSpecs'), add: $('#addBtn'), addLabel: $('#addLabel'),
  };

  function fillPanel(i) {
    const p = PRODUCTS[i];
    pEls.eyebrow.textContent = `No. ${String(i + 1).padStart(2, '0')} — ${TYPE_LABEL[p.type]}`;
    pEls.name.textContent = p.name;
    pEls.price.textContent = money(p.price);
    pEls.blurb.textContent = p.blurb;
    pEls.specs.innerHTML = p.specs.map(([k, v]) => `<li><span>${k}</span><span>${v}</span></li>`).join('') +
      '<li><span>Repairs</span><span>Free, for life</span></li>';
    pEls.swatches.innerHTML = p.colors.map((c, ci) =>
      `<button type="button" class="swatch" role="radio" aria-checked="${ci === sel[i].ci}" aria-label="${c[0]}" data-ci="${ci}" style="--sw:${c[1]}"></button>`).join('');
    pEls.add.classList.remove('done');
    pEls.addLabel.textContent = `Add to cart — ${money(p.price)}`;
    syncColor(i); syncSize(i);
  }

  function syncColor(i) {
    const p = PRODUCTS[i];
    const col = colorOf(p, sel[i].ci);
    pEls.colorName.textContent = col.name;
    $$('.swatch', pEls.swatches).forEach((b) => b.setAttribute('aria-checked', String(+b.dataset.ci === sel[i].ci)));
    const svgs = [items[i].svg];
    if (view && view.fly) svgs.push($('.g-svg', view.fly));
    svgs.forEach((s) => { s.style.setProperty('--c', col.c); s.style.setProperty('--p', col.p); });
    items[i].el.setAttribute('aria-label', `${p.name}, ${TYPE_LABEL[p.type]}, ${col.name}, ${money(p.price)}. View details`);
  }
  function syncSize(i) {
    const si = sel[i].size;
    $('.size-ind', pEls.sizes).style.setProperty('--si', si);
    $$('button', pEls.sizes).forEach((b) => b.setAttribute('aria-checked', String(+b.dataset.size === si)));
    pEls.sizeName.textContent = SIZES[si];
  }

  pEls.swatches.addEventListener('click', (e) => {
    const b = e.target.closest('.swatch');
    if (!b || !view) return;
    sel[view.i].ci = +b.dataset.ci;
    syncColor(view.i);
    if (G && !RM) G.fromTo(view.fly, { rotation: -1.5 }, { rotation: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)' });
  });
  pEls.sizes.addEventListener('click', (e) => {
    const b = e.target.closest('button');
    if (!b || !view) return;
    sel[view.i].size = +b.dataset.size;
    syncSize(view.i);
  });
  const radioKeys = (group) => group.addEventListener('keydown', (e) => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) return;
    const btns = $$('[role="radio"]', group);
    const idx = btns.indexOf(document.activeElement);
    if (idx < 0) return;
    e.preventDefault();
    const n = btns[(idx + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : btns.length - 1)) % btns.length];
    n.focus(); n.click();
  });
  radioKeys(pEls.swatches); radioKeys(pEls.sizes);

  let addTimer = 0;
  pEls.add.addEventListener('click', () => {
    if (!view || pEls.add.classList.contains('done')) return;
    const i = view.i;
    addToCart(i, sel[i].ci, sel[i].size);
    pEls.add.classList.add('done');
    pEls.add.setAttribute('aria-label', 'Added to cart');
    clearTimeout(addTimer);
    addTimer = setTimeout(() => { pEls.add.classList.remove('done'); pEls.add.removeAttribute('aria-label'); }, 1800);
  });

  $('#panelClose').addEventListener('click', closeProduct);
  $('#stageBackdrop').addEventListener('click', closeProduct);
  $('#panelCart').addEventListener('click', () => openDrawer($('#panelCart')));

  /* ------------------------------------------------------------------ */
  /* Cart                                                                */
  /* ------------------------------------------------------------------ */
  const cart = [];
  const drawer = $('#drawer');
  const overlay = $('#drawerOverlay');
  const listEl = $('#cartList');
  const subEl = $('#subtotal');
  let lastKey = null;
  let drawerOpener = null;

  function addToCart(i, ci, size) {
    const key = `${i}|${ci}|${size}`;
    const row = cart.find((r) => r.key === key);
    if (row) row.qty += 1; else cart.push({ key, i, ci, size, qty: 1 });
    lastKey = key;
    renderCart();
    const c = $('#cartCount');
    c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
    toast(`${PRODUCTS[i].name} — ${colorOf(PRODUCTS[i], ci).name}, ${SIZES[size]} added`);
  }

  let shown = 0; let subRaf = 0;
  function animateSubtotal(to) {
    cancelAnimationFrame(subRaf);
    const from = shown; const t0 = performance.now(); const D = RM ? 1 : 750;
    const step = (t) => {
      const k = Math.min(1, (t - t0) / D);
      shown = from + (to - from) * (1 - Math.pow(1 - k, 4));
      subEl.textContent = money(shown);
      if (k < 1) subRaf = requestAnimationFrame(step);
    };
    subRaf = requestAnimationFrame(step);
  }

  function renderCart() {
    const count = cart.reduce((n, r) => n + r.qty, 0);
    const total = cart.reduce((n, r) => n + r.qty * PRODUCTS[r.i].price, 0);
    $('#cartCount').textContent = count;
    $('#panelCartCount').textContent = count;
    $('#cartTitleCount').textContent = `(${count})`;
    $('#cartBtn').setAttribute('aria-label', `Open cart, ${count} item${count === 1 ? '' : 's'}`);
    listEl.innerHTML = cart.map((r) => {
      const p = PRODUCTS[r.i]; const col = colorOf(p, r.ci);
      return `<li class="cart-item${r.key === lastKey ? ' new' : ''}" data-key="${r.key}">
        <div class="thumb">${garmentSVG(p, r.ci, { hanger: false, tag: false })}</div>
        <div><p class="ci-name">${p.name}</p><p class="ci-meta">${col.name} · ${SIZES[r.size]}</p>
          <div class="qty"><button type="button" data-act="dec" aria-label="Decrease quantity of ${p.name}">−</button><span>${r.qty}</span><button type="button" data-act="inc" aria-label="Increase quantity of ${p.name}">+</button></div></div>
        <div class="ci-right"><span class="ci-price">${money(p.price * r.qty)}</span><button type="button" class="remove" data-act="rm">Remove</button></div>
      </li>`;
    }).join('');
    lastKey = null;
    $('#cartEmpty').hidden = cart.length > 0;
    listEl.hidden = cart.length === 0;
    $('#checkoutBtn').disabled = cart.length === 0;
    const left = 200 - total;
    $('#shipNote').textContent = total === 0 ? 'Free shipping on orders over $200'
      : left > 0 ? `${money(left)} away from free shipping` : 'Free shipping unlocked';
    $('#shipFill').style.transform = `scaleX(${clamp(total / 200, 0, 1)})`;
    animateSubtotal(total);
  }

  listEl.addEventListener('click', (e) => {
    const b = e.target.closest('button[data-act]');
    if (!b) return;
    const li = b.closest('.cart-item');
    const idx = cart.findIndex((r) => r.key === li.dataset.key);
    if (idx < 0) return;
    const act = b.dataset.act;
    if (act === 'inc') cart[idx].qty += 1;
    if (act === 'dec') cart[idx].qty -= 1;
    if (act === 'rm' || cart[idx].qty <= 0) cart.splice(idx, 1);
    renderCart();
    const again = listEl.querySelector(`[data-key="${li.dataset.key}"] [data-act="${act}"]`);
    (again || $('#drawerClose')).focus();
  });

  function openDrawer(opener) {
    drawerOpener = opener || document.activeElement;
    drawer.classList.add('open'); overlay.classList.add('open');
    drawer.removeAttribute('inert'); drawer.setAttribute('aria-hidden', 'false');
    panel.setAttribute('inert', '');
    setInert(true);
    document.body.classList.add('locked');
    setTimeout(() => $('#drawerClose').focus({ preventScroll: true }), 60);
  }
  function closeDrawer() {
    if (!drawer.classList.contains('open')) return;
    drawer.classList.remove('open'); overlay.classList.remove('open');
    drawer.setAttribute('inert', ''); drawer.setAttribute('aria-hidden', 'true');
    if (view) { panel.removeAttribute('inert'); } else { setInert(false); document.body.classList.remove('locked'); }
    if (drawerOpener) drawerOpener.focus({ preventScroll: true });
  }
  $('#cartBtn').addEventListener('click', () => openDrawer($('#cartBtn')));
  $('#drawerClose').addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
  $('#browseBtn').addEventListener('click', () => {
    closeDrawer();
    if (view) closeProduct();
    $('#rail').scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'center' });
  });
  $('#checkoutBtn').addEventListener('click', () => toast('Portfolio demo — checkout is switched off.'));

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (drawer.classList.contains('open')) closeDrawer();
    else if (view) closeProduct();
  });

  let toastT = 0;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), 2400);
  }

  /* ------------------------------------------------------------------ */
  /* Lookbook                                                            */
  /* ------------------------------------------------------------------ */
  const LOOKS = [
    { cap: 'Mill Hoodie', sub: 'Bone', bg: ['#e9e3d7', '#d6cdbd'], peg: true, items: [{ p: 0, c: 0, x: 50, y: 10, w: 62, hanger: true }] },
    { cap: 'Standard + Threadwork', sub: 'Ink / Rust', bg: ['#dcd2c6', '#c7b9a9'], items: [{ p: 1, c: 1, x: 37, y: 20, w: 52, r: -9 }, { p: 5, c: 0, x: 63, y: 25, w: 52, r: 7 }] },
    { cap: 'Coach over Longsleeve', sub: 'Navy / Chalk', bg: ['#d4d7d3', '#bec3be'], items: [{ p: 7, c: 1, x: 60, y: 19, w: 54, r: 5 }, { p: 2, c: 0, x: 43, y: 14, w: 60, r: -3 }] },
    { cap: 'Heavy Crew + Rib Tank', sub: 'Forest / Ecru', bg: ['#e4ddcf', '#d0c6b2'], items: [{ p: 3, c: 0, x: 66, y: 24, w: 44, r: 7 }, { p: 4, c: 1, x: 42, y: 17, w: 58, r: -4 }] },
    { cap: 'Overdyed Hoodie', sub: 'Washed Blue', bg: ['#d0d6db', '#b9c1c9'], peg: true, items: [{ p: 9, c: 0, x: 50, y: 10, w: 62, hanger: true }] },
    { cap: 'Loop Zip + Pocket Tee', sub: 'Oat / Sage', bg: ['#e2dccd', '#cfc5ae'], items: [{ p: 8, c: 0, x: 64, y: 24, w: 50, r: 6 }, { p: 6, c: 0, x: 40, y: 15, w: 58, r: -5 }] },
  ];
  const lookTrack = $('#lookTrack');
  lookTrack.innerHTML = LOOKS.map((L, n) => `
    <figure class="look">
      <div class="look-scene" style="--bg1:${L.bg[0]};--bg2:${L.bg[1]}" role="img" aria-label="Look ${n + 1}: ${L.cap} in ${L.sub}">
        <span class="arch"></span><span class="floor"></span><span class="shadow"></span>
        ${L.peg ? '<span class="peg"></span>' : ''}
        <span class="num-tag">${String(n + 1).padStart(2, '0')}</span>
        ${L.items.map((g) => `<div class="lk" style="left:${g.x - g.w / 2}%;top:${g.y}%;width:${g.w}%;transform:rotate(${g.r || 0}deg)">${garmentSVG(PRODUCTS[g.p], g.c, { hanger: !!g.hanger, tag: false })}</div>`).join('')}
      </div>
      <figcaption><span>Look ${String(n + 1).padStart(2, '0')} — ${L.cap}</span><span>${L.sub}</span></figcaption>
    </figure>`).join('');

  /* ------------------------------------------------------------------ */
  /* Split text + scroll reveals                                         */
  /* ------------------------------------------------------------------ */
  function split(el, mode) {
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    const words = text.split(/\s+/);
    el.innerHTML = words.map((w) => {
      const inner = mode === 'chars'
        ? [...w].map((ch) => `<span class="mask"><span>${ch}</span></span>`).join('')
        : `<span class="mask"><span>${w}</span></span>`;
      return `<span class="sw" aria-hidden="true">${inner}</span>`;
    }).join(' ');
    return $$('.mask > span', el);
  }

  if (G && window.ScrollTrigger && !RM) {
    $$('[data-split]').forEach((el) => {
      const parts = split(el, el.dataset.split);
      const chars = el.dataset.split === 'chars';
      G.from(parts, {
        yPercent: 115, rotate: chars ? 7 : 3, duration: chars ? 1.3 : 1.05, ease: 'expo.out',
        stagger: chars ? 0.045 : 0.022,
        scrollTrigger: { trigger: el, start: 'top 86%' },
      });
    });
    $$('[data-fade]').forEach((el) => {
      G.from(el, { y: 34, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
    });
    $$('[data-count]').forEach((el) => {
      const end = +el.dataset.count; const o = { v: 0 };
      G.to(o, { v: end, duration: 1.6, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' }, onUpdate: () => { el.textContent = Math.round(o.v); } });
    });
    // plate drifts inside its frame
    G.fromTo('#plate svg', { yPercent: -10 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '#plate', start: 'top bottom', end: 'bottom top', scrub: true } });
    // lookbook strip slides with the scroll
    const wrap = $('.look-wrap');
    G.to(lookTrack, {
      x: () => -Math.max(0, lookTrack.scrollWidth - wrap.clientWidth),
      ease: 'none',
      scrollTrigger: { trigger: '.lookbook', start: 'top bottom', end: 'bottom top', scrub: 0.6, invalidateOnRefresh: true },
    });
    $$('.look').forEach((fig, n) => {
      G.from($$('.lk', fig), { y: -40, rotation: n % 2 ? 6 : -6, duration: 1.4, ease: 'elastic.out(1, 0.55)', stagger: 0.12, scrollTrigger: { trigger: fig, start: 'top 85%' } });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Boot                                                                */
  /* ------------------------------------------------------------------ */
  measure();
  renderCart();
  if (G && !RM) {
    S.x = Math.min(S.vw * 0.55, 720);
    S.prevX = S.x;
    G.set(items.map((it) => it.el), { opacity: 0 });
    G.to(items.map((it) => it.el), { opacity: 1, duration: 0.8, stagger: 0.05, delay: 0.1, ease: 'power2.out' });
    S.tween = G.to(S, {
      x: 0, duration: 2.1, delay: 0.15, ease: 'expo.out',
      onUpdate: wake, onComplete: () => { S.tween = null; wake(); },
    });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); if (window.ScrollTrigger) window.ScrollTrigger.refresh(); });
  wake();
})();
