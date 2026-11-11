import type { Project } from '@/content/types';
import TitleComponent from '../common/TitleComponent';
import ProjectInfo from '../workExprience/ProjectInfo';

// 공식 대회 · 행사만 둔다. 개인 게임과 gamedev-kit은 게임 페이지(/games)에 있다.
const Activity = ({ items }: { items: Project[] }) => (
  <section>
    <TitleComponent title="Activities" size="5xl" />
    <div className="flex flex-col gap-6 pl-4">
      {items.map((project: Project) => (
        <ProjectInfo key={project.title} project={project} />
      ))}
    </div>
  </section>
);

export default Activity;
