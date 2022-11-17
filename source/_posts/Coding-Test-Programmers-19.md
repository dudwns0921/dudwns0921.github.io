---
title: '[Coding Test] 프로그래머스 -제일 작은 수 제거하기-'
categories:
  - Coding-Test
  - Programmers
tags:
  - Coding-Test
  - Programmers
  - Lv.1
date: 2022-11-17 14:18:41
---
# 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/12935

# 🤨생각하기
문제 그대로 구현

# 😎내 풀이
```js
function solution(arr) {
  if (arr.length == 1) return [-1]
  const min = Math.min(...arr)
  let answer = arr
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == min) answer.splice(i, 1)
  }
  return answer
}
```