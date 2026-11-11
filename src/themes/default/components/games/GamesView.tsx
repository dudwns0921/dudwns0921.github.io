import type { ReactNode } from 'react';
import type { Game, GamesData } from '@/content/types';
import { renderInline } from '../common/Inline';
import { withBasePath } from '@/utils';
import Tilt from './Tilt';
import Reveal from './Reveal';
import './games.css';

const pad = (n: number) => String(n).padStart(2, '0');

// '**구절**'은 빛나는 글자로, '[글자](주소)'는 링크로 그린다.
const Glow = ({ children }: { children: ReactNode }) => <mark>{children}</mark>;
const renderText = (text: string) => renderInline(text, Glow);

// 링크 묶음. 첫 링크를 크게 둔다. 바깥 링크는 새 탭으로 연다.
const Links = ({ links, play }: { links: { label: string; href: string }[]; play?: boolean }) => (
  <div className="btns">
    {links.map((link, i) => {
      const internal = link.href.startsWith('/');
      return (
        <a
          key={link.href}
          className={i === 0 ? 'btn main' : 'btn'}
          href={internal ? withBasePath(link.href) : link.href}
          target={internal ? undefined : '_blank'}
          rel={internal ? undefined : 'noopener noreferrer'}
        >
          {play && i === 0 && <i aria-hidden="true">▶</i>}
          {link.label}
        </a>
      );
    })}
  </div>
);

// 반짝이는 별. 서버와 브라우저가 같은 값을 그리도록 무작위 대신 순번으로 흩어 놓는다.
const Sparkles = ({ count }: { count: number }) => (
  <div className="sparkles" aria-hidden="true">
    {Array.from({ length: count }, (_, i) => (
      <span
        key={i}
        style={
          {
            left: `${(i * 37 + 11) % 100}%`,
            top: `${(i * 53 + 7) % 100}%`,
            '--d': `${((i * 0.61) % 5).toFixed(2)}s`,
            '--s': `${8 + (i % 4) * 5}px`,
          } as React.CSSProperties
        }
      />
    ))}
  </div>
);

const GameCard = ({ game, index }: { game: Game; index: number }) => {
  return (
    <div data-reveal>
    <Tilt className="game" style={{ '--accent': game.accent } as React.CSSProperties}>
      <div className="game-frame">
        <div className="game-art">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={withBasePath(game.banner)} alt={`${game.title} 배너`} />
          <div className="game-no" aria-hidden="true">
            {pad(index + 1)}
          </div>
          <div className="game-tags">
            <span className="chip">{game.genre}</span>
            <span className="chip dim">{game.period}</span>
            <span className="chip live">
              <i aria-hidden="true" />
              itch.io 출시
            </span>
            {game.kitCycles && <span className="chip kit-chip">MADE WITH gamedev-kit</span>}
          </div>
        </div>
        <div className="game-body">
          <div className="game-main">
            <div className="lab">STAGE {pad(index + 1)}</div>
            <h3>{game.title}</h3>
            {game.kitCycles && (
              // gamedev-kit으로 만든 게임은 그 사실을 제목 아래 띠로 크게 보여 준다.
              <div className="made-kit">
                <span>
                  <b>gamedev-kit</b>으로 제작
                </span>
                <span className="cycles">
                  개발 사이클 <b>{game.kitCycles}</b>회
                </span>
              </div>
            )}
            <p className="desc">{game.description}</p>
            <ul className="quests">
              {game.achievements.map((a, i) => (
                <li key={i}>{renderText(a.description)}</li>
              ))}
            </ul>
          </div>
          <div className="game-side">
            <Links links={game.links} play />
          </div>
        </div>
      </div>
    </Tilt>
    </div>
  );
};

// 사이클 여섯 단계를 고리로 돈다. 빛 구슬이 한 바퀴 도는 동안 단계가 차례로 켜진다.
// 클래스 이름을 'ring'으로 쓰면 Tailwind의 ring 유틸리티가 테두리를 덧그리므로 'loop'로 쓴다.
const CycleLoop = ({ gamedevKit }: { gamedevKit: GamesData['gamedevKit'] }) => {
  const steps = gamedevKit.cycle;
  return (
    <div className="loop" style={{ '--n': steps.length } as React.CSSProperties}>
      <svg viewBox="0 0 400 400" aria-hidden="true">
        <defs>
          <linearGradient id="loop-g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3dffb0" />
            <stop offset="0.45" stopColor="#d8ff5a" />
            <stop offset="0.8" stopColor="#ffd24a" />
            <stop offset="1" stopColor="#ff8ad1" />
          </linearGradient>
        </defs>
        <circle cx="200" cy="200" r="186" className="loop-tick" />
        <circle cx="200" cy="200" r="150" className="loop-base" />
        <circle cx="200" cy="200" r="150" className="loop-run" />
      </svg>
      <div className="loop-orb" aria-hidden="true">
        <i />
      </div>
      {/* CEO가 함께 돌리는 다른 사이클들. 흐리게 그려 지금 따라가는 사이클과 구분한다. */}
      <div className="loop-orb ghost g1" aria-hidden="true">
        <i />
      </div>
      <div className="loop-orb ghost g2" aria-hidden="true">
        <i />
      </div>
      <ol>
        {steps.map((step, i) => (
          <li
            key={step.name}
            className={step.byUser ? 'me' : 'ai'}
            style={{ '--i': i, '--a': `${(360 / steps.length) * i}deg` } as React.CSSProperties}
          >
            <span>
              <small>{pad(i + 1)}</small>
              {step.name}
            </span>
          </li>
        ))}
      </ol>
      <div className="loop-core">
        <div className="lab">GAME DEV CYCLE</div>
        <b>gamedev-kit</b>
        <div className="legend">
          <span className="me">나</span>
          <span className="ai">AI 에이전트</span>
        </div>
      </div>
    </div>
  );
};

