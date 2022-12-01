---
title: '[Coding Test] 프로그래머스 -짝수와 홀수-'
index_img: /img/programmers.png
categories:
  - Coding-Test
  - Programmers
tags:
  - Coding-Test
  - Programmers
  - Lv.1
date: 2022-11-17 14:32:57
---
# 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/12937

# 🤨생각하기
문제 그대로 구현

# 😎내 풀이
```js
function solution(num) {
  if (num % 2 === 0) {
    return 'Even'
  } else {
    return 'Odd'
  }
}
```