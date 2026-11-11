---
title: '[Coding Test] 프로그래머스 -문자열 내 마음대로 정렬하기-'
cover: programmers.png
categories:
  - Coding-Test
  - Programmers
tags:
  - Coding-Test
  - Programmers
  - Lv.1
date: 2022-11-16 14:14:52
---
# 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/12915

# 🤨생각하기
문제를 제대로 이해하지 못해 시간이 좀 걸렸던 문제이다. 

sort 메서드를 사용하면 기본적으로 맨 앞의 문자를 비교해서 정렬이 이루어지는데, 조건을 추가해 두 번째 글자를 기준으로 정렬을 하라는 문제이다.

# 😎내 풀이
```js
function solution(strings, n) {
  return strings.sort((a, b) => {
    if (a[n] < b[n]) return -1
    if (a[n] > b[n]) return 1
    if (a[n] === b[n]) return a < b ? -1 : 1
    return 0
  })
}
```