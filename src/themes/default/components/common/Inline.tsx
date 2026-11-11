import type { ComponentType, ReactNode } from 'react';
import { parseInline, type InlineNode } from '@/content/inline';
import { withSiteUrl } from '@/utils';

// 문장 안의 '**구절**'과 '[글자](주소)'를 그린다. 강조 모양은 쓰는 곳이 고른다 (이력서: 노란 배경, 게임 페이지: 빛나는 글자).
// 사이트 안의 주소('/…')는 PDF에서도 눌러지게 운영 주소 전체로 걸고, 바깥 주소는 새 탭으로 연다.
const renderNode = (node: InlineNode, key: number, Strong: ComponentType<{ children: ReactNode }>): ReactNode => {
  if (node.type === 'text') return node.value;
  const children = node.children.map((child, i) => renderNode(child, i, Strong));
  if (node.type === 'strong') return <Strong key={key}>{children}</Strong>;
  if (node.href.startsWith('/')) {
    return (
      <a key={key} href={withSiteUrl(node.href)} className="whitespace-nowrap text-blue-600 underline underline-offset-2">
        {children}
      </a>
    );
  }
  return (
    <a key={key} href={node.href} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline underline-offset-2">
      {children}
    </a>
  );
};

export const renderInline = (text: string, Strong: ComponentType<{ children: ReactNode }>): ReactNode[] =>
  parseInline(text).map((node, i) => renderNode(node, i, Strong));
