---
title: '[Coding Test] 프로그래머스 -시저 코드-'
cover: programmers.png
categories:
  - Coding-Test
  - Programmers
tags:
  - Coding-Test
  - Programmers
  - Lv.1
date: 2022-11-22 11:07:13
---
# 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/12926

# 🤨생각하기
ascii 코드 변환 메서드만 알고 있다면 큰 어려움 없이 풀 수 있는 문제이다.

# 😎내 풀이
```js
function solution(s, n) {
  return s
    .split('')
    .map((letter) => {
      const ascii = letter.charCodeAt()
      let asciiConv
      if (65 <= ascii && ascii <= 90) {
        if (90 < ascii + n) {
          // 소문자인데 밀었을 때 z초과
          let excess = ascii + n - 91
          asciiConv = 65 + excess
          return String.fromCharCode(asciiConv)
        }
      } else if (97 <= ascii && ascii <= 122) {
        if (122 < ascii + n) {
          // 대문자인데 밀었을 때 Z초과
          let excess = ascii + n - 123
          asciiConv = 97 + excess
          return String.fromCharCode(asciiConv)
        }
      } else if (ascii == 32) {
        // 공백
        return letter
      }
      // 초과되지 않은 경우
      asciiConv = ascii + n
      return String.fromCharCode(asciiConv)
    })
    .join('')
}
```

# 🚨주의할 점
주의해야 할 부분은 문자를 밀었을 때 z,Z를 초과하는 경우이다. 이 경우, 각각 a,A부터 다시 시작해 초과한 만큼 이동해야 하기 때문에 루프를 구현하면 된다.