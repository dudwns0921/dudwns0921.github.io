---
title: "[Coding Test] 프로그래머스 -폰켓몬-"
categories:
  - Coding-Test
  - Programmers
tags:
  - Coding-Test
  - Programmers
  - Lv.1
date: 2022-11-15 12:52:56
---
# 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/1845


# 🤨생각하기
문제는 굉장히 길지만, 결국 가장 많은 종류의 폰켓몬을 선택할 때의 폰켓몬의 수를 구하면 되는 문제이다.

폰켓몬 배열에는 중복된 폰켓몬들도 있기 때문에, Set을 사용해 중복을 제거해준다. 그러면 해당 Set에는 각기 다른 종류의 폰켓몬들만이 남으며, 이들을 모두 선택했을 때 가장 많은 종류의 폰켓몬을 선택할 수 있게 되는 것이다.

하지만 총 폰켓몬 수/2만큼의 폰켓몬만을 선택한다고 했기 때문에 Set의 길이가 폰켓몬 수/2보다 작으면 Set의 길이를 반환하고, 그렇지 않다면 폰켓몬 수/2의 값을 반환하면 된다.  

# 😎내 풀이
```js
function solution(nums) {
  let answer = 0
  const avaliableNum = nums.length / 2
  const numsDeduplicated = new Set(nums)

  if (numsDeduplicated.size < avaliableNum) {
    answer = numsDeduplicated.size
  } else {
    answer = avaliableNum
  }

  return answer
}

```
