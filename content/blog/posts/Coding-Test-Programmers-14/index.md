---
title: '[Coding Test] 프로그래머스 -이상한 문자 만들기-'
cover: programmers.png
categories:
  - Coding-Test
  - Programmers
tags:
  - Coding-Test
  - Programmers
  - Lv.1
date: 2022-11-17 13:51:40
---
# 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/12930

# 🤨생각하기
> 문자열 전체의 짝/홀수 인덱스가 아니라, 단어(공백을 기준)별로 짝/홀수 인덱스를 판단해야합니다.

위 조건을 만족시키기 위해서는 주어진 문자열을 먼저 공백을 기준으로 나누어야 한다. 그리고 그 나눠진 각각의 문자열을 순회하며 소문자, 대문자로 변경시키면 된다.

# 😎내 풀이
```js
function solution(s) {
  return s
    .split(' ')
    // 공백을 기준으로 나눔
    .map((word) => {
      return word
        .split('')
        // 문자열의 글자 하나하나를 요소로 갖는 배열 생성
        // 배열로 만든 이유는 map 메서드를 사용하기 위함
        .map((letter, index) => {
          if (index % 2 === 0) {
            return letter.toUpperCase()
          } else {
            return letter.toLowerCase()
          }
        })
        .join('')
    })
    .join(' ')
}
```