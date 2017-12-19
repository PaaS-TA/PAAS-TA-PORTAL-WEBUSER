package org.openpaas.paasta.portal.web.user.common;

import org.openpaas.paasta.portal.web.user.model.Catalog;
import org.openpaas.paasta.portal.web.user.security.SsoAuthenticationDetails;
import org.openpaas.paasta.portal.web.user.service.CommonService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.MessageSource;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.resource.OAuth2ProtectedResourceDetails;
import org.springframework.security.oauth2.client.token.AccessTokenRequest;
import org.springframework.security.oauth2.client.token.DefaultAccessTokenRequest;
import org.springframework.security.oauth2.client.token.grant.password.ResourceOwnerPasswordAccessTokenProvider;
import org.springframework.security.oauth2.client.token.grant.password.ResourceOwnerPasswordResourceDetails;
import org.springframework.security.oauth2.common.AuthenticationScheme;
import org.springframework.security.oauth2.common.OAuth2AccessToken;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;

/**
 * Common Class
 *
 * @author nawkm
 * @version 1.0
 * @since 2016.5.24
 */
public class Common {

    private static final Logger LOGGER = LoggerFactory.getLogger(Common.class);

    /**
     * Get Token
     *
     * @return string string
     */

    @Autowired
    public MessageSource messageSource;

    @Autowired
    public CommonService commonService;


    @Value("${cf.uaa.oauth.client.id}")
    private String clientId;

    @Value("${cf.uaa.oauth.client.secret}")
    private String clientSecret;

    @Value("${cf.uaa.oauth.info.uri}")
    private String oauthInfoUrl;

    @Value("${cf.uaa.oauth.token.check.uri}")
    private String checkTokenUri;

    @Value("${cf.uaa.oauth.authorization.uri}")
    private String authorizationUri;

    @Value("${cf.uaa.oauth.token.access.uri}")
    private String accessUri;

    @Value("${cf.uaa.oauth.logout.url}")
    private String logoutUrl;


