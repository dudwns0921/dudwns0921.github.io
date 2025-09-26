---
title: Docker 톺아보기
date: 2025-09-22 16:27:07
categories:
tags:
---
# 서론
Devops 문화 구축에 관심을 가지게 되면서 자연스레 Docker에 관심을 가지게 되었다. 여러 개인 프로젝트를 Docker로 배포하며 경험한 내용과 알게 된 점들을 정리해보려고 한다.

# Docker란?
> *dockerdocs*
> 
> *Docker는 애플리케이션 개발, 배포 및 실행을 위한 개방형 플랫폼입니다. Docker를 사용하면 애플리케이션과 인프라를 분리하여 소프트웨어를 신속하게 배포할 수 있습니다. Docker를 사용하면 애플리케이션을 관리하는 것과 동일한 방식으로 인프라를 관리할 수 있습니다. Docker의 코드 배포, 테스트 및 배포 방법론을 활용하면 코드 작성과 운영 환경 실행 간의 지연 시간을 크게 줄일 수 있습니다.*


Docker의 핵심은 애플리케이션과 인프라를 분리하는 데 있다. 컨테이너라는 표준화된 단위로 애플리케이션을 실행함으로써, 특정 서버 환경에 종속되지 않고 어디서든 동일하게 동작할 수 있도록 해준다.

즉, Docker는 애플리케이션과 실행환경을 하나로 묶어 배포할 수 있게 해주는 기술로, 다양한 인프라 환경에서도 일관된 실행을 보장한다.

# 시작하기

> https://docs.docker.com/desktop/

Windows와 macOS에서 Docker를 사용하려면 Docker Desktop을 반드시 설치하고 실행해야 한다.

만약 Docker Desktop을 실행하지 않은 상태에서 `docker ps`와 같은 명령어를 입력하면 아래와 같은 에러가 발생한다.

```
error during connect: Get "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine/v1.51/containers/json": open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.
```

이는 Docker Daemon이 실행되고 있지 않기 때문이다. 리눅스에서는 Docker가 운영체제와 직접 통합되어 별도의 Desktop 프로그램 없이 동작하지만, Windows와 macOS에서는 Docker가 리눅스 VM 안에서만 실행될 수 있기 때문에 Docker Desktop이 VM을 관리하고 실행한다.

결론적으로, 윈도우에서 docker 명령어를 사용하려면 Docker Desktop을 설치하고 반드시 실행해야 정상적으로 컨테이너를 사용할 수 있다.

> https://docs.docker.com/engine/install/ubuntu/

리눅스에서는 도커 엔진만 설치하면 바로 사용할 수 있으며, Docker Desktop은 선택적으로 설치해 GUI 환경을 제공받을 수 있다.

# 실행 흐름

Docker를 활용하는 기본 흐름은 이미지를 만들고, 그 이미지를 기반으로 컨테이너를 실행하는 것이다. 공식 문서에서도 The basics, Building Images, Running Containers 순서로 설명하고 있다.

## 컨테이너란?

컨테이너는 애플리케이션 실행에 필요한 모든 파일을 갖춘 고립된 프로세스다.
즉, 애플리케이션과 그 실행 환경(OS, 라이브러리, 의존성 등)을 함께 패키징하여 다른 컨테이너나 호스트 환경과 독립적으로 동작할 수 있게 해준다.

흔히 가상환경인 VM과 많이 비교되는데, 아래와 같은 차이점이 있다.

| 항목       | VM         | 컨테이너            |
| -------- | ---------- | --------------- |
| 커널       | 자체 커널 사용   | 호스트 커널 공유       |
| OS 포함 여부 | 전체 운영체제 포함 | 필요 최소 실행 환경만 포함 |
| 자원 사용    | 상대적으로 무거움  | 가벼움, 빠른 시작 가능   |
| 목적       | 완전히 독립된 환경 | 애플리케이션 단위 격리    |

인프라적 성격을 갖고 있다는 점에서는 같지만, 컨테이너가 좀더 경량화된 형태라고 보면 좋을 것 같다.

