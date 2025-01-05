---
title: The-Pragmatic-Programmer
date: 2025-01-05 09:56:43
categories:
  - Book
tags:
  - Book
  - Insight
---

새해는 사람한테 참 좋은 원동력인 것 같다. 그동안 '다음에 해야지...' 라고 생각하면서 미뤄왔던 일들을 한 번에 처리할 수 있는 힘을 얻을 수 있으니 말이다. 나같은 경우에는 개발 관련 서적을 읽는 것이 미뤄왔던 일들 중 하나였다. 개발자가 된 이후 내 개발 지식은 모두 유튜브, 인터넷 강의, 개발 문서에 그 뿌리를 두고 있었다. 이 셋 모두 빠르고 쉽게 정보를 얻을 수 있다는 점에서 좋지만, 책만큼 정제된 지식을 얻기는 어렵다고 생각한다. 정제된 지식은 많은 고민과 생각이 필요하기에 앞의 세 가지에 의지를 많이 했던 것 같다.

하지만 새해가 된 김에 무작정 책 한 권을 읽겠다고 마음을 먹었고, 그 책이 바로 '실용주의 프로그래머'였다. 워낙 유명한 책이기도 하고, 개발 이론과 관련된 책보다는 인사이트에 관련된 책을 읽고 싶었다.

결론부터 말하자면, 400페이지에 가까운 책을 3~4일에 다 읽을 만큼 너무나 재밌는 책이었다. 회사에서 중간 관리자로서 고군분투하고 있는 나에게 절실하게 필요한 이야기들이 많다는 생각이 들었고, 마지막에 가서는 괜시리 그냥 일반 직장인인 개발자인 내가 세계의 사명을 짊어진 영웅처럼 느껴지기도 했다. 내 마음에 와닿았던 몇 가지 Topic들을 이야기해보려고 한다.

## Topic 7 소통하라!

취준생 시절, 자소서에는 소통이라는 단어가 빠질 수가 없었다. 회사는 혼자서 할 수 없는 일을 위한 곳이고, 이를 위해서는 소통이 필수적이기 때문이다. 그렇다고 내가 소통을 잘하는 사람이었나 돌이켜 보면 '전혀 아니었다'라고 말할 수 있겠다. 가령 동료들과 말을 하다가도 '음... 뭐였지?' 이런 버퍼링이 걸릴 때가 꽤 많았다.

책에서는 여러 가지 방법들을 제시해주는데, 대부분은 소통하기 전에 생각을 먼저 해보라는 이야기였다. 지금이 이 이야기를 하기 좋은 때인지, 이렇게 전달하는 것이 과연 효과적인 것인지 등...

성격이 급한 나는 책을 읽자마자 바로 회사에 가서 이 방법들을 적용해보고자 했다. 누군가와 소통하기 전에 5분 정도 생각하자, 초심자의 행운일 수도 있겠지만 일들이 내가 원하는 대로 풀리는 느낌이었다. 내가 의도한 바를 상대방에게 명확하게 전달했다는 생각이 들었고, 결과 또한 너무 만족스러웠다.

## Topic 10 직교성

직교성이란 기하학에서 빌려 온 용어로, 두 직선의 관계를 이야기할 때 사용한다. 두 직선이 직교한다는 건 두 직선이 독립적이라는 걸 의미하는데, 이와 유사하게 컴퓨터 과학에서 이 용어는 하나가 바뀌어도 나머지에 어떤 영향도 주지 않음을 의미한다.

회사에서 직교성의 중요성을 뼈저리게 느낀 순간이 있었다. 내가 진행하던 프로젝트중 Vue.js 기반의 프로젝트가 있었는데, 비즈니스 로직과 UI 쪽 로직이 무분별하게 섞여있었다. 서버 통신 쪽 로직만을 테스트하려고 했는데, 이를 위해서는 어쩔 수 없이 Vue 컴포넌트를 렌더링해야만 했었다. 비즈니스 로직과 UI 쪽 로직이 잘 구분되어 있었다면 간단했을 일이 직교성을 무시한 채 뒤엉켜있어 엄청난 시간이 드는 일이 되어버리고 말았다.

직교성이라는 개념을 알고, 이에 따라 빠르게 리팩토링을 했다면 내가 머저리라는 생각은 하지 않았을 것 같다.

## Topic 20 디버깅

> 참으로 고통스러운 일입니다.
> 자신이 겪는 어려움을 보고는 알게 되죠.
> 다른 누구도 아닌 바로 자신이 문제를 만들었다는 걸.
>
> -소포클레스

스포클레스가 남긴 말로 디버깅 챕터 시작 부분에 인용되어있다. 디버깅을 한다는 건 문제가 발생했다는 것이고, 그 문제를 내가 만들었을지도 모른다는 것이다.나의 부족함을 마주하는 작업이기 때문에 디버깅은 고통스러운 작업일 수밖에 없다.

너무나 당연한 이야기지만 개발자는 완벽한 존재가 아니다. 그런 사람이 만드는 소프트웨어 또한 불완전할 수 밖에 없다. 그런데 나를 포함한 개발자들은 디버깅의 고통을 느끼기 싫어 '그럴리가 없는데?' 라는 생각을 자주 하곤 한다. 이러한 생각 때문에 디버깅은 책임 떠넘기기와 비슷한 작업이 되어버리는 경우가 많다.

