---
title: '[Coding Test] 프로그래머스 -평균 구하기-'
categories:
  - Coding-Test
  - Programmers
tags:
  - Coding-Test
  - Programmers
  - Lv.1
date: 2022-11-22 13:48:04
---
# 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/12944

# 🤨생각하기
배열의 합을 구해 배열의 길이로 나눠주면 되는 문제이다.

다양한 방법들이 있겠지만, 배열 요소들의 값을 누적시킬 수 있는 reduce 메서드를 사용하면 간결한 코드를 짤 수 있다.

# 😎내 풀이
```js
function solution(arr) {
  return arr.reduce((prev, curr) => prev + curr) / arr.length
}
```