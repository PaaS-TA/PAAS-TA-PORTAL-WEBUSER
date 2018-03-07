package org.openpaas.paasta.portal.web.user.controller;

import org.openpaas.paasta.portal.web.user.common.Common;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.ModelAndView;

import java.util.HashMap;
import java.util.Map;

/**
 * WEB IDE 관리 컨트롤러 - WEB IDE 신청자를 관리하는 컨트롤러이다.
 *
 * @author 조민구
 * @version 1.0
 * @since 2016.8.29 최초작성
 */
@Controller
public class ZuulTestController extends Common {

    private static final Logger LOGGER = LoggerFactory.getLogger(ZuulTestController.class);

    @RequestMapping(value = {"/testmain"}, method = RequestMethod.GET)
    public ModelAndView indevPage() {
        try {
            return new ModelAndView("/testmain");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }


    @RequestMapping(value = {"/zuul/login"}, method = RequestMethod.GET)
    @ResponseBody
    public Map login(String id, String password) {


        LOGGER.info("login Start : " + id + "  " + password);
        Map<String, Object> resBody = new HashMap();
        resBody.put("id", id);
        resBody.put("password", password);
        ResponseEntity<Map> resEntity = apiCall("/login", HttpMethod.POST, resBody, "", Map.class);
        Map<String, Object> resultMap = resEntity.getBody();
        LOGGER.info("login End");
        return resultMap;
    }


    @RequestMapping(value = {"/zuul/getuser"}, method = RequestMethod.GET)
    @ResponseBody
    public String getUser(String id) {

        String rspApp = "";
        LOGGER.info("getUser Start : " + id);
        ResponseEntity rssResponse = commonapiCall("/user/getUser/" + id, HttpMethod.GET, "", "", String.class);
        rspApp = (String) rssResponse.getBody();
        LOGGER.info("getUser End ");
        return rspApp;
    }

    private static final String AUTHORIZATION_HEADER_KEY = "Authorization";
    private static final String CF_AUTHORIZATION_HEADER_KEY = "cf-Authorization";

    @Value("${paasta.portal.api.authorization.base64}")
    private String base64Authorization;

    public <T> ResponseEntity<T> apiCall(String reqUrl, HttpMethod httpMethod, Object obj, String reqToken, Class<T> responseType) {
        String server = "http://10.30.80.51:2225";
        //String server = "http://localhost:2225";

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders reqHeaders = new HttpHeaders();
        reqHeaders.add(AUTHORIZATION_HEADER_KEY, base64Authorization);

        if (null != reqToken && !"".equals(reqToken)) reqHeaders.add(CF_AUTHORIZATION_HEADER_KEY, reqToken);
        HttpEntity<Object> reqEntity = new HttpEntity<>(obj, reqHeaders);
        LOGGER.info("apiCall Target :: " + server + "/portalapi" + reqUrl);
        LOGGER.info("apiCall :: SEND");
        ResponseEntity<T> result = restTemplate.exchange(server + "/portalapi" + reqUrl, httpMethod, reqEntity, responseType);
        LOGGER.info("apiCall reqUrl :: {} || resultBody :: {}", reqUrl, result.getBody().toString());

        return result;
    }

    public <T> ResponseEntity<T> commonapiCall(String reqUrl, HttpMethod httpMethod, Object obj, String reqToken, Class<T> responseType) {
        String server = "http://10.30.80.51:2225";
        //String server = "http://localhost:2225";
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders reqHeaders = new HttpHeaders();
        reqHeaders.add(AUTHORIZATION_HEADER_KEY, base64Authorization);

        if (null != reqToken && !"".equals(reqToken)) reqHeaders.add(CF_AUTHORIZATION_HEADER_KEY, reqToken);
        HttpEntity<Object> reqEntity = new HttpEntity<>(obj, reqHeaders);
        LOGGER.info("commonapiTarget :: " + server + "/commonapi" + reqUrl);
        LOGGER.info("commonapiTarget :: " + "/commonapi" + reqUrl);


        LOGGER.info("commonapiCall :: SEND");
        ResponseEntity<T> result = restTemplate.exchange(server + "/commonapi" + reqUrl, httpMethod, reqEntity, responseType);
        LOGGER.info("commonapiCall reqUrl :: {} || resultBody :: {}", reqUrl, result.getBody().toString());

        return result;
    }
}

