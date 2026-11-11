---
title: '[Coding Test] 프로그래머스 -나누어 떨어지는 숫자 배열-'
cover: programmers.png
categories:
  - Coding-Test
  - Programmers
tags:
  - Coding-Test
  - Programmers
  - Lv.1
date: 2022-11-16 13:57:02
---
# 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/12910

# 🤨생각하기
문제 그대로 구현

filter 메서드를 사용하면 좀 더 가독성 높은 코드를 작성할 수 있다고 생각한다.

# 😎내 풀이
```js
function solution(arr, divisor) {
  const answer = arr.filter((num) => num % divisor === 0).sort((a, b) => a - b)
  if (answer.length === 0) {
    return [-1]
  } else {
    return answer
  }
}
```