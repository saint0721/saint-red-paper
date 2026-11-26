const { Plugin, MarkdownView, MarkdownRenderer, Component, Notice, setTooltip } = require('obsidian');
const { ViewPlugin, Decoration, WidgetType } = require('@codemirror/view');
const { RangeSetBuilder } = require('@codemirror/state');

const CITE = /\[\d+(?:\s*[,–-]\s*\d+)*\]/g;
const REF_LINE = /^(\s*(?:[-*+]\s+|\d+\.\s+)?)(\\?\[)(\d+)(\\?\])(\s*)(.*)$/;
const REF_HEADING = /^#{1,6}\s+.*(references|bibliography|참고문헌|출처)/i;
const TABLE_CAPTION = /^(\s*(?:표|Table|Tab\.)\s*[:：]\s*)(.+?)\s*$/;
const ID_TAG = /\s*\{#((?:tab|fig):[^}\s]+)\}/;
const CITE_ANY = /\\?\[\d+(?:\s*[,\u2013-]\s*\d+)*\\?\]/g;
const XREF = /@((?:tab|fig):[\w\-.ㄱ-힝]+)/g;
const IMG_EMBED = /!\[\[([^\]|]+?\.(?:png|jpe?g|gif|svg|webp|avif|bmp))(?:\|([^\]]*))?\]\]/gi;

// ---------- shared: labels from the note text ----------

