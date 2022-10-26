---
title: IndexedDB 기초
date: 2022-10-26 11:47:52
categories:
- Database
- IndexedDB
tags:
- Basic
- Tutorial
---
최근 프로젝트를 진행하며 꽤 많은 데이터를 브라우저상에서 저장해야 했는데, **localstroage**사용만으로는 구현이 어려워서 **IndexedDB**를 사용했다.

# 🙋‍♂️개요

> *공식문서*
> 
> *IndexedDB는 대용량의 구조화 데이터를 저장할 수 있는 클라이언트 사이드 저장소이다.*

# 🔧기본 패턴

1. 데이터베이스를 연다.

2. 데이터베이스에 **object store**을 생성한다.

3. **transaction**을 시작한 후 **request**를 만들어 데이터 추가, 받기 등의 데이터베이스 작업을 수행한다.

이제 위 패턴에 맞추어 데이터베이스를 만들고 데이터를 추가하는 작업까지 진행해보겠다.

# 👶튜토리얼
>*공식문서*
>
>*새로운 데이터베이스를 만들거나, 이미 존재하는 데이터베이스의 버전을 높일 경우 onupgradeneeded event가 트리거된다. 그리고 onupgradeneeded event에 대한 핸들러를 통해서만 데이터베이스의 구조를 변경할 수 있다.*
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

    여기서 주의할 점은 **indexedDB**의 모든 작업은 비동기적으로 수행되며, **open** 메서드는 데이터베이스를 생성하도록 요청했을뿐 생성된 데이터베이스를 바로 반환받은 것이 아니다.
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

    여기서 **transaction.oncomplete** 이벤트 핸들러에서 데이터를 삽입한 것은 object store가 정상적으로 생성된 후에 데이터를 삽입하기 위해서이다.
![](image1.PNG)
    
# 😎마무리
지금까지 **indexedDB**를 생성해 데이터를 삽입하는 법에 대해 간단하게 알아봤다. 데이터베이스에 대한 기초적인 지식만 있다면 어렵지 않게 사용할 수 있을 것이라 생각한다. 

# 📚참고자료

- https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API