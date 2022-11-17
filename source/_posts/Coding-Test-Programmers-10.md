---
title: '[Coding Test] 프로그래머스 -서울에서 김서방 찾기-'
categories:
  - Coding-Test
  - Programmers
tags:
  - Coding-Test
  - Programmers
  - Lv.1
date: 2022-11-17 12:18:55
---
# 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/12919

# 🤨생각하기
문제 그대로 구현

# 😎내 풀이
```js
function solution(seoul) {
  for (let i = 0; i < seoul.length; i++) {
    if (seoul[i] === 'Kim') {
      return `김서방은 ${i}에 있다`
    }
  }
}
```