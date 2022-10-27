---
title: IndexedDB-Transaction
date: 2022-10-27 09:54:15
categories:
tags:
---
이전 포스트에서 **IndexedDB**가 무엇이며, 어떻게 사용하는지 간단하게 다뤄보았다. 이번에는 데이터베이스에서 데이터를 다루는 행위인 **Transaction**이 **IndexedDB**에서 어떻게 이루어지는지 알아보겠다. 

# 🙋‍♂️개요

> *공식문서*
>
> *Transaction은 데이터베이스에서 데이터와 상호작용하기 위해 사용된다. 데이터를 읽거나 데이터베이스에 데이터를 기록하는 작업이 Transaction에 의해 수행된다.*

# 🔧라이프 사이클

1. 트랜잭션은 scope와 mode로 만들어진다. 트랜잭션이 만들어지면 그 초기 상태는 active이다. 
2. 구현체가 트랜잭션의 scope와 mode를 강제할 수 있을 때, 구현체는 Transaction을 비동기적으로 시작하기 위해 task를 queue해야 한다.
여기서 Implementation을 직역하자면 구현체이다. 완벽하게 동일한 의미는 아닐 수도 있지만 구현체를 그냥 IndexedDB라고 이해하는 것이 좀 더 쉬울 것이다.
구현체는 IndexedDB가 구현된 프로그램을 의미하는 것으로 생각됨. 그러니까 여기서는 자바스크립트 엔진이라고 보면 될 거 같은데...

3. 트랜잭션이 시작되면 구현체는 트랜잭션에 배치된 요청들을 시작할 수 실행할 수 있게 된다. 요청들은 트랜잭션에 배치된 순서대로 실행되어야 한다. 이와 마찬가지로, 요청이 실행된 순서대로 결과가 반환되어야 한다. 하지만 서로 다른 트랜잭션들에 대해서는 순서가 보장되지 않는다.

4. 트랜잭션과 관련된 각 요청이 처리되면, 성공 혹은 에러 이벤트가 실행된다. 이벤트가 발송되는 동안, 트랜잭션의 state는 active로 변하고 트랜잭션에서 추가로 요청을 수행할 수 있다. 이벤트 발송이 완료되면 트랜잭션의 상태는 다시 비활성으로 설정된다.

5. 트랜잭션은 끝나기 전이라면 어느 때나 abort될 수 있다. 트랜잭션이 active가 아니거나 시작되기 전에도 가능
 중단()을 명시적으로 호출하면 중단이 시작됩니다. 스크립트에서 처리되지 않은 실패한 요청에도 중단이 시작됩니다.

트랜잭션이 중단되면 구현은 해당 트랜잭션 중에 데이터베이스에서 변경한 내용을 실행 취소(롤백)해야 합니다. 여기에는 개체 저장소 내용 변경 및 개체 저장소 및 인덱스의 추가 및 제거가 모두 포함됩니다.

6. 트랜잭션이 커밋되거나 중단되면 트랜잭션이 완료됨으로 설정됩니다.

구현은 트랜잭션이 활성화될 때마다 트랜잭션에 대해 요청을 배치할 수 있도록 허용해야 합니다. 아직 거래가 시작되지 않았더라도 그렇다. 트랜잭션이 시작될 때까지 구현은 이러한 요청을 실행해서는 안 됩니다. 그러나 구현은 요청과 요청 순서를 추적해야 합니다.

2. 데이터베이스에 **object store**을 생성한다.

3. **transaction**을 시작한 후 **request**를 만들어 데이터 추가, 받기 등의 데이터베이스 작업을 수행한다.

이제 위 패턴에 맞추어 데이터베이스를 만들고 데이터를 추가하는 작업까지 진행해보겠다.

# 👶트랜잭션 모드
>*공식문서*
>
>*새로운 데이터베이스를 만들거나, 이미 존재하는 데이터베이스의 버전을 높일 경우 onupgradeneeded event가 트리거된다. 그리고 onupgradeneeded event에 대한 핸들러를 통해서만 데이터베이스의 구조를 변경할 수 있다.*

# 
```js
const testData = [
  { ssn: '444-44-4444', name: 'Bill', age: 35, email: 'bill@company.com' },
  { ssn: '555-55-5555', name: 'Donna', age: 32, email: 'donna@home.org' },
]

const openDBRequest = window.indexedDB.open('test');
openRequest.onupgradeneeded = (event) => {
  let db = event.target.result;

  const createTestStoreRequest = db.createObjectStore('test', {
    keyPath: 'ssn',
  });
}
```
1. **indexedDB api**의 **open** 메서드를 통해 데이터베이스를 생성한다.

    여기서 주의할 점은 **indexedDB**의 모든 작업은 비동기적으로 수행되며, **open** 메서드는 데이터베이스를 생성하도록 요청했을뿐 생성된 데이터베이스를 바로 반환받은 것이 아니라는 점이다.
2. 트리거된 **onupgradeneeded event**에서 **object store**을 생성한다.
    **createObjectStore**의 첫 번째 인자로는 이름을, 두 번째 인자로는 각 데이터마다 고유한 값을 가지는 속성명을 작성해준다. 다시 말해 저장할 객체 데이터의 속성중 기본키로 사용할 속성의 이름을 작성해주면 된다.
```js
openRequest.onupgradeneeded = (event) => {
  ...
  createTestStoreRequest.transaction.oncomplete = (event) => {
    const testObjStore = db.transaction('test', 'readwrite').objectStore('test')
    testData.forEach((item) => {
      testObjStore.add(item)
    })
  }
}
```
3. 새롭게 생성된 **testObjstore**에다가 데이터를 삽입한다.

    여기서 **transaction.oncomplete** 이벤트 핸들러에서 데이터를 삽입한 것은 **object store**가 정상적으로 생성된 후에 데이터를 삽입하기 위해서이다.
![](image1.PNG)
    
# 😎마무리
지금까지 **indexedDB**를 생성해 데이터를 삽입하는 법에 대해 간단하게 알아봤다. 데이터베이스에 대한 기초적인 지식만 있다면 어렵지 않게 사용할 수 있을 것이라 생각한다. 

# 📚참고자료

- https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API