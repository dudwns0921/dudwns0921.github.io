---
title: '[Coding Test] 프로그래머스 -자연수 뒤집어 배열로 만들기-'
cover: programmers.png
categories:
  - Coding-Test
  - Programmers
tags:
  - Coding-Test
  - Programmers
  - Lv.1
date: 2022-11-17 14:03:22
---
# 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/12932

# 🤨생각하기
문제 그대로 구현

수를 뒤집는 방법에는 여러 가지가 있겠지만, 나는 문자열로 만들어 뒤집는 방법을 선택했다.

# 😎내 풀이
```js
function solution(n) {
  let answer = []
  for (const letter of n.toString().split('').reverse()) {
    answer.push(parseInt(letter))
  }
}
```