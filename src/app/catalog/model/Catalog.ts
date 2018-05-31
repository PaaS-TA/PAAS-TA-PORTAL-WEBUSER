export class Catalog{

  private no : number;
  private name : string;
  private classification : string;
  private classificationValue : string;
  private classificationSummary : string;
  private summary : string;
  private description : string;
  private thumbImgName : string;
  private thumbImgPath : string;
  private useYn : string;
  private userId : string;
  private created : string;
  private lastModified : string;
  private buildPackName : string;
  private servicePackName : string;
  private starterCategoryNo : number;
  private servicePackCategoryNo : number;
  private buildPackCategoryNo : number;
  private searchKeyword : string;
  private searchTypeColumn : string;
  private searchTypeUseYn : string;
  private servicePackCategoryNoList : Array<number>;
  private catalogNo : number;
  private catalogType : string;
  private servicePlan : string;
  private appName : string;
  private orgName : string;
  private orgId : string;
  private spaceName : string;
  private spaceId : string;
  private serviceInstanceName : string;
  private appGuid : string;
  private serviceInstanceGuid : string;
  private servicePlanList : Array<Catalog>;
  private limitSize : number;
  private hostName : string;
  private domainName : string;
  private domainId : string;
  private routeName : string;
  private appSampleStartYn : string;
  private appSampleFileName : string;
  private appSampleFilePath : string;
  private appSampleFileSize : number;
  private appBindYn : string;
  private parameter : string;
  private app_bind_parameter : string;
  private diskSize : number;
  private memorySize : number;
  private dashboardUseYn : string;

  public getNo() : number {
  return this.no;
}

  /**
   * SETTER 카탈로그 번호
   *
   * @param no 카탈로그 번호
   */
  public setNo(no : number) {
  this.no = no;
}

/**
 * GETTER 카탈로그명
 *
 * @return 카탈로그명
 */
public getName() : string {
  return this.name;
}

/**
 * SETTER 카탈로그명
 *
 * @param name 카탈로그명
 */
public setName(name : string) {
  this.name = name;
}

/**
 * GETTER 구분
 *
 * @return 구분
 */
public getClassification() : string {
  return this.classification;
}

/**
 * SETTER 구분
 *
 * @param classification 구분
 */
public setClassification(classification : string) {
  this.classification = classification;
}

/**
 * GETTER 구분값
 *
 * @return 구분값
 */
public getClassificationValue()  : string{
  return this.classificationValue;
}

/**
 * SETTER 구분값
 *
 * @param classificationValue 구분값
 */
public setClassificationValue(classificationValue : string) {
  this.classificationValue = classificationValue;
}

/**
 * GETTER 구분 요약
 *
 * @return 구분 요약
 */
public getClassificationSummary()  : string{
  return this.classificationSummary;
}

/**
 * SETTER 구분 요약
 *
 * @param classificationSummary 구분 요약
 */
public setClassificationSummary(classificationSummary : string) {
  this.classificationSummary = classificationSummary;
}

/**
 * GETTER 요약
 *
 * @return 요약
 */
public getSummary()  : string{
  return this.summary;
}

/**
 * SETTER 요약
 *
 * @param summary 요약
 */
public setSummary(summary : string) {
  this.summary = summary;
}

/**
 * GETTER 설명
 *
 * @return 설명
 */
public getDescription() : string {
  return this.description;
}

/**
 * SETTER 설명
 *
 * @param description 설명
 */
public setDescription(description : string) {
  this.description = description;
}

/**
 * GETTER 이미지명
 *
 * @return 이미지명
 */
public getThumbImgName()  : string{
  return this.thumbImgName;
}

/**
 * SETTER 이미지명
 *
 * @param thumbImgName 이미지명
 */
public setThumbImgName(thumbImgName : string) {
  this.thumbImgName = thumbImgName;
}

/**
 * GETTER 이미지 경로
 *
 * @return 이미지 경로
 */
public getThumbImgPath() : string {
  return this.thumbImgPath;
}

/**
 * SETTER 이미지 경로
 *
 * @param thumbImgPath 이미지 경로
 */
public setThumbImgPath(thumbImgPath : string) {
  this.thumbImgPath = thumbImgPath;
}

/**
 * GETTER 사용유무
 *
 * @return 사용유무
 */
public getUseYn()  : string{
  return this.useYn;
}

/**
 * SETTER 사용유무
 *
 * @param useYn 사용유무
 */
public setUseYn(useYn : string) {
  this.useYn = useYn;
}

/**
 * GETTER 사용자 아이디
 *
 * @return 사용자 아이디
 */
public getUserId()  : string{
  return this.userId;
}

/**
 * SETTER 사용자 아이디
 *
 * @param userId 사용자 아이디
 */
public setUserId(userId : string) {
  this.userId = userId;
}

/**
 * GETTER 생성일
 *
 * @return 생성일
 */
public getCreated()  : string{
  return this.created;
}

/**
 * SETTER 생성일.
 *
 * @param created 생성일
 */
public setCreated(created : string) {
  this.created = created;
}

/**
 * GETTER 수정일
 *
 * @return 수정일
 */
public getLastModified()  : string{
  return this.lastModified;
}

/**
 * SETTER 수정일
 *
 * @param lastModified 수정일
 */
public setLastModified(lastModified : string) {
  this.lastModified = lastModified;
}

/**
 * GETTER 빌드팩명
 *
 * @return 빌드팩명
 */
public getBuildPackName() : string {
  return this.buildPackName;
}

/**
 * SETTER 빌드팩명
 *
 * @param buildPackName 빌드팩명
 */
public setBuildPackName(buildPackName : string) {
  this.buildPackName = buildPackName;
}

/**
 * GETTER 서비스팩명
 *
 * @return 서비스팩명
 */
public getServicePackName()  : string{
  return this.servicePackName;
}

/**
 * SETTER 서비스팩명
 *
 * @param servicePackName 서비스팩명
 */
public setServicePackName(servicePackName  : string) {
  this.servicePackName = servicePackName;
}

/**
 * GETTER 스타터 카테고리 번호
 *
 * @return 스타터 카테고리 번호
 */
public  getStarterCategoryNo() : number{
  return this.starterCategoryNo;
}

/**
 * SETTER 스타터 카테고리 번호
 *
 * @param starterCategoryNo 스타터 카테고리 번호
 */
public setStarterCategoryNo( starterCategoryNo : number) {
  this.starterCategoryNo = starterCategoryNo;
}

/**
 * GETTER 서비스팩 카테고리 번호
 *
 * @return 서비스팩 카테고리 번호
 */
public  getServicePackCategoryNo() : number {
  return this.servicePackCategoryNo;
}

/**
 * SETTER 서비스팩 카테고리 번호
 *
 * @param servicePackCategoryNo 서비스팩 카테고리 번호
 */
public setServicePackCategoryNo( servicePackCategoryNo : number) {
  this.servicePackCategoryNo = servicePackCategoryNo;
}

/**
 * GETTER 빌드팩 카테고리 번호
 *
 * @return 빌드팩 카테고리 번호
 */
public  getBuildPackCategoryNo()  : number{
  return this.buildPackCategoryNo;
}

/**
 * SETTER 빌드팩 카테고리 번호
 *
 * @param buildPackCategoryNo 빌드팩 카테고리 번호
 */
public setBuildPackCategoryNo( buildPackCategoryNo : number) {
  this.buildPackCategoryNo = buildPackCategoryNo;
}

/**
 * GETTER 검색어
 *
 * @return 검색어
 */
public getSearchKeyword()  : string{
  return this.searchKeyword;
}

/**
 * SETTER 검색어
 *
 * @param searchKeyword 검색어
 */
public setSearchKeyword(searchKeyword : string) {
  this.searchKeyword = searchKeyword;
}

/**
 * GETTER 검색 형태 컬럼
 *
 * @return 검색 형태 컬럼
 */
public getSearchTypeColumn()  : string{
  return this.searchTypeColumn;
}

/**
 * SETTER 검색 형태 컬럼
 *
 * @param searchTypeColumn 검색 형태 컬럼
 */
public setSearchTypeColumn(searchTypeColumn : string) {
  this.searchTypeColumn = searchTypeColumn;
}

/**
 * GETTER 검색 형태 사용유무
 *
 * @return 검색 형태 사용유무
 */
public getSearchTypeUseYn()  : string{
  return this.searchTypeUseYn;
}

/**
 * SETTER 검색 형태 사용유무
 *
 * @param searchTypeUseYn 검색 형태 사용유무
 */
public setSearchTypeUseYn(searchTypeUseYn : string) {
  this.searchTypeUseYn = searchTypeUseYn;
}

/**
 * GETTER 서비스팩 카테고리 번호 목록
 *
 * @return 서비스팩 카테고리 번호 목록
 */
public getServicePackCategoryNoList() : Array<number>{
  return this.servicePackCategoryNoList;
}

/**
 * SETTER 서비스팩 카테고리 번호 목록
 *
 * @param servicePackCategoryNoList 서비스팩 카테고리 번호 목록
 */
public setServicePackCategoryNoList(servicePackCategoryNoList : Array<number>) {
  this.servicePackCategoryNoList = servicePackCategoryNoList;
}

/**
 * GETTER 카탈로그 번호
 *
 * @return 카탈로그 번호
 */
public  getCatalogNo()  : number{
  return this.catalogNo;
}

/**
 * SETTER 카탈로그 번호
 *
 * @param catalogNo 카탈로그 번호
 */
public setCatalogNo( catalogNo : number) {
  this.catalogNo = catalogNo;
}

/**
 * GETTER 카탈로그 타입
 *
 * @return 카탈로그 타입
 */
public getCatalogType() : string {
  return this.catalogType;
}

/**
 * SETTER 카탈로그 타입
 *
 * @param catalogType 카탈로그 타입
 */
public setCatalogType(catalogType : string) {
  this.catalogType = catalogType;
}

/**
 * GETTER 서비스 플랜
 *
 * @return 서비스 플랜
 */
public getServicePlan()  : string{
  return this.servicePlan;
}

/**
 * SETTER 서비스 플랜
 *
 * @param servicePlan 서비스 플랜
 */
public setServicePlan(servicePlan : string) {
  this.servicePlan = servicePlan;
}

/**
 * GETTER 애플리케이션명
 *
 * @return 애플리케이션명
 */
public getAppName() : string {
  return this.appName;
}

/**
 * SETTER 애플리케이션명
 *
 * @param appName 애플리케이션명
 */
public setAppName(appName : string) {
  this.appName = appName;
}

/**
 * GETTER 조직명
 *
 * @return 조직명
 */
public getOrgName() : string {
  return this.orgName;
}

/**
 * SETTER 조직명
 *
 * @param orgName 조직명
 */
public setOrgName(orgName)  {
  this.orgName = orgName;
}

/**
 * GETTER 조직명
 *
 * @return  조직 guid
 */
public getOrgId() : string{
  return this.orgId;
}

/**
 * SETTER 조직명
 *
 * @param orgId 조직 guid
 */
public setOrgId(orgId : string) {
  this.orgId = orgId;
}


/**
 * GETTER 공간명
 *
 * @return 공간명
 */
public getSpaceName() : string {
  return this.spaceName;
}

/**
 * SETTER 공간명
 *
 * @param spaceName 공간명
 */
public setSpaceName(spaceName ) {
  this.spaceName = spaceName;
}


/**
 * GETTER 공간guid
 *
 * @return 공간guid
 */
public getSpaceId()  : string{
  return this.spaceId;
}

/**
 * SETTER 공간guid
 *
 * @param spaceId 공간guid
 */
public setSpaceId(spaceId : string) {
  this.spaceId = spaceId;
}

/**
 * GETTER 서비스 인스턴스명
 *
 * @return 서비스 인스턴스명
 */
public getServiceInstanceName()  : string{
  return this.serviceInstanceName;
}

/**
 * SETTER 서비스 인스턴스명
 *
 * @param serviceInstanceName 서비스 인스턴스명
 */
public setServiceInstanceName(serviceInstanceName : string) {
  this.serviceInstanceName = serviceInstanceName;
}

/**
 * GETTER 애플리케이션 GUID
 *
 * @return 애플리케이션 GUID
 */
public getAppGuid() : string {
  return this.appGuid;
}

/**
 * SETTER 애플리케이션 GUID
 *
 * @param appGuid 애플리케이션 GUID
 */
public setAppGuid(appGuid : string) {
  this.appGuid = appGuid;
}

/**
 * GETTER 서비스 인스턴스 GUID
 *
 * @return 서비스 인스턴스 GUID
 */
public getServiceInstanceGuid()  : string{
  return this.serviceInstanceGuid;
}

/**
 * SETTER 서비스 인스턴스 GUID
 *
 * @param serviceInstanceGuid 서비스 인스턴스 GUID
 */
public setServiceInstanceGuid(serviceInstanceGuid : string) {
  this.serviceInstanceGuid = serviceInstanceGuid;
}

/**
 * GETTER 서비스 플랜 목록
 *
 * @return 서비스 플랜 목록
 */
public getServicePlanList() : Array<Catalog>{
  return this.servicePlanList;
}

/**
 * SETTER 서비스 플랜 목록
 *
 * @param servicePlanList 서비스 플랜 목록
 */
public setServicePlanList(servicePlanList : Array<Catalog>) {
  this.servicePlanList = servicePlanList;
}

/**
 * GETTER 제한 크기
 *
 * @return 제한 크기
 */
public  getLimitSize()  : number{
  return this.limitSize;
}

/**
 * SETTER 제한 크기
 *
 * @param limitSize 제한 크기
 */
public setLimitSize( limitSize : number) {
  this.limitSize = limitSize;
}

/**
 * GETTER 호스트명
 *
 * @return 호스트명
 */
public getHostName()  : string{
  return this.hostName;
}

/**
 * SETTER 호스트명
 *
 * @param hostName 호스트명
 */
public setHostName(hostName : string) {
  this.hostName = hostName;
}
  /**
   * GETTER 도메인 guid
   *
   * @return 도메인명
   */
  public getDomainId()  : string{
    return this.domainId;
  }

  /**
   * SETTER 도메인 guid
   *
   * @param domainName 도메인 guid
   */
  public setDomainId(domainId : string) {
    this.domainId = domainId;
  }



/**
 * GETTER 도메인명
 *
 * @return 도메인명
 */
public getDomainName()  : string{
  return this.domainName;
}

/**
 * SETTER 도메인명
 *
 * @param domainName 도메인명
 */
public setDomainName(domainName : string) {
  this.domainName = domainName;
}

/**
 * GETTER 라우트명
 *
 * @return 라우트명
 */
public getRouteName()  : string{
  return this.routeName;
}

/**
 * SETTER 라우트명
 *
 * @param routeName 라우트명
 */
public setRouteName(routeName : string) {
  this.routeName = routeName;
}

/**
 * GETTER 애플리케이션 샘플 시작 유무
 *
 * @return 애플리케이션 샘플 시작 유무
 */
public getAppSampleStartYn()  : string{
  return this.appSampleStartYn;
}

/**
 * SETTER 애플리케이션 샘플 시작 유무
 *
 * @param appSampleStartYn 애플리케이션 샘플 시작 유무
 */
public setAppSampleStartYn(appSampleStartYn : string) {
  this.appSampleStartYn = appSampleStartYn;
}

/**
 * GETTER 애플리케이션 샘플 파일명
 *
 * @return 애플리케이션 샘플 파일명
 */
public getAppSampleFileName()  : string{
  return this.appSampleFileName;
}

/**
 * SETTER 애플리케이션 샘플 파일명
 *
 * @param appSampleFileName 애플리케이션 샘플 파일명
 */
public setAppSampleFileName(appSampleFileName : string) {
  this.appSampleFileName = appSampleFileName;
}

/**
 * GETTER 애플리케이션 샘플 파일 경로
 *
 * @return 애플리케이션 샘플 파일 경로
 */
public getAppSampleFilePath()  : string{
  return this.appSampleFilePath;
}

/**
 * SETTER 애플리케이션 샘플 파일 경로
 *
 * @param appSampleFilePath 애플리케이션 샘플 파일 경로
 */
public setAppSampleFilePath(appSampleFilePath : string) {
  this.appSampleFilePath = appSampleFilePath;
}

/**
 * GETTER 애플리케이션 샘플 파일 크기
 *
 * @return 애플리케이션 샘플 파일 크기
 */
public  getAppSampleFileSize() : number{
  return this.appSampleFileSize;
}

/**
 * SETTER 애플리케이션 샘플 파일 크기
 *
 * @param appSampleFileSize 애플리케이션 샘플 파일 크기
 */
public setAppSampleFileSize( appSampleFileSize : number) {
  this.appSampleFileSize = appSampleFileSize;
}

/**
 * GETTER 애플리케이션 바인드 유무
 *
 * @return 애플리케이션 바인드 유무
 */
public getAppBindYn() : string {
  return this.appBindYn;
}

/**
 * SETTER 애플리케이션 바인드 유무
 *
 * @param appBindYn 애플리케이션 바인드 유무
 */
public setAppBindYn(appBindYn : string) {
  this.appBindYn = appBindYn;
}

/**
 * GETTER 파라미터
 *
 * @return 파라미터
 */
public getParameter() : string {
  return this.parameter;
}

/**
 * SETTER 파라미터
 *
 * @param parameter 파라미터
 */
public setParameter(parameter : string) {
  this.parameter = parameter;
}


/**
 * GETTER 파라미터
 *
 * @return 파라미터
 */
public getApp_bind_parameter() : string {
  return this.app_bind_parameter;
}

/**
 * SETTER 파라미터
 *
 * @param app_bind_parameter 파라미터
 */

public setApp_bind_parameter(app_bind_parameter : string) {
  this.app_bind_parameter = app_bind_parameter;
}

/**
 * GETTER 디스크 크기
 *
 * @return 디스크 크기
 */
public  getDiskSize() : number{
  return this.diskSize;
}

/**
 * SETTER 디스크 크기
 *
 * @param diskSize 디스크 크기
 */
public setDiskSize( diskSize : number) {
  this.diskSize = diskSize;
}

/**
 * GETTER 메모리 크기
 *
 * @return 메모리 크기
 */
public  getMemorySize() : number{
  return this.memorySize;
}

/**
 * SETTER 메모리 크기
 *
 * @param memorySize 메모리 크기
 */
public setMemorySize( memorySize: number) {
  this.memorySize = memorySize;
}

/**
 * GETTER 대시보드 사용 유무
 *
 * @return 대시보드 사용 유무
 */
public getDashboardUseYn() : string {
  return this.dashboardUseYn;
}

/**
 * SETTER 대시보드 사용 유무
 *
 * @param dashboardUseYn 대시보드 사용 유무
 */
public setDashboardUseYn(dashboardUseYn : string) {
  this.dashboardUseYn = dashboardUseYn;
}
}
