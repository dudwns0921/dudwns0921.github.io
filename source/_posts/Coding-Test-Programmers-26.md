---
title: '[Coding Test] 프로그래머스 -핸드폰 번호 가리기-'
index_img: /img/programmers.png
categories:
  - Coding-Test
  - Programmers
tags:
  - Coding-Test
  - Programmers
  - Lv.1
date: 2022-11-22 14:14:54
---
# 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/12948

# 🤨생각하기
주어진 전화번호의 뒷 4자리를 제외하고서 모두 *로 바꾸면 되는 문제이다.

substring 메서드를 통해 뒷 4자리를 가져왔고, padStart 메서드를 사용해 다시 앞에다가 맨 처음에 주어진 전화번호의 길이가 될 때까지 *를 추가했다.

# 😎내 풀이
```js
function solution(phone_number) {
  const phone_number_len = phone_number.length
  return phone_number
    .substring(phone_number_len - 4)
    .padStart(phone_number_len, '*')
}
```