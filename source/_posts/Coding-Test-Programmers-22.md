---
title: '[Coding Test] 프로그래머스 -최대공약수와 최소공배수-'
categories:
  - Coding-Test
  - Programmers
tags:
  - Coding-Test
  - Programmers
  - Lv.1
date: 2022-11-22 13:31:01
---
# 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/12940

# 🤨생각하기
여러 방법들이 있겠지만, 유클리드 호제법에 대한 개념을 요구하는 문제이다.

유클리드 호제법을 간단하게 정리하면 아래와 같다.
> a, b(단, a>b)에 대해서 a를 b로 나눈 나머지를 r이라 하면, a와 b의 최대공약수는 b와 r의 최대공약수와 같다.

# 😎내 풀이
```js
function getGcd(n, m) {
  let gcd
  if (n < m) {
    ;[n, m] = [m, n]
  }
  while (true) {
    if (n < m) {
      ;[n, m] = [m, n]
    }
    if (n % m == 0) {
      gcd = m
      break
    }
    n = n % m
  }
  return gcd
}

function solution(n, m) {
  const product = n * m
  let answer = []
  const gcd = getGcd(n, m)
  answer.push(gcd, product / gcd)
  return answer
}
```