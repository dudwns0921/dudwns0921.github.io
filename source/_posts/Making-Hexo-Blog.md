---
title: Hexo로 블로그 만들기
date: 2022-10-14 08:30:26
categories:
- Hexo
tags:
- Tutorial
---
개인 블로그를 만들어야겠다는 생각만 계속 하다가 우연히 회사에서 일을 하다가 Hexo 프레임워크를 접하게 되었다. 보자마자 나한테 딱 적합한 프레임워크라는 생각이 들어서 Hexo를 통해 개인 블로그를 만들어야겠다고 결정했다.

다른 무엇보다도 마크다운 파일을 활용할 수 있다는 점이 가장 매력적으로 다가왔다. 그동안 개인적으로 깃허브의 TIL 저장소에 개발 관련 지식들을 마크다운 파일로 계속 작성해왔었는데, 그 자료들을 그대로 사용할 수 있게 되었다.

# 🙋‍♂️개요

> *공식문서*
>
> *Hexo는 빠르고 간단하고 파워풀한 블로그 프레임워크입니다. Markdown(또는 다른 언어)을 사용하여 포스트를 작성하면 Hexo는 금세 멋진 테마를 가미해서 정적인 파일을 생성합니다.*

# 🔧설치

Hexo의 설치를 위해서는 아래 두 가지가 필요하다.

- Node.js (Should be at least Node.js 10.13, recommends 12.0 or higher)
- Git

두 가지를 모두 설치했다면, **npm**을 이용해서 **Hexo**를 설치해주면 된다.

```
$ npm install -g hexo-cli
```

# 👶초기화

**Hexo**를 설치했다면, 타겟 `<folder>`의 **Hexo**를 초기화하기 위해 터미널에서 아래 명령어를 실행하자.

```
$ hexo init <folder>
```

초기화가 완료되면 다음과 같은 폴더 구조를 가지게 된다.

```
.
├── _config.yml
├── package.json
├── scaffolds
├── source
|   ├── _drafts
|   └── _posts
└── themes
```

## _config.yml

- 환경설정 파일

## scaffolds

- **Hexo**는 **scaffold** 폴더를 기준으로 포스트를 생성
- 다시 말하면 문서의 기본 틀이 위치하는 폴더이다.

## source

- 웹 사이트 컨텐츠 폴더
- **Hexo**는 숨겨진 파일과 _ (언더스코어)로 시작하는 파일 및 폴더들을 무시(**_posts** 폴더는 제외)
- 렌더링이 가능한 파일들(ex. Markdown, HTML)은 처리된 후 public 폴더로 들어감
- 그 외 파일들은 단순히 복사

## themes

- **Hexo**는 **theme**와 **source** 폴더의 컨텐츠를 혼합해 정적인 웹 사이트를 생성

# 🤔튜토리얼

> 아래 튜토리얼은 hexo 6.3.0을 기준으로 작성됨.

## 초기 화면 확인

