// 글 본문의 이미지 · mermaid 그림을 화면 가득 크게 보여 준다. Zoom.astro가 처음 누를 때만 이 파일을 불러온다.
// 라이브러리 없이 transform 하나로 한다: 끌어서 옮기기 · 두 손가락 확대(포인터 이벤트), 휠 확대, 두 번 눌러 확대/맞춤.
// mermaid는 다크 모드가 바뀌면 다시 그려지므로, 누른 시점의 SVG를 복제해 쓴다 (원본은 건드리지 않는다).

const PAD = 16;
const DIAGRAM_PAD = 12;

interface Content {
  el: HTMLElement;
  width: number;
  height: number;
  // 사진은 원래 크기보다 키워서 맞추지 않는다 (흐려진다). 그림(SVG)은 화면에 맞춰 키운다.
  upscale: boolean;
}

// 복제한 SVG 안의 id가 원본과 겹치지 않게 바꾼다. 화살표 끝(marker) 같은 url(#id) 참조와 <style>의 #id 선택자도 따라 바꾼다.
const renameIds = (svg: SVGSVGElement) => {
  const nodes = [svg, ...svg.querySelectorAll<Element>('[id]')].filter((el) => el.id);
  if (nodes.length === 0) return;
  const suffix = `-zoom${Date.now().toString(36)}`;
  const ids = new Set(nodes.map((el) => el.id));
  const pattern = new RegExp(
    `#(${[...ids]
      .sort((a, b) => b.length - a.length)
      .map((id) => id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|')})(?![\\w-])`,
    'g',
  );
  const fix = (text: string) => text.replace(pattern, `#$1${suffix}`);
  for (const el of nodes) el.id += suffix;
  for (const el of [svg, ...svg.querySelectorAll<Element>('*')]) {
    for (const attr of [...el.attributes]) {
      if (attr.value.includes('#')) el.setAttribute(attr.name, fix(attr.value));
    }
  }
  for (const style of svg.querySelectorAll('style')) style.textContent = fix(style.textContent ?? '');
};

const buildContent = (trigger: HTMLElement): Content | null => {
  if (trigger instanceof HTMLImageElement) {
    const width = trigger.naturalWidth || trigger.width;
    const height = trigger.naturalHeight || trigger.height;
    if (!width || !height) return null;
    const img = new Image();
    img.src = trigger.currentSrc || trigger.src;
    img.alt = trigger.alt;
    img.draggable = false;
    img.style.width = `${width}px`;
    img.style.height = `${height}px`;
    return { el: img, width, height, upscale: false };
  }
  const svg = trigger.querySelector('svg');
  if (!svg) return null;
  const box = svg.viewBox.baseVal;
  const rect = svg.getBoundingClientRect();
  const svgWidth = box && box.width ? box.width : rect.width;
  const svgHeight = box && box.height ? box.height : rect.height;
  if (!svgWidth || !svgHeight) return null;
  const clone = svg.cloneNode(true) as SVGSVGElement;
  renameIds(clone);
  clone.style.maxWidth = 'none';
  clone.setAttribute('width', String(svgWidth));
  clone.setAttribute('height', String(svgHeight));
  const panel = document.createElement('div');
  panel.className = 'zoom-diagram';
  panel.style.padding = `${DIAGRAM_PAD}px`;
  panel.appendChild(clone);
  const width = svgWidth + DIAGRAM_PAD * 2;
  const height = svgHeight + DIAGRAM_PAD * 2;
  panel.style.width = `${width}px`;
  panel.style.height = `${height}px`;
  return { el: panel, width, height, upscale: true };
};

let current: { close: () => void } | null = null;

