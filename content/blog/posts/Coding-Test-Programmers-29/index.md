---
title: '[Coding Test] 프로그래머스 -직사각형 별찍기-'
cover: programmers.png
categories:
  - Coding-Test
  - Programmers
tags:
  - Coding-Test
  - Programmers
  - Lv.1
date: 2022-11-30 15:13:35
---
# 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/12969

# 🤨생각하기
입력 부분만 구현한다면 코딩 테스트 입문으로 많이 푸는 별찍기 문제와 같다.

# 😎내 풀이
```js
process.stdin.setEncoding('utf8')
process.stdin.on('data', (data) => {

  const n = data.split(' ')
  const a = Number(n[0])
  const b = Number(n[1])

  for (let i = 0; i < b; i++) {
    console.log('*'.repeat(a))
  }
})
```