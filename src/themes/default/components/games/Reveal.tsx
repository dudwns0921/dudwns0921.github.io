
import { useEffect } from 'react';

// 화면에 들어온 [data-reveal] 칸에 .in 을 붙여 떠오르게 한다.
// 스크립트가 돌기 전에는 숨기지 않으므로, 스크립트가 없어도 내용은 다 보인다.
// 움직임이 많은 칸은 화면 밖으로 나가면 .off 를 붙여 애니메이션을 멈춘다 (GPU를 아낀다).
const Reveal = () => {
  useEffect(() => {
    const root = document.querySelector('.arcade');
    if (!root) return;
    root.classList.add('reveal-on');

    const reveal = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in');
          reveal.unobserve(entry.target);
        }),
      { threshold: 0.15 },
    );
    root.querySelectorAll('[data-reveal]').forEach((el) => reveal.observe(el));

    const idle = new IntersectionObserver((entries) =>
      entries.forEach((entry) => entry.target.classList.toggle('off', !entry.isIntersecting)),
    );
    root.querySelectorAll('.hero, .marquee, .game, .kit').forEach((el) => idle.observe(el));

    return () => {
      reveal.disconnect();
      idle.disconnect();
    };
  }, []);

  return null;
};

export default Reveal;
