---
title: '[Coding Test] 프로그래머스 -행렬의 덧셈-'
cover: programmers.png
categories:
  - Coding-Test
  - Programmers
tags:
  - Coding-Test
  - Programmers
  - Lv.1
date: 2022-11-30 14:51:47
---
# 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/12950

# 🤨생각하기
문제 그대로 구현하면 된다. 다만 map을 활용하면 좀 더 깔끔한 풀이가 된다.


# 😎내 풀이
```js
function solution(arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr1[0].length; j++) {
      arr1[i][j] += arr2[i][j]
    }
  }
  return arr1
}
```

# 다른 사람 풀이
```js
function solution(arr1, arr2) {
  return arr1.map((arr1Item,i) => arr1Item.map((arr2Item, j) => arr2Item + arr2[i][j]));
}
```