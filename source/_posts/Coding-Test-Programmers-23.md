---
title: '[Coding Test] 프로그래머스 -콜라츠 추측-'
index_img: /img/programmers.png
categories:
  - Coding-Test
  - Programmers
tags:
  - Coding-Test
  - Programmers
  - Lv.1
date: 2022-11-22 13:46:42
---
# 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/12943

# 🤨생각하기
문제 그대로 구현하면 된다.

# 😎내 풀이
```js
function solution(num) {
  if (num === 1) return 0
  let cnt = 0
  while (true) {
    if (num === 1) {
      return cnt
    }
    if (cnt === 501) {
      return -1
    }
    if (num % 2 === 0) {
      num = num / 2
    } else {
      num = num * 3 + 1
    }
    cnt++
  }
}
```