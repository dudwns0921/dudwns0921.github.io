---
title: '[Coding Test] 프로그래머스 -문자열 내 p와 y의 개수-'
categories:
  - Coding-Test
  - Programmers
tags:
  - Coding-Test
  - Programmers
  - Lv.1
date: 2022-11-16 14:21:55
---
# 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/12916

# 🤨생각하기
문제 그대로 구현하면 된다.

# 😎내 풀이
```js
function solution(s) {
  let pCnt = 0
  let yCnt = 0
  for (const letter of s) {
    if (letter === 'p' || letter === 'P') {
      pCnt++
    } else if (letter === 'y' || letter === 'Y') {
      yCnt++
    }
  }
  if (pCnt === yCnt) {
    return true
  } else {
    return false
  }
}
```