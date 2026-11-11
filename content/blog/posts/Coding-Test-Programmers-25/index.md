---
title: '[Coding Test] 프로그래머스 -하샤드 수-'
cover: programmers.png
categories:
  - Coding-Test
  - Programmers
tags:
  - Coding-Test
  - Programmers
  - Lv.1
date: 2022-11-22 13:51:00
---
# 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/12947

# 🤨생각하기
주어진 정수가 해당 정수의 자릿값의 합으로 나누어 떨어지는지 확인하는 문제이다.

이전 문제에서도 확인할 수 있지만, 여러 요소들의 합을 구할 때 reduce를 사용하면 좀 더 간결한 코드가 된다.

# 😎내 풀이
```js
function solution(x) {
  const digitSum = x
    .toString()
    .split('')
    .reduce((prev, curr) => Number(prev) + Number(curr))
  if (x % digitSum === 0) {
    return true
  } else {
    return false
  }
}
```