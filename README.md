# PAAS-TA-PORTAL-WEBUSER

## Sidecar 
### NPM을 통한 빌드 과정
```
# NPM 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
source ~/.bashrc
nvm install 9.11.1
nvm use 9.11.1

# NPM 빌드
npm install
npm run build
```


## PORTAL WEBUSER
PORTAL WEBUSER는 이종클라우드를 지원한다. 마스터 사용자 포털에서 각각의 클라우드 서비스(어플리케이션의 배포 및 관리, 개발에 필요한 서비스 인스턴스 관리, 계정관리와 공지사항 같은 포탈 관리 기능)를 제공한다.


## 유의사항
개발 정보
- Angular 5.2.9
- node 9.11.1
- npm 5.10.0
- Angular CLI 1.7.4
- App outDir :: ./dist/paas-ta-portal-webuser 
