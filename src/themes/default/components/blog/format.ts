// 글 날짜는 시간대 없는 벽시계 값을 UTC로 읽은 것이라 UTC 기준으로 그대로 꺼낸다.
const pad = (n: number) => String(n).padStart(2, '0');

export const formatDate = (date: Date): string =>
  `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
