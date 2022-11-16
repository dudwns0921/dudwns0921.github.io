---
title: '[Coding Test] 프로그래머스 -같은 숫자는 싫어-'
categories:
  - Coding-Test
  - Programmers
tags:
  - Coding-Test
  - Programmers
  - Lv.1
date: 2022-11-16 10:25:31
---
# 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/12906

# 🤨생각하기
배열 안에서의 연속된 숫자들을 제거하는 문제이다.

간단한 문제이지만 기존 배열의 순서를 지켜야 하기 때문에 배열의 앞에서부터 순회하며 이전 인덱스의 값과 현재의 값이 같지 않은 경우에만 새로운 배열에다가 push 해주면 된다.

# 😎내 풀이
```js
function solution(arr) {
  let answer = []

  for (const item of arr) {
    if (answer[answer.length - 1] !== item) {
      answer.push(item)
    }
  }

  return answer
}
```