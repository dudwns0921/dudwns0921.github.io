---
title: '[Coding Test] 프로그래머스 -정수 내림차순으로 배치하기-'
categories:
  - Coding-Test
  - Programmers
tags:
  - Coding-Test
  - Programmers
  - Lv.1
date: 2022-11-17 14:06:47
---
# 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/12933

# 🤨생각하기
문제 그대로 구현

# 😎내 풀이
```js
function solution(n) {
  return parseInt(
    n
      .toString()
      .split('')
      .sort((a, b) => b - a)
      .join(''),
  )
}
```