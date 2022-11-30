---
title: '[Coding Test] 프로그래머스 -소수 만들기-'
categories:
  - Coding-Test
  - Programmers
tags:
  - Coding-Test
  - Programmers
  - Lv.1
date: 2022-11-30 15:19:14
---
# 📃문제 링크

# 🤨생각하기
주어진 배열에서 선택한 3개의 합을 확인해야 하므로, 선택하는 순서는 중요하지 않다.
따라서 조합을 구현하면 된다.

다른 사람의 풀이를 보니, 소수를 판단하는 부분에서 효율성을 고려한 풀이들이 있었다.
이 문제에서는 효율성을 따지지 않아 큰 문제가 되지 않았지만, 주의할 필요가 있어보인다.


# 😎내 풀이
```js
function solution(nums) {
  let answer = 0

  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      for (let k = j + 1; k < nums.length; k++) {
        const sum = nums[i] + nums[j] + nums[k]

        let cnt = 0

        for (let l = 1; l <= sum; l++) {
          if (sum % l === 0) {
            cnt++
          }
        }
        if (cnt === 2) {
          answer++
        }
      }
    }
  }

  return answer
}
```