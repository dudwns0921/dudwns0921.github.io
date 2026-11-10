// 이력서는 도메인 루트(elioground.com)에서 서빙한다. 다시 하위 경로로 옮기면 여기만 바꾼다.
const BASE_PATH = '';

export const withBasePath = (path: string) => `${BASE_PATH}${path}`;

// 운영 사이트 주소. PDF는 빌드 때 로컬 서버에서 찍으므로, PDF에 남는 내부 링크는 이 주소로 건다.
const SITE_ORIGIN = 'https://elioground.com';

// PDF에서도 눌러지는 링크. 운영 빌드에서는 사이트 전체 주소를, 개발에서는 로컬 경로를 준다.
export const withSiteUrl = (path: string) =>
    process.env.NODE_ENV === 'production' ? `${SITE_ORIGIN}${withBasePath(path)}` : path;

// 운영에서는 빌드 때 만든 정적 PDF를, 개발에서는 API로 그때그때 만든 PDF를 받는다.
export const getPdfUrl = () => {
    if (process.env.NODE_ENV === 'production') {
        return withBasePath('/resume.pdf');
    }
    return '/api/pdf';
}
