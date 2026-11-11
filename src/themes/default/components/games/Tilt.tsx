
import { useRef } from 'react';

// 마우스를 따라 카드가 기운다. 터치 화면에서는 기울이지 않는다.
const Tilt = ({ className, style, children }: { className?: string; style?: React.CSSProperties; children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', `${(0.5 - y) * 6}deg`);
    el.style.setProperty('--ry', `${(x - 0.5) * 8}deg`);
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <div ref={ref} className={className} style={style} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </div>
  );
};

export default Tilt;
