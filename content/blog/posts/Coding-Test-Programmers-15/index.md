---
title: '[Coding Test] 프로그래머스 -자릿수 더하기-'
cover: programmers.png
categories:
  - Coding-Test
  - Programmers
tags:
  - Coding-Test
  - Programmers
  - Lv.1
date: 2022-11-17 13:57:55
---
# 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/12931

# 🤨생각하기
문제 그대로 구현

조금 설명을 덧붙이자면 문자열은 순회가 가능한 iterator이기 때문에 숫자를 문자열로 만들어 각 자릿수를 순회하는 방법이다.

# 😎내 풀이
```js
function solution(n) {
  let sum = 0
  for (const a of n.toString()) {
    sum += parseInt(a)
  }
  return sum
}
```