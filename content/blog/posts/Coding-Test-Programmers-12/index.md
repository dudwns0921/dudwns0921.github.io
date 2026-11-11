---
title: '[Coding Test] 프로그래머스 -문자열을 정수로 바꾸기-'
cover: programmers.png
categories:
  - Coding-Test
  - Programmers
tags:
  - Coding-Test
  - Programmers
  - Lv.1
date: 2022-11-17 13:43:20
---
# 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/12925

# 🤨생각하기
사실 Number 생성자나 ParseInt 메서드를 사용하면 정말 간단하게 풀 수 있는 문제이다.

다만 사칙연산을 사용해 문자열을 자동으로 수로 바꾸는 풀이도 존재했다.  

# 😎내 풀이
```js
function solution(s) {
  return Number(s)
  // return s/1
}
```