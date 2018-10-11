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
  GETSTARTERPACKS_Y = '/commonapi/v2/Y/starterpacks',
  GETBUILDPACKS_Y = '/commonapi/v2/Y/developpacks',
  GETSERVICEPACKS_Y = '/commonapi/v2/Y/servicepacks',
  GETSTARTERPACKS = '/commonapi/v2/starterpacks',
  GETBUILDPACKS = '/commonapi/v2/developpacks',
  GETSERVICEPACKS = '/commonapi/v2/servicepacks',
  GETSEARCH = '/commonapi/v2/packs',

  GETIMG = '/storageapi/v2/swift/',



  SERVICEPACK = 'servicePack',
  BUILDPACK = 'buildPack',
  STARTERPACK = 'starter',
  NOTAPPBINDING='연결없이 시작',
  FAIL = 'FAIL',
  SUCCESS ='SUCCESS',
  OK=1,
  NO=-1,
  YN = 'Y',
}
