export const AppConfig = {
  clientId: 'portalclient',
  clientSecret: 'clientsecret',
  redirectUri: window.location.origin + '/callback',
  logoutredirectUri: window.location.origin + '/login',
  scope: 'openid cloud_controller_service_permissions.read cloud_controller.read cloud_controller.write',
  authUrl: 'https://uaa.115.68.46.187.xip.io/oauth/authorize',
  checkUrl: 'https://uaa.115.68.46.187.xip.io/check_token',
  accessUrl: 'https://uaa.115.68.46.187.xip.io/oauth/token',
  infoUrl: 'https://uaa.115.68.46.187.xip.io/userinfo',
  logoutUrl: 'https://uaa.115.68.46.187.xip.io/logout',
  userinfoUrl: '/commonapi/v2/user',
  code: 'code',
  sessionTimeout: 10,
  monitoring : false,         // 모니터링 사용 유무
  quantity : false,           // 사용량 조회 사용 유무
  automaticApproval : true // 회원가입 자동승인 사용 유무
};