**npm**을 통해 **Hexo**를 설치하면 기본적으로 [landscape](https://github.com/hexojs/hexo-theme-landscape#readme) 테마가 설정되어있고, 1개의 포스트가 작성되어있다.

이를 로컬 서버(http://localhost:4000/)에서 확인하기 위해서는 아래 명령어를 실행시키면 된다.

```
$ hexo server
```

## 포스트 작성하기

포스트를 작성하기 위해서는 **new**라는 명령어를 사용하면 된다.

```
$ hexo new [layout] <title>
```

- **layout**이 제공되지 않으면 **default layout** 사용
- **title**에 공백 포함시 따옴표로 감싸주기

**default layout**은 환경설정 파일인 **_config.yml**에서 확인할 수 있다. 초기에는 **post layout**이 적용되어 있다.

```
$ hexo new "My First post"
```

![](image1.png)

포스트가 정상적으로 작성되었다.

## Front-matter 활용
### Front-matter란?

**Front-matter**는 **YAML** 또는 **JSON**으로 구성된 문단이다. 파일의 처음 부분에 위치해 사용자 글 작성에 대한 설정을 하는데 사용된다.

- **YAML**
```
---
title: Hello World
date: 2013/7/13 20:46:25
---
```
- **JSON**
```
"title": "Hello World",
"date": "2013/7/13 20:46:25"
;;;
```

자세한 설정은 [링크](https://hexo.io/docs/front-matter)를 확인해보자.

### Categories & Tags

위 두 가지는 **Front-matter**의 속성들로, **post**에만 적용이 가능하다. 카테고리는 게시물에 순서대로 적용되기 때문에 계층이 발생하지만 태그는 계층이 발생하지 않기 때문에 순서는 중요하지 않다.
___
그러면 실제로 **Front-matter**를 사용해보자.
1. **scaffolds**폴더에 layout을 작성해준다. 
```
root/scaffolds/sports

---
title: {{ title }}
date: {{ date }}
categories:
- Sports
tags:
- Fun
- Exciting
---
```

2. 명령어를 통해 해당 **layout**을 적용한 **post**를 생성한다.
```bash
$ hexo new sports "About Sports"
```

![](image2.png)

## Asset Folder 활용

### Global Asset Folder

**Assets**은 **source**폴더 안에 위치하는 **post**가 아닌 파일로 **images, CSS, javascript 파일**등이 이에 해당한다. **Hexo** 프로젝트에 많은 이미지 파일을 사용할 것이 아니라면 이미지 파일을 관리하기 가장 쉬운 방법은 이미지 파일들을 `source/images` 디렉토리에 위치시키는 것이다. 

### Post Asset Folder

**Post Asset Folder**는 **Assets**을 주기적으로 사용하며 **post**별로 **Assets**을 구분하고 싶은 사람들을 위해 **Hexo**가 제공하는 기능이다.
이 기능을 사용하기 위해서는 **_config.yml**에서 **post_asset_folder**의 값을 **true**로 변경해주면 된다. 그 다음부터는 **Hexo**가 **post**를 생성할 때마다 **post**와 동일한 이름을 가진 **Asset Folder**를 생성한다. 그리고 **post**에서는 상대 경로를 사용해 **Assets**에 접근할 수 있다. 

### 이미지 넣기

```
_config.yml
post_asset_folder: true
marked:
  prependRoot: true
  postAsset: true
```

위와 같이 설정하면 **Asset image**는 자동으로 해당 포스트의 경로로 **resolve**된다.
예를 들어, `image.jpg`가 `/2020/01/02/foo/image.jpg`에 있다고 한다면, `/2020/01/02/foo` **post**의 **Asset image**라는 걸 의미한다. 그리고 아래와 같이 작성하면, 

```
![](image.jpg)
```

`<img src="/2020/01/02/foo/image.jpg>`로 렌더링된다.

# 🚀배포하기

**Hexo**를 사용하면 다양한 곳에 배포가 가능하지만, 일반적으로 **Github Pages**를 가장 많이 활용한다. 특히 [hexo-deployer-git](https://github.com/hexojs/hexo-deployer-git)패키지를 사용하면 정말 간단하게 **Github Pages**로 배포가 가능하다.

1. 깃허브에서 **username.github.io**의 이름으로 저장소를 만든다. 여기서 **username**은 사용자 본인의 **username**이다.
2. 해당 저장소에서 블로그를 만든다.
3. [hexo-deployer-git](https://github.com/hexojs/hexo-deployer-git)를 설치한다.
```
$ npm install hexo-deployer-git --save
```

4. **_config.yml** 파일에서 배포 관련 설정을 한다.
```
deploy:
  type: git
  repo: <repository url> # https://bitbucket.org/JohnSmith/johnsmith.bitbucket.io
  branch: [branch]
  message: [message]
```
| Option    | Description                                                  | Default                                                      |
| :-------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| **repo**    | 저장소 URL                               |                                                              |
| **branch**  | 브랜치 이름                                                 | **gh-pages** (GitHub) **coding-pages** (Coding.net) **master** (others) |
| **message** | 커밋 메시지                                    | `Site updated: {{ now('YYYY-MM-DD HH:mm:ss') }}`             |
5. **hexo clean && hexo deploy** 명령어로 배포한다.


# 😎마무리
지금까지 **Hexo**를 활용해 블로그를 만드는 법에 대해 간단하게 알아봤다. 물론 깊은 내용을 다루자면 끝도 없겠지만 위 내용으로도 블로그를 만들고 배포하는 데에는 전혀 문제가 없을 것이라고 생각한다.

# 📚참고자료

- https://hexo.io/ko/docs/