## 이미지란?

이미지는 컨테이너 실행에 필요한 파일, 실행 바이너리, 라이브러리, 설정 등을 모두 포함한 표준화된 패키지다. 따라서 이미지는 컨테이너의 설계도 역할을 한다. 

이미지는 단일 덩어리가 아니라 여러 개의 레이어로 구성되는데, 레이어란 파일 시스템의 변경 내역을 담은 층이라고 할 수 있다. 이 개념은 Git의 커밋과 비슷하다. 여러 커밋이 쌓여 최종 소스 코드 저장소를 이루듯, 여러 레이어가 순서대로 쌓여 하나의 완전한 이미지가 만들어진다.

레이어는 Git의 커밋과 마찬가지로 불변성을 가진다. 한 번 생성된 레이어는 수정할 수 없으며, 새로운 변경 사항은 항상 새로운 레이어로 추가된다. Git 커밋도 스냅샷, 부모 커밋, 메타데이터를 기반으로 생성되며, 이 조합으로 만들어진 해시값 덕분에 변경이 불가능하다.

레이어는 불변성뿐만 아니라 재사용성도 가진다. 동일한 베이스 레이어는 여러 이미지에서 공유될 수 있기 때문에, 예를 들어 Python 런타임이 포함된 레이어를 한 번 내려받으면 이후 다른 Python 애플리케이션 이미지에서도 그대로 활용된다. 이 덕분에 이미지 빌드 속도가 빨라지고 저장 공간과 네트워크 자원을 절약할 수 있다.

# 이미지 만들기

이미지를 만들기 위해서는 Dockerfile을 사용한다. Dockerfile은 컨테이너 이미지를 생성하는 데 사용되는 텍스트 기반 문서이다. 이미지 빌더에 실행할 명령, 복사할 파일, 시작 명령 등에 대한 지침을 제공한다.

이번 글에서는 간단한 Node.js 애플리케이션을 예시로 Docker 이미지를 만들어 실행해보겠다.
```
📦docker-prac
 ┣ 📂node_modules
 ┣ 📜.dockerignore
 ┣ 📜Dockerfile
 ┣ 📜index.js
 ┣ 📜package.json
 ┗ 📜pnpm-lock.yaml
```