function cssLabel(name, fallback) {
  const v = getComputedStyle(document.body).getPropertyValue(name).trim().replace(/^["']|["']$/g, '');
  return v || fallback;
}
function numberingOn() { return document.body.classList.contains('srp-print-numbering'); }
function tableLabel() { return cssLabel('--srp-table-label', 'Table'); }
function figureLabel() { return cssLabel('--srp-figure-label', 'Figure'); }
function splitId(text) {
  const m = ID_TAG.exec(text || '');
  return m ? { text: text.replace(ID_TAG, '').trim(), id: m[1] } : { text: (text || '').trim(), id: null };
}
function isCaptionText(alt, src) {
  return alt && alt !== src && !/^\d+(x\d+)?$/.test(alt);
}

// Tables and image embeds in reading order, numbered the same way the theme's PDF counters do.
function collectLabels(text) {
  const lines = text.split('\n');
  const tables = [], figures = [], ids = new Map(), refLines = new Set();
  let refHeading = -1;
  lines.forEach((l, i) => { if (REF_HEADING.test(l)) refHeading = i; });
  if (refHeading >= 0) {
    for (let i = refHeading + 1; i < lines.length; i++) {
      if (/^#{1,6}\s/.test(lines[i])) break;
      if (REF_LINE.test(lines[i])) refLines.add(i);
    }
  }
  let inFence = false, inFront = lines[0] === '---', offset = 0;
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];
    const lineStart = offset;
    offset += raw.length + 1;
    if (inFront) { if (i > 0 && raw === '---') inFront = false; continue; }
    if (/^\s*(```|~~~)/.test(raw)) { inFence = !inFence; continue; }
    if (inFence) continue;
    const line = raw.replace(/^(\s*>\s?)+/, '');
    const prev = i > 0 ? lines[i - 1].replace(/^(\s*>\s?)+/, '') : '';
    if (/^\s*\|/.test(line) && !/^\s*\|/.test(prev)) {
      let cap = null;
      for (let j = i - 1; j >= 0 && j >= i - 2; j--) {
        const t = lines[j].replace(/^(\s*>\s?)+/, '');
        const m = TABLE_CAPTION.exec(t);
        if (m) { cap = { line: j, ...splitId(m[2]) }; break; }
        if (t.trim()) break;
      }
      const entry = { line: i, number: tables.length + 1, caption: cap };
      tables.push(entry);
      if (cap && cap.id) ids.set(cap.id, { kind: 'tab', number: entry.number });
    }
    IMG_EMBED.lastIndex = 0;
    let m;
    while ((m = IMG_EMBED.exec(line))) {
      const src = m[1].split('/').pop();
      const alt = (m[2] || '').trim();
      const cap = isCaptionText(alt, src) ? splitId(alt) : { text: '', id: null };
      const entry = { from: lineStart + (raw.length - line.length) + m.index, number: figures.length + 1, caption: cap.text, id: cap.id };
      figures.push(entry);
      if (cap.id) ids.set(cap.id, { kind: 'fig', number: entry.number });
    }
  }
  return { tables, figures, ids, refLines };
}
function xrefText(id, labels) {
  const hit = labels.ids.get(id);
  if (!hit) return null;
  return `${hit.kind === 'tab' ? tableLabel() : figureLabel()} ${hit.number}`;
}

// ---------- Live Preview decorations ----------

class TextWidget extends WidgetType {
  constructor(text, cls) { super(); this.text = text; this.cls = cls; }
  eq(o) { return o.text === this.text && o.cls === this.cls; }
  toDOM() { const s = document.createElement('span'); s.className = this.cls; s.textContent = this.text; return s; }
}

function livePreviewExtension(plugin) {
  return ViewPlugin.fromClass(class {
    constructor(view) { this.labels = collectLabels(view.state.doc.toString()); this.decorations = this.build(view); this.syncFigures(view); }
    update(u) {
      if (u.docChanged) this.labels = collectLabels(u.state.doc.toString());
      if (u.docChanged || u.viewportChanged || u.selectionSet) this.decorations = this.build(u.view);
      requestAnimationFrame(() => this.syncFigures(u.view));
    }
    build(view) {
      const b = new RangeSetBuilder();
      const doc = view.state.doc;
      const live = view.dom.closest('.is-live-preview');
      if (!live) return b.finish();
      const sel = view.state.selection.main;
      const touches = (from, to) => sel.from <= to && sel.to >= from;
      const capLines = new Map();
      for (const t of this.labels.tables) if (t.caption) capLines.set(t.caption.line, t);
      for (const { from, to } of view.visibleRanges) {
        let pos = from;
        while (pos <= to) {
          const line = doc.lineAt(pos);
          const ranges = [];
          const t = capLines.get(line.number - 1);
          if (t && !touches(line.from, line.to)) {
            const m = TABLE_CAPTION.exec(line.text.replace(/^(\s*>\s?)+/, ''));
            const quote = line.text.length - line.text.replace(/^(\s*>\s?)+/, '').length;
            if (m) {
              ranges.push([line.from, line.from, Decoration.line({ class: 'srp-table-caption-line' })]);
              const prefix = numberingOn() ? `${tableLabel()} ${t.number}. ` : '';
              ranges.push([line.from + quote, line.from + quote + m[1].length, Decoration.replace({ widget: new TextWidget(prefix, 'srp-caption-label') })]);
              const idm = ID_TAG.exec(line.text);
              if (idm) ranges.push([line.from + idm.index, line.from + idm.index + idm[0].length, Decoration.replace({})]);
            }
          }
          if (this.labels.refLines.has(line.number - 1)) ranges.push([line.from, line.from, Decoration.line({ class: 'srp-ref-line' })]);
          CITE_ANY.lastIndex = 0;
          let c;
          while ((c = CITE_ANY.exec(line.text))) {
            if (c[0].startsWith('\\')) ranges.push([line.from + c.index, line.from + c.index + c[0].length, Decoration.mark({ class: 'srp-cite' })]);
          }
          XREF.lastIndex = 0;
          let x;
          while ((x = XREF.exec(line.text))) {
            const a = line.from + x.index, z = a + x[0].length;
            const txt = xrefText(x[1], this.labels);
            if (txt && !touches(a, z)) ranges.push([a, z, Decoration.replace({ widget: new TextWidget(txt, 'srp-xref') })]);
          }
          ranges.sort((p, q) => p[0] - q[0] || p[1] - q[1]);
          for (const [a, z, d] of ranges) b.add(a, z, d);
          pos = line.to + 1;
        }
      }
      return b.finish();
    }
    syncFigures(view) {
      for (const embed of view.dom.querySelectorAll('.internal-embed')) {
        const src = (embed.getAttribute('src') || '').split('/').pop();
        const alt = (embed.getAttribute('alt') || '').trim();
        if (!isCaptionText(alt, src) || !/\.(png|jpe?g|gif|svg|webp|avif|bmp)$/i.test(src)) continue;
        embed.setAttribute('data-srp-caption', splitId(alt).text);
        let pos = -1;
        try { pos = view.posAtDOM(embed); } catch (e) {}
        const fig = this.labels.figures.find((f) => Math.abs(f.from - pos) <= 2);
        if (fig) embed.setAttribute('data-srp-number', String(fig.number));
      }
    }
  }, { decorations: (v) => v.decorations });
}

// ---------- plugin ----------

module.exports = class SrpCitations extends Plugin {
  async onload() {
    this.refCache = new Map();
    this.labelCache = new Map();

    this.registerMarkdownPostProcessor(async (el, ctx) => {
      const file = this.app.vault.getAbstractFileByPath(ctx.sourcePath);
      const labels = file && file.extension === 'md' ? await this.labels(file) : { tables: [], figures: [], ids: new Map(), refLines: new Set() };
      this.wrapCitations(el);
      this.markTableCaptions(el, ctx, labels);
      this.markFigureCaptions(el, labels);
      this.wrapXrefs(el, labels);
    });
    this.registerEditorExtension(livePreviewExtension(this));

    this.registerDomEvent(document, 'click', (evt) => this.onCiteClick(evt));
    this.registerDomEvent(document, 'mouseover', (evt) => this.onCiteHover(evt));

    this.addCommand({
      id: 'renumber-citations',
      name: 'Renumber citations by first appearance',
      editorCallback: (editor, view) => this.renumber(view.file),
    });

    this.pageItem = this.addStatusBarItem();
    this.pageItem.addClass('srp-page-estimate');
    this.pageItem.onClickEvent(() => this.updatePages(true));
    this.addCommand({ id: 'estimate-pdf-pages', name: 'Estimate PDF pages', callback: () => this.updatePages(true) });
    this.registerEvent(this.app.workspace.on('active-leaf-change', () => this.schedulePages(300)));
    this.registerEvent(this.app.vault.on('modify', (f) => {
      const v = this.app.workspace.getActiveViewOfType(MarkdownView);
      if (v && v.file === f) this.schedulePages(4000);
    }));
    this.app.workspace.onLayoutReady(() => this.schedulePages(1000));
  }

  async labels(file) {
    const c = this.labelCache.get(file.path);
    if (c && c.mtime === file.stat.mtime) return c.labels;
    const labels = collectLabels(await this.app.vault.cachedRead(file));
    this.labelCache.set(file.path, { mtime: file.stat.mtime, labels });
    return labels;
  }

  // ----- reading view / PDF -----

  wrapText(el, regex, make) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => {
        if (!n.parentElement || n.parentElement.closest('code, pre, a, .srp-cite, .srp-xref, .math')) return NodeFilter.FILTER_REJECT;
        regex.lastIndex = 0;
        return regex.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      const text = node.nodeValue, frag = document.createDocumentFragment();
      let last = 0, m;
      regex.lastIndex = 0;
      while ((m = regex.exec(text))) {
        if (m.index > last) frag.append(text.slice(last, m.index));
        frag.append(make(m));
        last = m.index + m[0].length;
      }
      if (last < text.length) frag.append(text.slice(last));
      node.replaceWith(frag);
    }
  }

  wrapCitations(el) {
    this.wrapText(el, CITE, (m) => { const s = document.createElement('span'); s.className = 'srp-cite'; s.textContent = m[0]; return s; });
  }

  wrapXrefs(el, labels) {
    this.wrapText(el, XREF, (m) => {
      const txt = xrefText(m[1], labels);
      const s = document.createElement('span');
      s.className = txt ? 'srp-xref' : 'srp-xref is-unresolved';
      s.textContent = txt || m[0];
      return s;
    });
  }

  markTableCaptions(el, ctx, labels) {
    const info = ctx.getSectionInfo ? ctx.getSectionInfo(el) : null;
    for (const p of el.querySelectorAll('p')) {
      if (p.children.length) continue;
      const m = TABLE_CAPTION.exec(p.textContent);
      if (!m) continue;
      const { text } = splitId(m[2]);
      p.classList.add('srp-table-caption');
      p.textContent = text;
      if (info) {
        const t = labels.tables.find((x) => x.caption && x.caption.line >= info.lineStart && x.caption.line <= info.lineEnd);
        if (t) p.setAttribute('data-srp-number', String(t.number));
      }
    }
  }

  markFigureCaptions(el, labels) {
    for (const embed of el.querySelectorAll('.internal-embed')) {
      const alt = (embed.getAttribute('alt') || '').trim();
      const src = (embed.getAttribute('src') || '').split('/').pop();
      if (!isCaptionText(alt, src) || !/\.(png|jpe?g|gif|svg|webp|avif|bmp)$/i.test(src)) continue;
      const { text, id } = splitId(alt);
      embed.setAttribute('data-srp-caption', text);
      const fig = labels.figures.find((f) => (id && f.id === id) || (!id && f.caption === text));
      if (fig) embed.setAttribute('data-srp-number', String(fig.number));
    }
  }

  // ----- citations: jump and preview -----

  citationNumber(target) {
    if (!(target instanceof HTMLElement)) return null;
    const el = target.closest('.srp-cite, .cm-hmd-barelink');
    if (!el) return null;
    let text = el.textContent;
    if (!/\d/.test(text)) { const n = el.nextElementSibling; text = n ? n.textContent : ''; }
    const m = /(\d+)/.exec(text);
    return m ? Number(m[1]) : null;
  }

  async references(file) {
    const c = this.refCache.get(file.path);
    if (c && c.mtime === file.stat.mtime) return c.refs;
    const lines = (await this.app.vault.cachedRead(file)).split('\n');
    const refs = new Map();
    lines.forEach((line, i) => {
      const m = REF_LINE.exec(line);
      if (m) refs.set(Number(m[3]), { line: i, text: m[6].replace(/\[\[([^\]|]+\|)?([^\]]+)\]\]/g, '$2').trim() });
    });
    this.refCache.set(file.path, { mtime: file.stat.mtime, refs });
    return refs;
  }

  async onCiteClick(evt) {
    const num = this.citationNumber(evt.target);
    if (num == null) return;
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view || !view.file) return;
    const ref = (await this.references(view.file)).get(num);
    if (!ref) return;
    if (view.getMode() === 'preview') view.previewMode.applyScroll(ref.line);
    else { const pos = { line: ref.line, ch: 0 }; view.editor.setCursor(pos); view.editor.scrollIntoView({ from: pos, to: pos }, true); }
  }

  async onCiteHover(evt) {
    const target = evt.target instanceof HTMLElement ? evt.target : null;
    const num = this.citationNumber(target);
    if (num == null) return;
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view || !view.file) return;
    const ref = (await this.references(view.file)).get(num);
    if (!ref) return;
    const text = `[${num}] ${ref.text}`;
    if (typeof setTooltip === 'function') setTooltip(target, text, { placement: 'top' });
    else target.setAttribute('aria-label', text);
  }

  // ----- renumber citations by first appearance -----

  async renumber(file) {
    if (!file) return;
    let report = '';
    await this.app.vault.process(file, (text) => {
      const lines = text.split('\n');
      let headingAt = -1;
      lines.forEach((l, i) => { if (REF_HEADING.test(l)) headingAt = i; });
      const isRef = (i) => (headingAt < 0 || i > headingAt) && REF_LINE.test(lines[i]);
      const refIdx = [];
      lines.forEach((_, i) => { if (isRef(i)) refIdx.push(i); });
      if (!refIdx.length) { report = 'No numbered reference list found.'; return text; }
      const known = new Set(refIdx.map((i) => Number(REF_LINE.exec(lines[i])[3])));

      const expand = (inner) => {
        const out = [];
        for (const part of inner.split(',')) {
          const r = part.trim().split(/\s*[–-]\s*/).map(Number);
          if (r.length === 2 && r[0] <= r[1]) for (let k = r[0]; k <= r[1]; k++) out.push(k);
          else out.push(r[0]);
        }
        return out;
      };
      const map = new Map();
      let next = 1, inFence = false;
      const bodyLine = (i) => !isRef(i);
      lines.forEach((l, i) => {
        if (/^\s*(```|~~~)/.test(l)) { inFence = !inFence; return; }
        if (inFence || !bodyLine(i)) return;
        CITE.lastIndex = 0;
        let m;
        while ((m = CITE.exec(l))) for (const n of expand(m[0].slice(1, -1))) if (known.has(n) && !map.has(n)) map.set(n, next++);
      });
      const unused = [...known].filter((n) => !map.has(n)).sort((a, b) => a - b);
      for (const n of unused) map.set(n, next++);

      const compress = (nums) => {
        nums = [...new Set(nums)].sort((a, b) => a - b);
        const parts = [];
        for (let k = 0; k < nums.length; k++) {
          let e = k;
          while (e + 1 < nums.length && nums[e + 1] === nums[e] + 1) e++;
          parts.push(e - k >= 2 ? `${nums[k]}–${nums[e]}` : nums.slice(k, e + 1).join(', '));
          k = e;
        }
        return parts.join(', ');
      };
      let changed = 0;
      inFence = false;
      const out = lines.map((l, i) => {
        if (/^\s*(```|~~~)/.test(l)) { inFence = !inFence; return l; }
        if (inFence || !bodyLine(i)) return l;
        return l.replace(CITE, (c) => {
          const nums = expand(c.slice(1, -1));
          if (!nums.every((n) => known.has(n))) return c;
          const r = `[${compress(nums.map((n) => map.get(n)))}]`;
          if (r !== c) changed++;
          return r;
        });
      });
      const entries = refIdx.map((i) => {
        const m = REF_LINE.exec(lines[i]);
        return { n: map.get(Number(m[3])), line: `${m[1]}${m[2]}${map.get(Number(m[3]))}${m[4]}${m[5]}${m[6]}` };
      }).sort((a, b) => a.n - b.n);
      refIdx.forEach((i, k) => { out[i] = entries[k].line; });
      report = `Renumbered ${map.size} references (${changed} citations changed${unused.length ? `, ${unused.length} uncited kept at the end` : ''}).`;
      return out.join('\n');
    });
    new Notice(report);
  }

  // ----- PDF page estimate -----

  printSetup() {
    const mm = 96 / 25.4;
    let page = { w: 210, h: 297 }, margin = [15, 15, 15, 15], font = null;
    const sizes = { A3: [297, 420], A4: [210, 297], A5: [148, 210], Letter: [215.9, 279.4], Legal: [215.9, 355.6] };
    const conf = this.app.vault.getConfig && this.app.vault.getConfig('pdfExportSettings');
    if (conf && sizes[conf.pageSize]) page = { w: sizes[conf.pageSize][0], h: sizes[conf.pageSize][1] };
    if (conf && conf.landscape) page = { w: page.h, h: page.w };
    const scale = conf && conf.downscalePercent ? conf.downscalePercent / 100 : 1;
    const toMm = (v) => { const m = /([\d.]+)\s*(mm|cm|in|px|pt)/.exec(v); if (!m) return null; const n = parseFloat(m[1]); return { mm: n, cm: n * 10, in: n * 25.4, px: n / mm, pt: n * 25.4 / 72 }[m[2]]; };
    for (const sheet of document.styleSheets) {
      let rules; try { rules = sheet.cssRules; } catch (e) { continue; }
      for (const r of rules) {
        if (!(r instanceof CSSMediaRule) || !/print/.test(r.conditionText || r.media.mediaText)) continue;
        for (const inner of r.cssRules) {
          if (inner instanceof CSSPageRule) {
            const size = inner.style.getPropertyValue('size').trim();
            if (sizes[size]) page = { w: sizes[size][0], h: sizes[size][1] };
            const mg = inner.style.getPropertyValue('margin').trim().split(/\s+/).map(toMm).filter((x) => x != null);
            if (mg.length) margin = [mg[0], mg[1] ?? mg[0], mg[2] ?? mg[0], mg[3] ?? mg[1] ?? mg[0]];
          } else if (inner instanceof CSSStyleRule && inner.selectorText === '.markdown-preview-view' && inner.style.fontSize) {
            font = inner.style.fontSize;
          }
        }
      }
    }
    // Export "downscale" shrinks the content, so more of it fits: lay out wider and taller by 1/scale.
    return { width: (page.w - margin[1] - margin[3]) * mm / scale, height: (page.h - margin[0] - margin[2]) * mm / scale, font };
  }

  schedulePages(ms) { clearTimeout(this.pageTimer); this.pageTimer = setTimeout(() => this.updatePages(false), ms); }

  async updatePages(force) {
    const view = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view || !view.file) { this.pageItem.setText(''); return; }
    const file = view.file;
    let text = await this.app.vault.cachedRead(file);
    text = text.replace(/^---\n[\s\S]*?\n---\n?/, '');
    const lines = text.split('\n');
    const cut = lines.findIndex((l) => REF_HEADING.test(l));
    const body = cut >= 0 ? lines.slice(0, cut).join('\n') : text;
    const setup = this.printSetup();
    const host = document.body.createDiv({ cls: 'srp-page-measure' });
    host.setAttr('style', `position:fixed;left:-20000px;top:0;width:${setup.width}px;visibility:hidden;pointer-events:none;`);
    const el = host.createDiv({ cls: 'markdown-preview-view markdown-rendered' });
    el.setAttr('style', `width:${setup.width}px;padding:0;margin:0;max-width:none;${setup.font ? `font-size:${setup.font};` : ''}`);
    const comp = new Component();
    comp.load();
    try {
      await MarkdownRenderer.render(this.app, body, el, file.path, comp);
      await new Promise((r) => setTimeout(r, 400));
      const pages = el.scrollHeight / setup.height;
      this.pageItem.setText(`PDF ≈ ${pages.toFixed(1)}p`);
      setTooltip(this.pageItem, cut >= 0 ? 'Estimated PDF pages, references excluded. Click to recount.' : 'Estimated PDF pages. Click to recount.', { placement: 'top' });
    } finally {
      comp.unload();
      host.remove();
    }
  }
};