export const openZoom = (trigger: HTMLElement) => {
  if (current) return;
  const content = buildContent(trigger);
  if (!content) return;

  const overlay = document.createElement('div');
  overlay.className = 'zoom-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', trigger.getAttribute('aria-label') ?? '크게 보기');
  // 빈 곳을 눌러도 초점이 대화 상자 밖(body)으로 나가지 않게 한다.
  overlay.tabIndex = -1;
  const stage = document.createElement('div');
  stage.className = 'zoom-content';
  stage.appendChild(content.el);
  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'zoom-close';
  closeButton.setAttribute('aria-label', '닫기');
  closeButton.textContent = '×';
  const hint = document.createElement('p');
  hint.className = 'zoom-hint';
  hint.textContent = matchMedia('(pointer: coarse)').matches
    ? '두 손가락으로 확대 · 두 번 눌러 확대'
    : '휠로 확대 · 끌어서 이동 · 두 번 눌러 확대';
  overlay.append(stage, closeButton, hint);

  let scale = 1;
  let x = 0;
  let y = 0;
  let fit = 1;
  const minScale = () => fit * 0.5;
  const maxScale = () => Math.max(fit * 8, 4);
  const view = () => ({ w: overlay.clientWidth, h: overlay.clientHeight });

  // 화면보다 작으면 가운데에 두고, 크면 가장자리를 넘어 빈 곳이 생기지 않게 막는다.
  const clamp = () => {
    const { w, h } = view();
    const cw = content.width * scale;
    const ch = content.height * scale;
    x = cw <= w - PAD * 2 ? (w - cw) / 2 : Math.min(PAD, Math.max(w - cw - PAD, x));
    y = ch <= h - PAD * 2 ? (h - ch) / 2 : Math.min(PAD, Math.max(h - ch - PAD, y));
  };
  const apply = () => {
    clamp();
    stage.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  };
  // (px, py) 화면 점 아래의 그림 위치를 그대로 둔 채 배율을 바꾼다.
  const zoomAt = (next: number, px: number, py: number) => {
    const s = Math.min(maxScale(), Math.max(minScale(), next));
    x = px - ((px - x) / scale) * s;
    y = py - ((py - y) / scale) * s;
    scale = s;
    apply();
  };
  const reset = () => {
    const { w, h } = view();
    fit = Math.min((w - PAD * 2) / content.width, (h - PAD * 2) / content.height);
    if (!content.upscale) fit = Math.min(fit, 1);
    scale = fit;
    x = (w - content.width * scale) / 2;
    y = (h - content.height * scale) / 2;
    apply();
  };
  const isZoomed = () => scale > fit * 1.05;

  // 포인터 하나는 끌어서 옮기기, 둘은 두 손가락 확대.
  const pointers = new Map<number, { x: number; y: number }>();
  let pinch: { dist: number; scale: number; cx: number; cy: number; x: number; y: number } | null = null;
  let moved = false;
  // 포인터를 잡으면(setPointerCapture) 뗄 때의 target이 오버레이가 되므로, 누른 곳은 누를 때 적어 둔다.
  let pressedOnContent = false;
  let lastTap = { time: 0, x: 0, y: 0 };
  let closeOnClick = false;
  const distance = () => {
    const [a, b] = [...pointers.values()];
    return { dist: Math.hypot(a.x - b.x, a.y - b.y) || 1, cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 };
  };

  const onPointerDown = (event: PointerEvent) => {
    if (event.target === closeButton) return;
    overlay.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size === 1) {
      moved = false;
      closeOnClick = false;
      pressedOnContent = stage.contains(event.target as Node);
    }
    if (pointers.size === 2) {
      const { dist, cx, cy } = distance();
      pinch = { dist, scale, cx, cy, x, y };
      moved = true;
    }
  };
  const onPointerMove = (event: PointerEvent) => {
    const last = pointers.get(event.pointerId);
    if (!last) return;
    const point = { x: event.clientX, y: event.clientY };
    pointers.set(event.pointerId, point);
    if (pinch && pointers.size >= 2) {
      const { dist, cx, cy } = distance();
      const s = Math.min(maxScale(), Math.max(minScale(), (pinch.scale * dist) / pinch.dist));
      // 처음 두 손가락 가운데에 있던 그림 위치가 지금 가운데로 오게 한다 (옮기기와 확대를 함께).
      x = cx - ((pinch.cx - pinch.x) / pinch.scale) * s;
      y = cy - ((pinch.cy - pinch.y) / pinch.scale) * s;
      scale = s;
      apply();
      return;
    }
    const dx = point.x - last.x;
    const dy = point.y - last.y;
    if (!moved && Math.hypot(dx, dy) < 3) {
      pointers.set(event.pointerId, last);
      return;
    }
    moved = true;
    x += dx;
    y += dy;
    apply();
  };
  const onPointerUp = (event: PointerEvent) => {
    if (!pointers.delete(event.pointerId)) return;
    if (pointers.size < 2) pinch = null;
    if (pointers.size > 0 || moved || event.type === 'pointercancel') return;
    // 끌지 않고 누른 것: 그림 바깥이면 닫고, 그림을 두 번 누르면 확대 / 맞춤을 오간다.
    // 바깥을 누른 것은 뒤이어 오는 click에서 닫는다. 여기서 바로 닫으면 그 click이 뒤 페이지(링크 등)에 떨어진다.
    if (!pressedOnContent) {
      closeOnClick = true;
      return;
    }
    const now = event.timeStamp;
    if (now - lastTap.time < 320 && Math.hypot(event.clientX - lastTap.x, event.clientY - lastTap.y) < 30) {
      lastTap.time = 0;
      if (isZoomed()) reset();
      // 원래 크기(1배)까지는 한 번에 키운다 — 휴대폰에서 넓은 mermaid 그림의 글자를 읽을 수 있는 크기.
      else zoomAt(Math.max(fit * 2.5, 1), event.clientX, event.clientY);
      return;
    }
    lastTap = { time: now, x: event.clientX, y: event.clientY };
  };
  const onWheel = (event: WheelEvent) => {
    event.preventDefault();
    const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
    zoomAt(scale * Math.exp(-delta * 0.002), event.clientX, event.clientY);
  };
  const onKeyDown = (event: KeyboardEvent) => {
    const { w, h } = view();
    switch (event.key) {
      case 'Escape':
        close();
        break;
      case 'Tab':
        // 열려 있는 동안 초점은 닫기 단추에 둔다.
        closeButton.focus();
        break;
      case '+':
      case '=':
        zoomAt(scale * 1.25, w / 2, h / 2);
        break;
      case '-':
        zoomAt(scale / 1.25, w / 2, h / 2);
        break;
      case '0':
        reset();
        break;
      case 'ArrowLeft':
        x += 48;
        apply();
        break;
      case 'ArrowRight':
        x -= 48;
        apply();
        break;
      case 'ArrowUp':
        y += 48;
        apply();
        break;
      case 'ArrowDown':
        y -= 48;
        apply();
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  const root = document.documentElement;
  const previousOverflow = root.style.overflow;
  const close = () => {
    root.style.overflow = previousOverflow;
    window.removeEventListener('resize', reset);
    document.removeEventListener('keydown', onKeyDown, true);
    overlay.remove();
    current = null;
    trigger.focus({ preventScroll: true });
  };

  overlay.addEventListener('pointerdown', onPointerDown);
  overlay.addEventListener('pointermove', onPointerMove);
  overlay.addEventListener('pointerup', onPointerUp);
  overlay.addEventListener('pointercancel', onPointerUp);
  overlay.addEventListener('wheel', onWheel, { passive: false });
  closeButton.addEventListener('click', () => close());
  overlay.addEventListener('click', (event) => {
    if (event.target !== closeButton && closeOnClick) close();
  });
  document.addEventListener('keydown', onKeyDown, true);
  window.addEventListener('resize', reset);

  root.style.overflow = 'hidden';
  document.body.appendChild(overlay);
  current = { close };
  reset();
  closeButton.focus({ preventScroll: true });
};