// 가장 앞에 두는 칸. 게임 카드와 같은 깎은 틀을 쓰되 더 크게 그린다.
const KitSection = ({ gamedevKit }: { gamedevKit: GamesData['gamedevKit'] }) => (
  <div data-reveal>
    <Tilt className="game kit" style={{ '--accent': '#3dffb0' } as React.CSSProperties}>
      <div className="game-frame">
        <div className="kit-inner">
          <Sparkles count={10} />
          <div className="kit-tags">
            <span className="chip">MAIN QUEST</span>
            <span className="chip dim">{gamedevKit.period}</span>
          </div>
          <div className="kit-top">
            <CycleLoop gamedevKit={gamedevKit} />
            <div className="kit-text">
              <div className="lab">{gamedevKit.kicker}</div>
              <h3>{gamedevKit.title}</h3>
              <p className="made">{gamedevKit.role}</p>
              <p className="desc">{gamedevKit.description}</p>
              {/* 빛 구슬이 지나는 단계가 이 목록에서도 같은 박자로 켜진다. */}
              <ol className="steps" style={{ '--n': gamedevKit.cycle.length } as React.CSSProperties}>
                {gamedevKit.cycle.map((step, i) => (
                  <li
                    key={step.name}
                    className={step.byUser ? 'me' : 'ai'}
                    style={{ '--i': i } as React.CSSProperties}
                  >
                    <b>
                      {pad(i + 1)} {step.name}
                    </b>
                    <span>{step.line}</span>
                  </li>
                ))}
              </ol>
              <p className="ceo">
                <b>CEO</b>
                {gamedevKit.ceo}
              </p>
              <ul className="stack">
                {gamedevKit.techStack.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
              <Links links={gamedevKit.links} />
            </div>
          </div>
        </div>
      </div>
    </Tilt>
  </div>
);

const marquee = ['gamedev-kit', 'NOSTOS', 'KEROS', 'OUTIS', 'GODOT 4.7', 'CLAUDE CODE', 'MESHY AI', 'ELEVENLABS', 'BLENDER', 'ITCH.IO'];

// 데이터는 content/games/games.yaml에서 props로 받는다. 이 컴포넌트 전체가 섬(client:load)이라 props는 평범한 데이터다.
const GamesView = ({ hero, trilogy, games, gamedevKit }: GamesData) => (
  <div className="arcade">
    <Reveal />
    <div className="scanlines" aria-hidden="true" />

    {/* 위쪽 띠 없이, 모서리를 깎은 버튼만 떠 있다. */}
    <a className="fab fab-back" href={withBasePath('/')}>
      ← 이력서
    </a>
    <span className="fab fab-player lab">
      PLAYER 1 · <b>정영준</b>
    </span>

    <section className="hero">
      <div className="floor" aria-hidden="true" />
      <Sparkles count={28} />
      <div className="hero-inner">
        {/* 해는 글 묶음 안에 두고 아래 끝을 시작 단추 위에 맞춘다 (단추가 해의 줄무늬에 걸리지 않게). */}
        <div className="sun" aria-hidden="true" />
        <div className="lab hero-kicker">
          <i aria-hidden="true" />
          {hero.kicker}
          <i aria-hidden="true" />
        </div>
        <h1 className="title" data-text="GAMES">
          GAMES
        </h1>
        <p className="hero-sub">
          {hero.sub.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
        <a className="start" href="#kit">
          PRESS START
        </a>
      </div>
    </section>

    <div className="marquee" aria-hidden="true">
      <div>
        {[...marquee, ...marquee].map((word, i) => (
          <span key={i}>
            {word}
            <i>✦</i>
          </span>
        ))}
      </div>
    </div>

    <main className="arcade-main">
      <section id="kit" className="block">
        <div className="block-head" data-reveal>
          <div className="lab">MAIN QUEST</div>
          <h2>직접 만든 게임 개발 플러그인</h2>
        </div>
        <KitSection gamedevKit={gamedevKit} />
      </section>

      <section id="select" className="block">
        <div className="block-head" data-reveal>
          <div className="lab">SELECT GAME</div>
          <h2>{trilogy.title}</h2>
          <p className="block-desc">{trilogy.description}</p>
          <p className="made">
            {trilogy.period} · {trilogy.role}
          </p>
          <ul className="stack">
            {trilogy.techStack.map((tech) => (
              <li key={tech}>{tech}</li>
            ))}
          </ul>
        </div>
        <div className="games">
          {games.map((game, i) => (
            <GameCard key={game.slug} game={game} index={i} />
          ))}
        </div>
      </section>

    </main>

    <footer className="continue">
      <div className="lab">CONTINUE?</div>
      <a className="fab big" href={withBasePath('/')}>
        ← 이력서로 돌아가기
      </a>
      <p>&copy; {new Date().getFullYear()} Jung Young Joon</p>
    </footer>
  </div>
);

export default GamesView;
