---
title: "[Coding Test] 프로그래머스 코딩 기초 트레이닝 후기"
date: 2024-01-08 00:00:00
cover: programmers.png
categories:
  - Coding-Test
  - Programmers
tags:
  - Coding-Test
  - Programmers
  - Basic Training
---

나는 '프론트엔드 개발자에게 코딩 테스트는 무슨 의미일까?' 라는 생각을 회사에 들어가서도 계속 했었다. 솔직히 실무에서 코딩 테스트 문제에 필요한 알고리즘, 혹은 자료구조 지식들을 응용한 경험은 거의 없었다. 그래서 사실 알고리즘, 자료구조 공부를 한동안 거의 놓고 있었다.

하지만 최근에 내가 너무 프론트엔드라는 직군에 매몰되어 개발자로서 필요한 공부들을 안하고 있다는 생각이 들었다. 이전에 코딩 테스트를 준비했던 경험이 있지만, 당시에는 그냥 닥치는대로 문제를 풀었을뿐 제대로 된 알고리즘, 자료구조 공부를 하지 않았었다. 새해를 맞이한 김에 코딩 테스트를 기초부터 다시 제대로 준비해보자는 마음으로 프로그래머스의 코딩 기초 트레이닝을 풀어보았다.

총 124문제를 푸는데 한 4일 정도 걸렸던 것 같다. 물론 Lv.0에 해당되는 문제들로 프로그래밍에 익숙해지기 위한 문제들이지만, 나름 이를 통해 얻게 된 점들이 많아 정리를 해보려고 한다.

## 배열 순회하기

이번에 배열을 순회해야 하는 문제들을 풀 때 아래의 방법들을 썼다.

- for문
- forEach
- map
- reduce

그렇지만 for문과 인덱스를 사용해 배열의 원소에 직접 접근하기 보다는 for문을 제외한 3가지 배열 메서드들을 훨씬 많이 활용했었다.

### forEach

먼저 forEach문 같은 경우에는 반환하는 값이 필요하지 않을 때 사용했다. 가령 배열에 저장된 데이터를 Map으로 다시금 정리하는 경우에 forEach를 사용했다.

하지만 forEach는 항상 모든 원소들을 순회하기 때문에, 중간에 반복을 멈추거나 할 필요가 있을 때는 기본적인 for문을 활용했다.

### map

map은 주어진 배열을 순회하며 원소들을 변형시켜야 할 때 사용했다. flatMap을 사용하기도 했는데, flatMap은 map과 달리 콜백 함수의 반환값을 한 단계씩 평탄화한다. 그러니까 map의 콜백 함수의 반환값으로 배열 안의 여러 값들을 한꺼번에 전달하고 싶을 때 flatMap을 사용하면 간편하다.

다음은 그 예시이다.

https://school.programmers.co.kr/learn/courses/30/lessons/181836

```js
function solution(picture, k) {
  return picture.flatMap((v) => {
    return new Array(k).fill(
      v
        .split("")
        .map((v) => {
          return v.repeat(k);
        })
        .join("")
    );
  });
}
```

### reduce

이번에 reduce를 가장 많이 활용했던 것 같다. reduce는 배열을 순회하며 새로운 결과값을 만들어내야 할 때 사용했다. 가장 간단한 예로 배열의 모든 합을 구할 때, 아래와 같이 reduce를 사용했다.

```js
function solution(arr) {
  return arr.reduce((accu, curr) => accu + curr, 0);
}
```

처음에는 굳이 reduce를 사용해야 하나라는 생각도 들었지만, 사용하면 할수록 할 수 있는 게 정말 다양하다는 걸 느끼게 되었다.

## 배열 자르기

- splice
- slice

먼저 splice는 원본 배열을 수정할 때 사용했고, slice는 새로운 배열을 만들 필요가 있을 때 사용했다. slice는 문자열을 자를 때도 사용했다.

## 보스 문제...

이 문제가 왜 기초문제에 포함되어 있을까라는 생각이 보자마자 들었던 문제이다. 오답률이 가장 높아 마지막으로 풀었던 문제인데, 코딩 테스트를 처음 접했다면 많이 당황스러웠을 것 같다.

### 📃문제 링크

https://school.programmers.co.kr/learn/courses/30/lessons/181832

### 🤨생각하기

먼저 이차원 배열을 모두 순회해야 하므로 이차원 배열의 원소 수만큼 연산을 반복하는 for문을 만든다. 좌표 객체 하나를 생성하고 좌표 객체의 x좌표, y좌표, 그리고 방향을 변경해주며 나선형으로 좌표가 이동하게끔 구현하면 된다.

### 😎내 풀이

```js
function solution(n) {
  const twoDimension = Array.from({ length: n }, () => Array(n).fill(0));
  const dot = {
    x: 0,
    y: 0,
    direction: "right",
  };

  for (let i = 1; i <= n * n; i++) {
    twoDimension[dot.y][dot.x] = i;

    switch (dot.direction) {
      case "right":
        if (dot.x === n - 1 || twoDimension[dot.y][dot.x + 1])
          dot.direction = "down";
        break;
      case "left":
        if (dot.x === 0 || twoDimension[dot.y][dot.x - 1]) dot.direction = "up";
        break;
      case "up":
        if (dot.y === 0 || twoDimension[dot.y - 1][dot.x])
          dot.direction = "right";
        break;
      case "down":
        if (dot.y === n - 1 || twoDimension[dot.y + 1][dot.x])
          dot.direction = "left";
        break;
    }

    switch (dot.direction) {
      case "right":
        dot.x++;
        break;
      case "left":
        dot.x--;
        break;
      case "up":
        dot.y--;
        break;
      case "down":
        dot.y++;
        break;
    }
  }

  return twoDimension;
}
```

## 마무리

이전에는 코드들을 덕지덕지 붙여가며 어거지로 문제를 푸는 느낌이었다면, 이번에는 내가 계획한 대로 깔끔하게 문제가 풀려 뿌듯했다. 물론 기초 문제들에 불과하긴 하지만 그래도 조금은 성장했음을 느낄 수 있었다.