그래서 '디버깅은 단지 문제 풀이일 뿐이라는 사실을 받아들이고, 그런 마음으로 공략하라'는 책의 내용이 날 뜨끔하게 만들었던 것 같다.

## Topic 53 오만과 편견

> 옛 장인들은 자신의 작품에 서명하는 것을 자랑스러워했다. 여러분도 그래야 한다.

사실상 이 책에서 내게 가장 와닿았던 내용이다. 프로젝트가 끝났을 때 그 결과물에 애정이나 긍지를 가지는 개발자는 거의 없었던 것 같다. 대부분 고객사나 일정 등을 문제 삼으며 결과물에 대한 비판을 많이 하곤 했다. 하지만 어떤 일이 있었건 그 결과물을 본인들이 만든 것에는 변함이 없다.

옛 장인들처럼 자신의 작품에 자랑스럽게 서명하기 위해서는 코딩을 하는 순간순간 최선을 다해야겠다는 생각을 했다. 사람인지라 매순간 최선을 다한다는 건 쉽지 않은 일이겠지만, 적어도 나에게만큼은 부끄럽지 않은 작품을 만들 수 있는 개발자가 되어야겠다.

## 정리하며...

이번 글에서는 4개 정도의 토픽 정도만을 다뤘지만 사실 책에는 훨씬 더 많은 내용들이 있다. 특히 개발 이론적으로도 유용한 내용들이 많아 널리널리 알리고 싶은 책이다.

그리고 책 중간중간 코딩 예시나 연습 문제 등이 있는데, 이것도 꽤나 재밌으니 다는 아니더라도 관심이 가는 토픽이라면 직접 코딩도 해보는 걸 추천한다. 나같은 경우는 Topic 35의 액터와 프로세스 부분을 따라해보는 게 특히 재밌게 느껴졌다.

start_actor 함수가 정의되어있지 않아 직접 구현해야했는데, 별 거 아니었지만 구현하고 동작하는 걸 보니 코딩을 처음 배웠을 때의 뿌듯함과 즐거움을 느낄 수 있었던 것 같다.

```js
// Topic 35 액터와 프로세스

const { dispatch, start, spawn } = require("nact");

const customerActor = {
  "파이가 먹고 싶다": (msg, ctx, state) => {
    return dispatch(state.waiter, {
      type: "주문",
      customer: ctx.self,
      wants: "파이",
    });
  },
  "테이블에 놓다": (msg, ctx, state) => {
    console.log(`${ctx.self.name}이 테이블에 나타난 ${msg.food}를 보다.`);
  },
  "남은 파이 없음": (_msg, ctx, _state) => {
    console.log(`${ctx.self.name}이 파이가 없다고 불평한다.`);
  },
};

const waiterActor = {
  주문: (msg, ctx, state) => {
    if (msg.wants === "파이") {
      return dispatch(state.pieCase, {
        type: "한 조각 꺼내기",
        customer: msg.customer,
        waiter: ctx.self,
      });
    } else {
      console.log("주문할 수 없는 음식입니다.");
    }
  },
  "주문서에 추가": (msg, ctx, state) => {
    console.log(
      `종업원이 ${msg.food}을 ${msg.customer.name}의 주문서에 추가한다.`
    );
  },
  오류: (msg, ctx, state) => {
    dispatch(msg.customer, {
      type: "남은 파이 없음",
      msg: msg.msg,
    });
    console.log(msg.msg);
  },
};

const pieCaseActor = {
  "한 조각 꺼내기": (msg, ctx, state) => {
    if (state.slices.length > 0) {
      let slice = state.slices.shift();
      dispatch(msg.waiter, {
        type: "주문서에 추가",
        food: slice,
        customer: msg.customer,
      });
      dispatch(msg.customer, {
        type: "테이블에 놓다",
        food: slice,
      });
    } else {
      return dispatch(msg.waiter, {
        type: "오류",
        msg: "파이가 없습니다.",
        customer: msg.customer,
      });
    }
  },
};

const actorSystem = start();

const start_actor = (actorSystem, name, actor, initialState) => {
  return spawn(
    actorSystem,
    (state = initialState, msg, ctx) => {
      if (actor[msg.type]) {
        return actor[msg.type](msg, ctx, state);
      } else {
        console.log(`액터가 ${msg.type}을 처리할 수 없습니다.`);
      }
    },
    name
  );
};

let pieCase = start_actor(actorSystem, "pie-case", pieCaseActor, {
  slices: ["사과 파이", "딸기 파이", "블루베리 파이"],
});
let waiter = start_actor(actorSystem, "waiter", waiterActor, {
  pieCase,
});
let customer1 = start_actor(actorSystem, "customer1", customerActor, {
  waiter,
});
let customer2 = start_actor(actorSystem, "customer2", customerActor, {
  waiter,
});

dispatch(customer1, { type: "파이가 먹고 싶다" });
dispatch(customer2, { type: "파이가 먹고 싶다" });
dispatch(customer1, { type: "파이가 먹고 싶다" });
dispatch(customer2, { type: "파이가 먹고 싶다" });
```

책을 다 읽긴 했지만, 한 번 읽었다는 이유로 책장에 계속 넣어두기는 아까운 책이다. 개발자인 내가 어려움을 맞닥뜨렸을 때 조언을 해줄 수 있는 선생님이자 지침서로 늘 가까이 두고 펼쳐봐야겠다.
