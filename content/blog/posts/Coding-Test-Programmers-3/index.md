---
title: '[Coding Test] 프로그래머스 -가운데 글자 가져오기-'
cover: programmers.png
categories:
  - Coding-Test
  - Programmers
tags:
  - Coding-Test
  - Programmers
  - Lv.1
date: 2022-11-16 10:18:04
---
# 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/12903

# 🤨생각하기
문제 그대로 구현

# 😎내 풀이
```js
function solution(s) {
  if (s.length % 2 === 0) {
    return s.substring(
      Math.floor(s.length / 2) - 1,
      Math.floor(s.length / 2) + 1,
    )
  } else {
    return s.substring(Math.floor(s.length / 2), Math.floor(s.length / 2) + 1)
  }
  // 소수점 제거를 위한 floor 메서드 사용
}
```