```js
// index.js
import _ from 'lodash';

// 샘플 데이터: 사용자 목록
const users = [
  { id: 1, name: 'Alice', age: 28, department: 'Engineering', salary: 75000, active: true },
  { id: 2, name: 'Bob', age: 32, department: 'Marketing', salary: 60000, active: false },
  { id: 3, name: 'Charlie', age: 25, department: 'Engineering', salary: 70000, active: true },
  { id: 4, name: 'Diana', age: 30, department: 'HR', salary: 65000, active: true },
  { id: 5, name: 'Eve', age: 27, department: 'Marketing', salary: 62000, active: false },
  { id: 6, name: 'Frank', age: 35, department: 'Engineering', salary: 85000, active: true }
];

// 제품 데이터
const products = [
  { id: 1, name: 'Laptop', category: 'Electronics', price: 1200, stock: 15 },
  { id: 2, name: 'Mouse', category: 'Electronics', price: 25, stock: 50 },
  { id: 3, name: 'Keyboard', category: 'Electronics', price: 80, stock: 30 },
  { id: 4, name: 'Monitor', category: 'Electronics', price: 300, stock: 20 },
  { id: 5, name: 'Chair', category: 'Furniture', price: 150, stock: 10 }
];

console.log('=== Lodash 데이터 처리 예제 ===\n');

// 1. 배열 필터링 - 활성 사용자만 추출
const activeUsers = _.filter(users, { active: true });
console.log('1. 활성 사용자들:');
console.log(activeUsers.map(user => `${user.name} (${user.department})`));
console.log();

// 2. 그룹화 - 부서별로 사용자 그룹화
const usersByDepartment = _.groupBy(users, 'department');
console.log('2. 부서별 사용자 수:');
_.forEach(usersByDepartment, (users, department) => {
  console.log(`${department}: ${users.length}명`);
});
console.log();

// 3. 정렬 - 급여 기준 내림차순 정렬
const sortedBySalary = _.orderBy(users, ['salary'], ['desc']);
console.log('3. 급여 순위 (높은 순):');
sortedBySalary.forEach((user, index) => {
  console.log(`${index + 1}. ${user.name}: $${user.salary.toLocaleString()}`);
});
console.log();

// 4. 집계 - 평균 급여 계산
const avgSalary = _.meanBy(users, 'salary');
console.log(`4. 평균 급여: $${avgSalary.toLocaleString()}`);
console.log();

// 5. 변환 - 사용자 이름만 추출하여 대문자로 변환
const userNames = _.map(users, user => _.upperCase(user.name));
console.log('5. 사용자 이름 (대문자):');
console.log(userNames.join(', '));
console.log();

// 6. 검색 - 특정 조건으로 사용자 찾기
const engineerOver30 = _.find(users, user => 
  user.department === 'Engineering' && user.age > 30
);
console.log('6. 30세 이상 엔지니어:');
console.log(engineerOver30 ? `${engineerOver30.name} (${engineerOver30.age}세)` : '없음');
console.log();

// 7. 데이터 요약 통계
const stats = {
  totalUsers: users.length,
  activeUsers: _.filter(users, 'active').length,
  avgAge: _.round(_.meanBy(users, 'age'), 1),
  departments: _.uniq(_.map(users, 'department')),
  salaryRange: {
    min: _.minBy(users, 'salary').salary,
    max: _.maxBy(users, 'salary').salary
  }
};

console.log('7. 통계 요약:');
console.log(`- 총 사용자: ${stats.totalUsers}명`);
console.log(`- 활성 사용자: ${stats.activeUsers}명`);
console.log(`- 평균 나이: ${stats.avgAge}세`);
console.log(`- 부서: ${stats.departments.join(', ')}`);
console.log(`- 급여 범위: $${stats.salaryRange.min.toLocaleString()} ~ $${stats.salaryRange.max.toLocaleString()}`);
console.log();

// 8. 제품 데이터 처리
console.log('8. 제품 분석:');
const productsByCategory = _.groupBy(products, 'category');
const totalInventoryValue = _.sumBy(products, product => product.price * product.stock);

console.log('카테고리별 제품:');
_.forEach(productsByCategory, (products, category) => {
  const categoryValue = _.sumBy(products, p => p.price * p.stock);
  console.log(`- ${category}: ${products.length}개 제품, 총 가치 $${categoryValue.toLocaleString()}`);
});
console.log(`총 재고 가치: $${totalInventoryValue.toLocaleString()}`);
console.log();

// 9. 복잡한 데이터 변환
const userSummary = _.chain(users)
  .filter('active')
  .groupBy('department')
  .mapValues(users => ({
    count: users.length,
    avgSalary: _.round(_.meanBy(users, 'salary')),
    names: _.map(users, 'name')
  }))
  .value();

console.log('9. 활성 사용자 부서별 요약:');
_.forEach(userSummary, (summary, department) => {
  console.log(`${department}:`);
  console.log(`  - 인원: ${summary.count}명`);
  console.log(`  - 평균 급여: $${summary.avgSalary.toLocaleString()}`);
  console.log(`  - 구성원: ${summary.names.join(', ')}`);
});

console.log('\n=== 애플리케이션 실행 완료 ===');


```

## 단일 스테이지

```
# Dockerfile

# Docker에서 제공하는 Node.js 공식 이미지를 베이스 레이어로 사용
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# pnpm 활성화 및 의존성 설치
RUN corepack enable pnpm

# package.json과 lock 파일 먼저 복사 → 캐시 활용
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 애플리케이션 코드 복사
COPY . .

# 앱 실행
CMD ["node", "index.js"]
```
앞에서 말했듯이 Docker 이미지는 레이어로 구성되는데, 각 레이어는 FROM, WORKDIR 와 같은 새로운 명령 때마다 하나씩 쌓인다.