    public String getToken() {
        try {
            SsoAuthenticationDetails user = ((SsoAuthenticationDetails) SecurityContextHolder.getContext().getAuthentication().getDetails());
            LOGGER.debug("############################# Token Expired : " + (user.getAccessToken().getExpiration().getTime() - System.currentTimeMillis()) / 1000 + " sec");
            // Token 만료 시간 비교
            if (user.getAccessToken().getExpiration().getTime() <= System.currentTimeMillis()) {
                //Rest 생성
                RestTemplate rest = new RestTemplate();
                //Token 재요청을 위한 데이터 설정
                OAuth2ProtectedResourceDetails resource = getResourceDetails(user.getUsername(), "N/A", clientId, clientSecret, accessUri);
                AccessTokenRequest accessTokenRequest = new DefaultAccessTokenRequest();
                ResourceOwnerPasswordAccessTokenProvider provider = new ResourceOwnerPasswordAccessTokenProvider();
                provider.setRequestFactory(rest.getRequestFactory());
                //Token 재요청
                OAuth2AccessToken refreshToken = provider.refreshAccessToken(resource, user.getAccessToken().getRefreshToken(), accessTokenRequest);


                //재요청으로 받은 Token 재설정
                user.setAccessToken(refreshToken);
                // session에 적용
                Authentication authentication = new UsernamePasswordAuthenticationToken(SecurityContextHolder.getContext().getAuthentication(), "N/A", SecurityContextHolder.getContext().getAuthentication().getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
            String token = user.getTokenValue();
            return token;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }


    public static int diffDay(Date d, Date accessDate) {
        /**
         * 날짜 계산
         */
        Calendar curC = Calendar.getInstance();
        Calendar accessC = Calendar.getInstance();
        curC.setTime(d);
        accessC.setTime(accessDate);
        accessC.compareTo(curC);
        int diffCnt = 0;
        while (!accessC.after(curC)) {
            diffCnt++;
            accessC.add(Calendar.DATE, 1); // 다음날로 바뀜
        }
        System.out.println("기준일로부터 " + diffCnt + "일이 지났습니다.");
        System.out.println(accessC.compareTo(curC));
        return diffCnt;
    }

    /**
     * 요청 파라미터들의 빈값 또는 null값 확인을 하나의 메소드로 처리할 수 있도록 생성한 메소드
     * 요청 파라미터 중 빈값 또는 null값인 파라미터가 있는 경우, false를 리턴한다.
     *
     * @param params
     * @return
     */
    public boolean stringNullCheck(String... params) {
        return Arrays.stream(params).allMatch(param -> null != param && !param.equals(""));
    }

    private OAuth2ProtectedResourceDetails getResourceDetails(String username, String password, String clientId, String clientSecret, String url) {
        ResourceOwnerPasswordResourceDetails resource = new ResourceOwnerPasswordResourceDetails();
        resource.setUsername(username);
        resource.setPassword(password);

        resource.setClientId(clientId);
        resource.setClientSecret(clientSecret);
        resource.setId(clientId);
        resource.setClientAuthenticationScheme(AuthenticationScheme.header);
        resource.setAccessTokenUri(url);

        return resource;
    }

    public String getClientId() {
        return clientId;
    }

    public String getClientSecret() {
        return clientSecret;
    }

    public String getOauthInfoUrl() {
        return oauthInfoUrl;
    }

    public String getCheckTokenUri() {
        return checkTokenUri;
    }

    public String getAuthorizationUri() {
        return authorizationUri;
    }

    public String getAccessUri() {
        return accessUri;
    }

    public String getLogoutUrl() {
        return logoutUrl;
    }


    public String parsingParameter(Catalog catalog) {
        String returnValue = "";
        String parameter = catalog.getParameter();
        LOGGER.info("PARAMETER BEFORE : " + parameter);
        if (parameter.length() > 0) {
            parameter = parameter.replace("{", "").replace("}", "");
            String[] dataset = parameter.split(",");
            int count = 1;
            String setValue = "";
            for (String str : dataset) {
                String[] data = str.split(":");
                String variable = data[0].replace("\"", "").trim();
                String value = data[1].replace("\"", "").trim();
                if (variable.equalsIgnoreCase("org_name") && value.equalsIgnoreCase("default")) {
                    setValue = dataSetting(variable, catalog.getOrgName());
                } else if (variable.equalsIgnoreCase("space_name") && value.equalsIgnoreCase("default")) {
                    setValue = dataSetting(variable, catalog.getSpaceName());
                } else if (variable.equalsIgnoreCase("owner") && value.equalsIgnoreCase("default")) {
                    setValue = dataSetting(variable, catalog.getUserId());
                } else {
                    setValue = str;
                }

                if (count > 1) {
                    returnValue = returnValue + "," + setValue;
                } else {
                    returnValue = setValue;
                }
                count++;
            }
            returnValue = "{" + returnValue + "}";
        }
        LOGGER.info("PARAMETER AFTER : " + returnValue);
        return returnValue;
    }


    private String dataSetting(String variable, String value) {
        String data = "\"" + variable + "\":\"" + value + "\"";
        return data;
    }


}

/**
 * SSO 이전 토큰 리플래쉬 코딩
 * <p>
 * //token 만료 시간 비교
 * if(user.getExpireDate() <= System.currentTimeMillis()){
 * <p>
 * try{
 * Map<String,Object> resBody = new HashMap();
 * resBody.put("id", user.getUsername());
 * resBody.put("password", user.getPassword());
 * <p>
 * Map result;
 * <p>
 * result = commonService.procRestTemplate("/login", HttpMethod.POST, resBody, null);
 * <p>
 * user.setToken((String)result.get("token"));
 * user.setExpireDate((Long)result.get("expireDate"));
 * <p>
 * // session에 적용
 * Authentication authentication = new UsernamePasswordAuthenticationToken(user, user.getPassword(), user.getAuthorities());
 * SecurityContextHolder.getContext().setAuthentication(authentication);
 * <p>
 * LOG.info("new token : " + user.getToken());
 * <p>
 * } catch (Exception e) {
 * throw new BadCredentialsException(e.getMessage());
 * }
 * }
 * <p>
 * LOG.info("############################# Expires In : " + (user.getExpireDate() - System.currentTimeMillis())/1000 + " sec");
 */