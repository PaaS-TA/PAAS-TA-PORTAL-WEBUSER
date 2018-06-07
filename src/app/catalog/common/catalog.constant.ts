/**
 * Created by 박철한 on 2018-05-03.
 */
export enum CATALOGURLConstant {

  NAMECHECK = '/portalapi/v2/catalogs/apps/',
  CREATEAPP = '/portalapi/v2/catalogs/app',
  CREATEAPPTEMPLATE = '/portalapi/v2/catalogs/apptemplate',
  GETLISTAPP =  '/portalapi/v2/catalogs/apps/',
  STARTAPP = '/portalapi/v2/apps/startapp',
  GETSERVICEPLAN = '/portalapi/v2/catalogs/serviceplan/',
  CREATESERVICE = '/portalapi/v2/catalogs/serviceinstances',
  GETSERVICEINSTANCE = '/portalapi/v2/catalogs/servicepack/',


  GETPACKRELATION = '/commonapi/v2/packrelation/',
  GETLISTROUTE = '/commonapi/v2/routes',
  ROUTECHECK = '/commonapi/v2/routes/',
  INSERTHISTROY = '/commonapi/v2/history',
  GETRECENTPACKS = '/commonapi/v2/history/',
  GETSTARTERRELATION = '/commonapi/v2/packrelation/',
  GETSTARTERPACKS = '/commonapi/v2/starterpacks',
  GETBUILDPACKS = '/commonapi/v2/developpacks',
  GETSERVICEPACKS = '/commonapi/v2/servicepacks',
  GETSEARCH = '/commonapi/v2/packs',



  SERVICEPACK = 'servicePack',
  BUILDPACK = 'buildPack',
  CREATESUCCESSAPP = '현재 이름으로 앱을 생성할수 있습니다.',
  CREATEFALSEAPP ='현재 이름으로 앱을 생성할수 없습니다.',
  CREATESUCCESSROUTE='현재 호스트로 라우트를 생성할수 있습니다.',
  CREATEFASLEROUTE='현재 호스트로 라우트를 생성할수 없습니다.',
  CREATESUCCESSSERVICE = '현재 이름으로 서비스를 생성할수 있습니다.',
  CREATEFALSESERVICE ='현재 이름으로 서비스를 생성할수 없습니다.',
  OVERLAPSERVICE = '같은 이름으로 서비스를 생성할수 없습니다..',
  OPTIONORG='생성된 조직명',
  OPTIONSPACE='해당 공간명',
  NOTAPPBINDING='연결없이 시작',
  NOTSELECTSPACE = '공간을 선택해 주시기 바랍니다.',
  NOTSPACE = '공간이 없습니다.',
  SELECTORGANDSPACE='조직과 공간을 선택해 주십시오',
  INPUTAPPNAME ='앱 이름을 입력하여 주십시오',
  INPUTHOSTNAME='호스트를 입력하여 주십시오',
  INPUTSERVICE='서비스 이름을 입력하여 주십시오',
  FAIL = 'FAIL',
  SUCCESS ='SUCCESS',
  OK=1,
  NO=-1,
  YN = 'Y',
}