```
docker build -t docker-example-single .
```
위 명령어를 실행하면 현재 디렉토리에 있는 Dockerfile을 기반으로 docker-example-single이라는 이름의 도커 이미지를 생성하게 된다.

## 멀티 스테이지
앞에서는 단일 스테이지로 Dockerfile을 구성했다. 사실 저 정도 규모의 프로젝트는 단일 스테이지로 Dockefile을 구성하는 게 맞다고 생각하지만, 실무나 규모가 있는 프로젝트에서는 멀티 스테이지를 사용하는 것이 효과적이며 공식 문서에서도 Best Practice에 멀티 스테이지 내용을 담고 있다.

```
# 1. 빌드 단계
FROM node:18-alpine AS builder

WORKDIR /app

# pnpm 활성화 및 의존성 설치
RUN corepack enable pnpm

# package.json과 lock 파일 먼저 복사 → 캐시 활용
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 애플리케이션 코드 복사
COPY . .

# 2. 실행 단계
FROM node:18-alpine

WORKDIR /app

# pnpm 활성화
RUN corepack enable pnpm

# 런타임 의존성만 설치 (prod 모드)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# 앱 코드/산출물만 복사
COPY --from=builder /app . 

# 앱 실행
CMD ["node", "index.js"]
```
단일 스테이지 Dockerfile과 비교하면, 멀티 스테이지는 개발 의존성과 런타임 의존성을 분리하고 있다. 단일 스테이지에서는 모든 의존성이 포함되어 이미지가 상대적으로 크고 불필요한 패키지도 포함될 수 있다. 반면 멀티 스테이지에서는 빌드 단계에서만 개발 의존성을 설치하고, 실행 단계에서는 런타임 의존성만 포함하기 때문에 최종 이미지 크기가 작아지고 보안상 안전하며 배포 효율도 높다. 또한 불필요한 파일과 툴이 최종 이미지에 포함되지 않아, 운영 환경에서 더 최적화된 컨테이너를 실행할 수 있다.

결론적으로 멀티 스테이지는 이미지 최적화, 보안 강화, 배포 효율 향상이라는 장점을 제공하며, 특히 규모가 있는 프로젝트나 빌드 산출물이 많은 프로젝트에서 유용하게 사용된다.

# 컨테이너 실행하기
## Docker CLI
```
docker run docker-example-single
```
run 명령어를 사용해 위에서 만들었던 이미지를 바탕으로 컨테이너를 실행하면 아래와 같은 출력을 확인할 수 있다.

```
=== Lodash 데이터 처리 예제 ===

1. 활성 사용자들:
[
  'Alice (Engineering)',
  'Charlie (Engineering)',
  'Diana (HR)',
  'Frank (Engineering)'
]

2. 부서별 사용자 수:
Engineering: 3명
Marketing: 2명
HR: 1명

3. 급여 순위 (높은 순):
1. Frank: $85,000
2. Alice: $75,000
3. Charlie: $70,000
4. Diana: $65,000
5. Eve: $62,000
6. Bob: $60,000

4. 평균 급여: $69,500

5. 사용자 이름 (대문자):
ALICE, BOB, CHARLIE, DIANA, EVE, FRANK

6. 30세 이상 엔지니어:
Frank (35세)

7. 통계 요약:
- 총 사용자: 6명
- 활성 사용자: 4명
- 평균 나이: 29.5세
- 부서: Engineering, Marketing, HR
- 급여 범위: $60,000 ~ $85,000

8. 제품 분석:
카테고리별 제품:
- Electronics: 4개 제품, 총 가치 $27,650
- Furniture: 1개 제품, 총 가치 $1,500
총 재고 가치: $29,150

9. 활성 사용자 부서별 요약:
Engineering:
  - 인원: 3명
  - 평균 급여: $76,667
  - 구성원: Alice, Charlie, Frank
HR:
  - 인원: 1명
  - 평균 급여: $65,000
  - 구성원: Diana

=== 애플리케이션 실행 완료 ===
```
## Docker Compose



# 📚참고자료
- https://docs.docker.com/