---
title: "[Database] IndexedDB 기초"
date: 2022-10-26 11:47:52
categories:
- Database
tags:
- Database
- indexedDB
- Basic
- Tutorial
---
최근 프로젝트를 진행하며 꽤 많은 데이터를 브라우저상에서 저장해야 했는데, localstroage사용만으로는 구현이 어려워서 **IndexedDB**를 사용했다.

# 🙋‍♂️개요

> *MDN IndexedDB API 문서*
> 
> *IndexedDB는 대용량의 구조화 데이터를 저장할 수 있는 클라이언트 사이드 저장소이다.*

# 🔧기본 패턴

1. 데이터베이스를 연다.

2. 데이터베이스에 object store을 생성한다.

3. Transaction을 시작한 후 request를 생성해 데이터 추가, 받기 등의 데이터베이스 작업을 수행한다.

> *W3C IndexedDB API 문서*
>
> *Transaction은 데이터베이스에서 데이터와 상호작용하기 위해 사용된다. 데이터를 읽거나 데이터베이스에 데이터를 기록하는 작업 모두 Transaction에 의해 수행된다.*

이제 위 패턴에 맞추어 데이터베이스를 만들고 데이터를 추가하는 작업까지 진행해보겠다.

# 👶튜토리얼
>*MDN IndexedDB API 문서*
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
1. **indexedDB** api의 open 메서드를 통해 데이터베이스 생성을 요청한다.

    **indexedDB**의 모든 작업은 비동기적으로 수행된다. 그러니까 open 메서드는 데이터베이스를 생성하도록 요청했을뿐 데이터베이스를 생성해 바로 반환하지 않는다는 것이다.

2. 트리거된 onupgradeneeded event에서 object store 생성을 요청한다.

    앞에서 말했듯이 open 메서드로 인해 데이터베이스 생성 작업이 요청되었고, 그 작업이 완료됨에 따라 onupgradeneeded event가 트리거된다.
    
    Promise나 async await을 사용하는 것처럼 **IndexedDB**에서는 특정 이벤트에 핸들러를 작성하는 것으로 비동기 처리되는 작업이 완료되는 시점에 핸들러의 로직을 실행시킬 수 있다.
    
    그러니까 위의 예시는 데이터베이스가 생성된 다음에 발생되는 onupgradeneeded event에 핸들러를 작성해서 db 라는 변수에 데이터베이스를 할당하고, 데이터를 저장하기 위한 object store을 만든 것이다. object store를 생성하기 위해서는 createObjectStore 메서드를 사용하면 되는데, 이 메서드는 두 가지 인자를 받는다.
      - **name** : object store의 이름이다.
  
      - **options** [Optional] : 아래의 속성을 갖는 객체이다.

          1. **Keypath** [Optional]

              새로운 object store에서 사용할 Keypath를 설정한다. 저장할 각 객체 데이터들이 고유한 값을 가지는 속성명을 작성하면 된다. 데이터베이스의 기본키를 설정한다고 생각하면 좀 더 이해가 쉬울 것이다.

          2. **autoIncrement** [Optional]
      
              데이터의 키를 생성해주는 매커니즘인 key-generator 사용 여부를 설정한다. 기본값은 false이다.  
        
          여기서 주의할 점은 keypath를 작성하지 않고 autoIncrement도 false인 상태라면 데이터를 삽입할 때마다 각 데이터의 키를 별도로 제공해주어야 한다는 점이다. 이렇게 번거로운 과정을 거치지 않기 위해서는 위의 예시처럼 Keypath의 값을 작성해주는 게 가장 좋다.
          
          물론 autoIncrement를 true로 바꿔 key-generator을 사용해서 데이터의 키를 자동으로 생성할 수도 있다. 하지만 실제로 사용해본 결과, 데이터가 삽입된 순서대로 1,2,3... 의 값을 키로 사용하기 때문에 기본키로서는 적합하지 않다고 생각한다. 

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
3. 트리거된 oncomplete event에서 새롭게 생성된 object store에다가 데이터를 삽입한다.
    앞 단계에서와 마찬가지로 object store은 생성 요청만 이루어졌을 뿐이다. 따라서 데이터를 정상적으로 삽입하기 위해서는 object store 생성이 완료되는 시점에 트리거되는 oncomplete event에서 데이터를 삽입해주면 된다.
    
    데이터베이스와 관련된 작업을 하기 위해서는 먼저 트랜잭션을 시작해야 한다. 이를 위해서는 transaction 메서드를 사용해야 하며, transaction 메서드는 3개의 인자를 받는다.
    - **storeNames**
      
      새로운 트랜잭션의 scope에 포함시킬 object store의 이름들을 값을 갖는 배열이다. 단 하나의 object store만 포함시킬 경우에는 object store의 이름을 문자열로 전달할 수도 있다. 
      ```js
      db.transaction(['my-store-name']);
      db.transaction('my-store-name');
      ```
      데이터베이스에 있는 모든 object store을 포함시키려면 `IDBDatabase.objectStoreNames` 속성을 사용할 수 있다.
      ```js
      db.transaction(db.objectStoreNames);
      ```


    - **mode** [Optional]

      트랜잭션에서 수행될 작업의 유형을 설정한다. 이 때 설정할 수 있는 작업의 유형은 총 3가지가 있다.

        1. readonly
        2. readwrite
        3. readwriteflush(Firefox-only)

        mode의 값을 정의하지 않으면, 기본값인 readonly로 설정된다.

    - **options** [Optional]

      아래의 속성을 갖는 객체이다.

      1. **durability**

          default, strict, 그리고 relaxed의 3가지 값을 가진다. 기본값은 default이다. 각 값에 따라 성능이 달라지며, 사용자의 환경에 따라 다른 값을 설정해주면 된다.
![](image1.PNG)
    
# 😎마무리
지금까지 **indexedDB**를 생성해 데이터를 삽입하는 법에 대해 간단하게 알아봤다. 데이터베이스에 대한 기초적인 지식만 있다면 어렵지 않게 사용할 수 있을 것이라 생각한다. 

# 📚참고자료

- https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API