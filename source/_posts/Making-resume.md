---
title: 웹 이력서 제작기
date: 2025-09-30 21:18:00
categories:
tags:
---
# 서론

개발자에게 이력서는 미술 작품과 같다. 자신을 표현한다는 목적은 같지만, 그 표현 방법은 무궁무진하기 때문이다. 이번 글에서는 나만의 웹 이력서를 만들면서 겪었던 기술적 도전과 해결 과정을 공유하고자 한다.

# 프로젝트 시작: 원티드 양식에서 벗어나기

꽤 최근까지는 원티드의 이력서 양식을 사용했다. 군더더기 없는 깔끔한 디자인이 마음에 들었기 때문이다. 하지만 플랫폼이 업데이트되면서 미니멀리즘을 선호하는 내 취향과는 점점 맞지 않는 부분들이 생겨났다.

![이 때가 좋았지...](wantedResume.jpg)

고민 끝에 내린 결론은 간단했다. **직접 만들자.**

## 벤치마킹: 좋은 레퍼런스의 발견

프로젝트를 시작하기 전, 좋은 레퍼런스를 찾던 중 [현섭님의 이력서](https://hyunseob.github.io/resume/)를 발견했다. 내가 구상했던 이상적인 이력서 양식과 놀랍도록 유사했다. 전체적인 구조는 벤치마킹하되, 나만의 개성을 담은 요소들을 추가하기로 계획했다.

# 개발 과정

## 초기 개발

사실 초기 버전을 만드는 데는 오랜 시간이 걸리지 않았다. 데이터를 보여주는 정적인 페이지였기 때문이다. 

처음에는 바닐라 JavaScript로 만들까 고민했지만, 향후 기능 확장 가능성을 고려해 React를 선택했다. 컴포넌트 기반 구조로 관리하면 유지보수가 용이하고, 필요에 따라 인터랙티브한 기능을 추가하기도 쉬울 것이라 판단했다.

## 첫 번째 도전: PDF 변환 문제

완성된 웹 이력서를 배포한 후, 예상치 못한 문제에 직면했다. **의외로 많은 회사들이 PDF 형식을 요구**했던 것이다.

물론 HTML을 PDF로 변환해주는 온라인 서비스들이 존재했다. 하지만 여러 문제점이 있었다:
- 원하지 않는 요소(PDF 변환 버튼 등)까지 포함됨
- 페이지가 넘어갈 때 여백이 제대로 적용되지 않음
- 세밀한 레이아웃 조정이 불가능

사소해 보이지만 계속 신경 쓰이는 부분들이었다. 결국 **직접 PDF 변환 기능을 구현하기로 결정**했다.

## PDF 변환 라이브러리 탐색

### 1. react-to-pdf

[react-to-pdf](https://www.npmjs.com/package/react-to-pdf)

가장 먼저 시도한 것은 `react-to-pdf` 라이브러리였다. 그러나 즉시 문제가 발생했다.

이 라이브러리는 내부적으로 `html2canvas`를 사용하는데, Canvas 기반으로 DOM을 변환하기 때문에 **최신 CSS 기능을 완벽하게 지원하지 못했다**. 특히 내가 사용하고 있던 Tailwind CSS와 호환성 문제가 있었다. Tailwind CSS에서는 색상 변수를 정의할 때 CSS 함수인 oklch를 사용하는데, 이를 지원하지 않았다.

물론 번들링 시 oklch 함수를 hex로 변환하거나 Tailwind 버전을 낮추는 등의 해결책도 있었다. 하지만 최신 기술 스택으로 프로젝트를 구성하고 싶었고, 문제를 근본적으로 해결하지 못한다는 느낌이 들어 과감하게 다른 대안을 찾았다. 

### 2. react-pdf

[react-pdf](https://react-pdf.org/)

다음으로 고려한 것은 `react-pdf` 라이브러리였다. 아래 블로그에서 알게 된 라이브러리로, PDF 생성 결과물의 품질이 우수하다는 후기가 있었다.

[[kakao tech bootcamp] React 컴포넌트를 PDF로 만들기(react-pdf(O), react-to-pdf(X))](https://cdragon.tistory.com/entry/kakao-tech-bootcamp-React-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8%EB%A5%BC-PDF%EB%A1%9C-%EB%A7%8C%EB%93%A4%EA%B8%B0react-pdfO-react-to-pdfX)

하지만 큰 문제가 있었다. 이 라이브러리는 **완전히 다른 컴포넌트 체계**를 사용한다. 즉, 기존에 작성한 React 컴포넌트를 그대로 사용할 수 없고, react-pdf 전용 컴포넌트로 처음부터 다시 구현해야 했다.

내가 원했던 것은 현재 상태 그대로 PDF 변환 기능만 추가하는 것이었다. PDF 변환을 위해 이력서 전체를 다시 만드는 것은 비효율적이라고 판단했다.

### 3. Puppeteer: 최종 선택

고민 끝에 선택한 것은 서버사이드 솔루션인 **Puppeteer**였다.

## Puppeteer란?

[puppeteer](https://pptr.dev/)

Puppeteer는 Google에서 개발한 Node.js 라이브러리로, Chrome 브라우저를 프로그래밍 방식으로 제어할 수 있게 해준다. 그리고 브라우저의 인쇄 기능을 활용한 벡터 기반 pdf 생성 기능도 포함하고 있다. 

## 아키텍처 전환: React에서 Next.js로

Puppeteer 도입 결정과 함께 중요한 변화가 필요했다. **서버 환경이 필수**라는 점이었다.

## 마이그레이션 과정

Puppeteer는 Node.js 환경에서만 실행되기 때문에 서버사이드 기능을 제공하는 프레임워크가 필요했다.

다행히 React에서 Next.js로의 마이그레이션은 예상보다 훨씬 간단했다. 복잡한 상태 관리나 클라이언트 로직이 많지 않은 정적 페이지였기 때문에, 폴더 구조를 조정하고 몇 가지 설정만 변경하니 바로 정상 동작함을 확인할 수 있었다.

### PDF 변환 기능 구현

Next.js로 마이그레이션을 완료한 후, API Route를 활용하여 PDF 변환 기능을 구현했다.

### 구현 세부사항

**핵심 기능:**

1. 특정 요소 제외: `.no-pdf` 클래스를 가진 요소(PDF 변환 버튼 등)를 자동으로 숨김
2. 페이지 여백 설정: A4 용지 기준으로 상하단 여백 조정
3. 배경색 보존: `printBackground` 옵션 사용 

**API 엔드포인트 코드:**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const urlParam = searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter is required' }, 
      { status: 400 }
    );
  }

  // --no-sandbox: Docker 등 제한된 환경에서 실행을 위해 필요
  // --disable-setuid-sandbox: 권한 관련 이슈 해결
  // --disable-web-security: CORS 문제 방지
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
    ],
  });

  const page = await browser.newPage();
  // 모든 네트워크 요청 대기
  await page.goto(url, { waitUntil: 'networkidle0' });

  // PDF에서 제외할 요소 숨기기
  await page.evaluate(() => {
    const elements = document.querySelectorAll('.no-pdf');
    elements.forEach(item => {
      (item as HTMLElement).style.display = 'none';
    });
  });

  // PDF 생성
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '40px',
      bottom: '40px'
    }
  });

  await browser.close();

  return new NextResponse(Buffer.from(pdfBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="resume.pdf"',
    },
  });
}
```

# 결과 및 회고

결과는...?

[웹 이력서 링크](https://elioground.com/my-resume/)

## pdf 변환 결과

![](resume1.png)
![](resume2.png)
![](resume3.png)
![](resume4.png)


## 성과

PDF 변환 시 몇 초의 시간이 소요되지만, 원하는 방식대로 완벽한 PDF를 생성할 수 있게 되었다. 웹에서 보이는 그대로의 디자인과 레이아웃이 PDF에 반영되어, 별도로 PDF용 이력서를 만들 필요가 없다는 점이 가장 큰 장점이었다.

# 마치며

개발자로서 자신을 표현하는 이력서를 직접 만들어보는 것은 단순히 문서를 작성하는 것 이상의 의미가 있다고 생각한다. 특히나 웹을 활용하는 건 지금까지 자신이 쌓아온 역량을 그대로 보여줄 수 있기에 더욱더 의미가 있다. 나 또한 github Actions를 활용한 CI/CD, docker 활용 등 비교적 최근에 배운 부분들도 활용하려고 노력했다.

그동안 정말 여러 이력서를 작성해왔지만, 개인적으로 이번 이력서가 가장 마음에 든다. 단순히 결과물이 좋아서가 아니다. 회사 지원을 위한 문서가 아닌, 문제를 정의하고 해결책을 찾아가는 과정 자체가 즐거웠기 때문이다. 이 과정을 통해 처음 개발자가 되었던 3년 전보다 확실히 성장했다는 것을 느낄 수 있었다.

# 참고자료

- [현섭님의 이력서](https://hyunseob.github.io/resume/)
- [[kakao tech bootcamp] React 컴포넌트를 PDF로 만들기(react-pdf(O), react-to-pdf(X))](https://cdragon.tistory.com/entry/kakao-tech-bootcamp-React-%EC%BB%B4%ED%8F%AC%EB%84%8C%ED%8A%B8%EB%A5%BC-PDF%EB%A1%9C-%EB%A7%8C%EB%93%A4%EA%B8%B0react-pdfO-react-to-pdfX)
- [react-to-pdf npm 페이지](https://www.npmjs.com/package/react-to-pdf)
- [react-pdf 공식 문서](https://react-pdf.org/)
- [Puppeteer 공식 문서](https://pptr.dev/)
