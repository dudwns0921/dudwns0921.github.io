import type { Profile } from '@/content/types';
import DotComponent from './common/DotComponent';
import StrongComponent from './common/StrongComponent';
import { renderInline } from './common/Inline';

// 소개글. 문장은 content/resume/profile.yaml에 있다.
// 제목 세 줄: 첫 줄 다음에 줄을 바꾸고, 넓은 화면에서는 둘째 · 셋째 줄을 한 줄에 둔다.
const ResumeHeader = ({ profile }: { profile: Profile }) => {
  const [first, second, third] = profile.greeting;
  return (
    <section>
      <h1 className="text-5xl md:text-6xl font-bold mb-4 break-keep">
        {first}
        <br />
        <span className="text-3xl font-semibold my-2 block md:inline md:text-5xl md:font-bold md:my-0">{second}</span>
        <span className="hidden md:inline"> </span>
        <span className="block md:inline">
          {third}
          <DotComponent />
        </span>
      </h1>
      <div className="flex flex-col gap-3 text-lg">
        {profile.paragraphs.map((paragraph, i) => (
          <p key={i}>{renderInline(paragraph, StrongComponent)}</p>
        ))}
      </div>
    </section>
  );
};

export default ResumeHeader;
