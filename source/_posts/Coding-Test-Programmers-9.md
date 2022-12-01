---
title: '[Coding Test] 프로그래머스 -문자열 다루기 기본-'
index_img: /img/programmers.png
categories:
  - Coding-Test
  - Programmers
tags:
  - Coding-Test
  - Programmers
  - Lv.1
date: 2022-11-17 12:14:27
---
# 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/12918

# 🤨생각하기
문제 그대로 구현

처음에는 정규표현식을 잘 몰라 아래 풀이로 해결했다. 문자가 하나라도 포함되어있는지 확인하면 되기 때문에 정규표현식이 훨씬 간단하다.

# 😎내 풀이
```js
function solution(s) {
  if (s.length !== 4 && s.length !== 6) {
    return false
  }
  for (const letter of s) {
    if (letter.charCodeAt() < 48 || 57 < letter.charCodeAt()) {
      return false
    }
  }
  // if (new RegExp('[^0-9]', 'g').test(s)) {
  //   return false
  // }
  return true
}
```