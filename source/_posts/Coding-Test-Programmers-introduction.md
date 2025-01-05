---
title: '[Coding Test] 프로그래머스 코딩 입문 트레이닝 후기'
index_img: /img/programmers.png
categories:
  - Coding-Test
  - Programmers
tags:
  - Coding-Test
  - Programmers
  - Introduction Training
---

이전 포스트에 이어서 이번에는 프로그래머스의 코딩 입문 트레이닝을 모두 풀어보았다. 4일 동안 100문제를 풀었다. 여전히 Lv.0이지만 가끔은 Lv.1보다 어렵게 느껴지는 문제들도 있었고, 특정 수학적 지식들도 필요할 때도 있었다. 그래서 체감상으로는 입문 트레이닝보다 꽤나 어렵게 느껴졌던 것 같다. 이번에도 입문 트레이닝을 풀면서 알게 된 점을 정리해보고자 한다.

## 수학적 지식
### 유클리드 호제법
아마 알고리즘을 풀기 시작하면 가장 먼저 접하게 되는 수학적 지식이 아닐까 싶다. 정의는 아래와 같다.

> 2개의 자연수(또는 정식) a, b에 대해서 a를 b로 나눈 나머지를 r이라 하면(단, a>b), a와 b의 최대공약수는 b와 r의 최대공약수와 같다.

```js
function getGCD(a, b) {
    if (Math.abs(b) > Math.abs(a)) {
        [a, b] = [b, a];
    }

while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp; 
    }
    return a;
}
```
각 문제마다 위의 코드처럼 별도로 최대공약수 메서드를 만들어 사용했다. 유클리드 호제법의 조건을 지키기 위해 a와 b의 크기를 비교한 후 구조 분해 할당을 통해 큰 값이 a에 할당되도록 구현했다.

그리고 b가 0이 될 때까지 b와 r의 최대공약수를 반복해서 구했다.

아래는 유클리드 호제법을 사용하는 문제의 예시이다.

#### 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/120808

#### 🤨생각하기
기약분수를 만들기 위해서는 분수를 분모와 분자의 최대공약수로 나누어주면 된다.

### 소인수분해
소인수분해란 어떤 수를 소수들의 곱으로 표현하는 것이다.

```js
function solution(n) {
  let factors = [];
  
  for (let i = 2; i <= n; i++) {
    while (n % i === 0) {
      factors.push(i);
      n /= i;
    }
  }
  
  return factors
}
```
1. 1은 소수가 아니기 때문에 2부터 해당 수까지 반복하는 for문을 구현한다.
2. 그 다음 n을 i로 나눴을 때의 나머지가 0이 아니게 될 때까지 n을 i로 나눈다.
3. 나머지가 0인 경우에는 배열에 i를 추가한다.

아래는 소인수분해를 사용하는 문제의 예시이다.

#### 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/120852


### 유한소수
소수점 아래 숫자가 계속되지 않고 유한개인 소수를 유한소수라고 한다. 분수일 경우 기약분수로 나타냈을 때 분모의 소인수가 2와 5만 존재해야 유한소수이다.

아래는 위 개념을 이용해 푸는 문제이다.

#### 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/120878

#### 🤨생각하기
기약분수를 위해 유클리드 호제법을, 소인수 확인을 위해 소인수분해를 사용하면 된다.

### 직선의 기울기
직선의 기울기는 y값의 증가량을 x값의 증가량으로 나누어주면 된다.

아래는 위 개념을 이용해 푸는 문제이다.

#### 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/120875


## 자바스크립트 팁
코딩 테스트 문제를 풀 때 유용하게 사용할 수 있는 방법이다. 

### 구조분해할당
#### swap
위에서도 유클리드 호제법을 구현하기 위해서도 사용했지만 여러 문제에서 유용하게 쓰였다. 아래와 같이 사용하면 된다.

```js
[a, b] = [b, a];
```
아래는 구조 분해 할당을 사용해서 푸는 문제의 예시이다.

#### 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/120895


### 이진수 구하기
#### parseInt
parseInt의 두 번째 인자로 2를 전달하면 첫 번째의 인자의 이진수 값을 구할 수 있다. 다만 실제 이진수를 구하는 방법도 알아두면 좋을 것 같다.

```js
const bin = parseInt(num, 2);
```


### 여집합 구하기
배열에서 여집합을 구할 때는 주로 두 가지 방법을 사용했다.

- filter
- split

#### split
split은 문자열 객체를 지정한 구분자를 이용해 여러 개의 문자열로 나누는 메서드이다. 이 때 구분자에다가 정규표현식을 사용할 수도 있다.

여집합을 구할 때의 대상이 배열이라면 바로 filter 메서드를 적용해도 괜찮겠지만, 문자열이라면 filter을 사용하기 위해서는 split("")을 한 번 적용해서 배열로 바꿔줘야 하기 때문에 split 메서드를 통해 바로 여집합을 구하는 것도 좋은 방법이라고 생각한다.

아래는 split을 사용해서 풀 수 있는 문제의 예시이다. 

##### 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/120864


## 가장 오래 걸렸던 문제
거의 1시간 좀 넘게 걸렸던 문제였다. 어떻게든 풀어내긴 했지만, 너무 무식하게 푼 것 같아 나중에 좀 더 좋은 방법을 찾아야겠다는 생각이 들었다.

### 📃문제 링크
https://school.programmers.co.kr/learn/courses/30/lessons/120876

### 🤨생각하기
1. 먼저 세 선분의 좌표가 모두 담긴 배열을 만든다.
2. 이중 for문을 통해 세 선분을 비교하며 겹치는 부분을 찾아 배열에 넣는다. 이 때 배열에 들어가는 건 [시작점, 끝점] 형태이다. 하나의 선분을 넣는다고 생각하면 된다.
3. 그리고 그 선분을 key 값으로 해 Map을 만든다. value는 해당 선분이 겹친 선분들이 있는 배열에 등장하는 횟수이다. 이렇게 하는 건 동일 선분이 중복해서 겹치는 경우가 있기 떄문이다.
4. 마지막으로 keys()를 사용하면 중복되지 않은 겹친 선분들을 얻을 수 있다.

### 😎내 풀이
```js
function getRange (startNum, endNum) {
    let range = []
    for(let i=startNum; i<=endNum; i++) {
        range.push(i)
    }
    return range
}

function solution(lines) {
    const ranges = [getRange(lines[0][0], lines[0][1]), getRange(lines[1][0], lines[1][1]), getRange(lines[2][0], lines[2][1])]
    
    
    let duplicated = [];
    
    for(let i=0; i<ranges.length; i++) {
        for(let j=i+1; j<ranges.length; j++) {
            let line = []
            let range1 = ranges[i]
            let range2 = ranges[j]
            range1.forEach(v=>{
                if(range2.includes(v)) {
                    line.push(v)
                }
            })
            if(line.length>1) duplicated.push(line)
        }
    }
    
    let duplicatedMap = new Map();
    
    duplicated.forEach(v=>{
        for(let i=0; i<v.length; i++) {
            if(v[i+1]===undefined) return
            duplicatedMap.set(v.slice(i, i+2).join(""), duplicatedMap.get(v.slice(i, i+2).join("")) ? duplicatedMap.get(v.slice(i, i+2).join(""))+1 : 1)
        }
    })
   return Array.from(duplicatedMap.keys()).length
    
}
```

## 마무리
다른 사람들의 풀이를 보면서 여전히 많이 부족하다는 걸 느꼈다. 좋은 풀이가 있다면 내 풀이에 집착하기보다는 배우려는 자세로 받아들여야겠다는 생각이 들었다.