---
title: '[Coding Test] 프로그래머스 -x만큼 간격이 있는 n개의 숫자-'
cover: programmers.png
categories:
  - Coding-Test
  - Programmers
tags:
  - Coding-Test
  - Programmers
  - Lv.1
date: 2022-11-30 15:10:29
---
# 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/12954

# 🤨생각하기
문제 그대로 구현하면 된다.

# 😎내 풀이
```js
function solution(x, n) {
  var answer = []
  for (let i = 1; i <= n; i++) {
    answer.push(x * i)
  }
  return answer
}
```