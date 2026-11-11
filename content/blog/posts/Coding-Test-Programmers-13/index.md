---
title: '[Coding Test] 프로그래머스 -약수의 합-'
cover: programmers.png
categories:
  - Coding-Test
  - Programmers
tags:
  - Coding-Test
  - Programmers
  - Lv.1
date: 2022-11-17 13:46:39
---
# 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/12928

# 🤨생각하기
문제 그대로 구현

# 😎내 풀이
```js
function solution(n) {
  let sum = 0
  for (let i = 1; i <= n; i++) {
    if (n % i === 0) sum += i
  }
  return sum
}
```