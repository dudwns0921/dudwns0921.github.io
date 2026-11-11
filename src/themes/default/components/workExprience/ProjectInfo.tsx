import InfoItem from '../common/InfoItem';
import StrongComponent from '../common/StrongComponent';
import Badge from '../common/Badge';
import { withBasePath } from '@/utils';
import type { Project } from '@/content/types';
import { renderInline } from '../common/Inline';

// 운영 PDF 환경에는 이모지 폰트가 없으므로 링크 label에 이모지를 쓰지 않는다.
// href가 '/'로 시작하면 이 사이트 안의 주소다. webOnly 링크는 PDF에 넣지 않는다.

interface ProjectInfoProps {
  project: Project;
  titleSize?: string;
}

const ProjectInfo = ({ project, titleSize }: ProjectInfoProps) => (
  <div className="relative flex flex-col gap-4">
    <div>
      <InfoItem
        title={project.title}
        subInfo={project.period}
        subInfo2={project.role}
        description={project.description}
        keepTogether={false}
        titleSize={titleSize}
      />
      {project.links && project.links.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-x-3 text-sm">
          {project.links.map((link) => {
            const internal = link.href.startsWith('/');
            return (
              <a
                key={link.href}
                href={internal ? withBasePath(link.href) : link.href}
                target={internal ? undefined : '_blank'}
                rel={internal ? undefined : 'noopener noreferrer'}
                className={`text-blue-600 underline underline-offset-2${link.webOnly ? ' no-pdf' : ''}`}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      )}
    </div>
    {project.techStack.length > 0 && (
      <div className="flex flex-wrap gap-2 break-inside-avoid">
        {project.techStack.map((tech, index) => (
          <Badge key={index} text={tech} />
        ))}
      </div>
    )}
    <ul className="list-disc pl-5 text-gray-700 space-y-1">
      {project.achievements.map((a, i) => (
        <li key={i}>
          {a.strong ? <StrongComponent>{a.description}</StrongComponent> : renderInline(a.description, StrongComponent)}
        </li>
      ))}
    </ul>
  </div>
);

export default ProjectInfo;
