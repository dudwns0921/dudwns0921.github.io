---
title: '[Coding Test] 프로그래머스 -정수 제곱근 판별-'
cover: programmers.png
categories:
  - Coding-Test
  - Programmers
tags:
  - Coding-Test
  - Programmers
  - Lv.1
date: 2022-11-17 14:09:15
---
# 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/12934

# 🤨생각하기
문제 그대로 구현

# 😎내 풀이
```js
function solution(n) {
  if (Number.isInteger(Math.sqrt(n))) {
    return (Math.sqrt(n) + 1) ** 2
  } else {
    return -1
  }
}
```