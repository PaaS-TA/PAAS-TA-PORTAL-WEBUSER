package org.openpaas.paasta.portal.web.user.controller;

import org.openpaas.paasta.portal.web.user.common.Common;
import org.openpaas.paasta.portal.web.user.model.Menu;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

/**
 * 메뉴 목록 조회, 등록, 삭제 등 메뉴 관리의 API 를 호출 하는 컨트롤러이다.
 *
 * @author 김도준
 * @version 1.0
 * @since 2016.10.10 최초작성
 */
@Controller
@RequestMapping(value = {"/menu"})
public class MenuController extends Common {

    /**
     * 메뉴 최대값을 조회한다.
     */
    @RequestMapping(value = {"/getMenuMaxNoList"}, method = RequestMethod.GET)
    @ResponseBody
    public Map<String, Object> getMenuMaxNoList() {
        return commonService.common("/menu/getMenuMaxNoList", HttpMethod.POST, new Menu(), null);
    }

    /**
     * 메뉴를 조회한다.
     */
    @RequestMapping(value = {"/getUserMenuList"}, method = RequestMethod.GET)
    @ResponseBody
    public Map<String, Object> getUserMenuList() {
        return commonService.common("/menu/getUserMenuList", HttpMethod.POST, new Menu(), null);
    }

    /**
     * 메뉴를 상세 조회한다.
     */
    @RequestMapping(value = {"/getMenuDetail"}, method = RequestMethod.GET)
    @ResponseBody
    public Map<String, Object> getMenuDetail() {
        return commonService.common("/menu/getMenuDetail", HttpMethod.POST, new Menu(), "");
    }

    /**
     * 메뉴를 등록한다.
     */
    @RequestMapping(value = {"/insertMenu"}, method = RequestMethod.GET)
    @ResponseBody
    public Map<String, Object> insertMenu(){
        return commonService.common("/menu/insertMenu", HttpMethod.POST, new Menu(), null);
    }
}
