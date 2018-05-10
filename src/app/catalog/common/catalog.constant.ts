/**
 * Created by 박철한 on 2018-05-03.
 */
export enum CATALOGURLConstant {
  COMMONAPI = '/commonapi',
  POTALAPI = '/portalapi',
  V2_URL = '/v2',
//카탈로그 메인
//-----------------------------
  GETRECENTPACKS = '/commonapi/v2/history/',
  GETSTARTERPACKS = '/commonapi/v2/starterpacks',
  GETBUILDPACKS = '/commonapi/v2/developpacks',
  GETSERVICEPACKS = '/commonapi/v2/servicepacks',
  GETSEARCH = '/commonapi/v2/packs',

//카탈로그 Detail
//-----------------------------
  CREATEAPP = '/portalapi/v2/catalogs/app',
  STARTAPP = '/portalapi/v2/apps/startapp',
  GETPACKRELATION = '/commonapi/v2/packrelation/',

//카탈로그 개발환경
//----------------------------
  GETBUILDPACK = '/commonapi/v2/developpacks',
}
