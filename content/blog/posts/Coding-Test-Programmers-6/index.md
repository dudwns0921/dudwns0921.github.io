---
title: '[Coding Test] 프로그래머스 -두 정수 사이의 합-'
cover: programmers.png
categories:
  - Coding-Test
  - Programmers
tags:
  - Coding-Test
  - Programmers
  - Lv.1
date: 2022-11-16 14:03:36
---
# 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/12912

# 🤨생각하기
문제 그대로 구현

a,b가 대소 구분 없이 주어진다는 점이 신경 써야할 부분인데, 구조 분해 할당을 사용하면 쉽게 두 변수의 값을 바꿀 수 있다.

# 😎내 풀이
```js
function solution(a, b) {
  if (a === b) return a
  if (b < a) {
    ;[a, b] = [b, a]
  }
  let sum = 0
  for (let i = a; i <= b; i++) {
    sum += i
  }
  return sum
}
```