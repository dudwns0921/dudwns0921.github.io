---
title: "[Coding Test] 프로그래머스 -2016년-"
categories:
  - Coding-Test
  - Programmers
tags:
  - Coding-Test
  - Programmers
  - Lv.1
date: 2022-11-16 09:40:23
---
# 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/12901

# 🤨생각하기
2016년 특정 날의 요일을 구하는 문제이다.

1월 1일의 요일을 알고 있기 때문에 주어진 날짜와 1월 1일의 차이가 얼마나 나는지 확인하고, 그 차이를 7로 나눈 나머지를 통해 그 날의 요일을 구할 수 있다.

# 😎내 풀이
```js
function solution(a, b) {
  const days = ['FRI', 'SAT', 'SUN', 'MON', 'TUE', 'WED', 'THU']
  const monthDays = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  for (let i = 0; i < a - 1; i++) {
    b += monthDays[i]
  }

  b -= 1

  return days[b % 7]
}

```

# 🚨주의할 점
위의 로직에서는 b에서 1을 빼주는 이유는 b의 값이 1월 1일부터 주어진 날짜와의 차이가 아니기 때문이다.

주어진 날짜가 1월 3일이라고 해보자.
이 때 b의 값은 3인데, 1월 1일과의 1월 3일의 차이는 2이다. 따라서 차이를 구하기 위해서는 b의 값에서 1을 빼주어야 한다.