---
title: '[Coding Test] 프로그래머스 -수박수박수박수박수박수?-'
index_img: /img/programmers.png
categories:
  - Coding-Test
  - Programmers
tags:
  - Coding-Test
  - Programmers
  - Lv.1
date: 2022-11-17 12:31:29
---
# 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/12922

# 🤨생각하기
문제 그대로 구현

# 😎내 풀이
```js
function solution(n) {
  var answer = ''
  for (let i = 1; i <= n; i++) {
    if (i % 2 !== 0) {
      answer += '수'
    } else {
      answer += '박'
    }
  }
  return answer
}
```