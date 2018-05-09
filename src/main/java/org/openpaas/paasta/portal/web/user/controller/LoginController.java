package org.openpaas.paasta.portal.web.user.controller;

import org.openpaas.paasta.portal.web.user.common.Common;
import org.openpaas.paasta.portal.web.user.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpMethod;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * 로그인 컨트롤러 - 로그인를 처리한다.
 *
 * @author 조민구
 * @version 1.0
 * @since 2016.4.4 최초작성
 */
@Controller
public class LoginController extends Common {

    private static final Logger LOGGER = LoggerFactory.getLogger(LoginController.class);

    /**
     * Indev page model and view.
     *
     * @return the model and view
     */
    @RequestMapping(value = {"/", "index"}, method = RequestMethod.GET)
    public ModelAndView indevPage(HttpServletRequest request) {
        try{
            String forward = request.getHeader("x-forwarded-proto");
            LOGGER.info("Forward ::::::::: " + forward);
            HttpSession session = request.getSession();
            session.setAttribute("x-forwarded-proto",forward);

            return new ModelAndView("/index");
        }catch (Exception e){
            e.printStackTrace();
        }
        return null;
    }

    /**
     * 로그인 화면
     *
     * @param error   the error
     * @param logout  the logout
     * @param locale  the locale
     * @param request the request
     * @return ModelAndView model
     */
    @RequestMapping(value = {"/login"}, method = RequestMethod.GET)
    public ModelAndView loginPage(@RequestParam(value = "error", required = false) String error,
                                   @RequestParam(value = "logout", required = false) String logout,
                                   @RequestParam(value = "code", required = false) String code,
                                   Locale locale, HttpServletRequest request,HttpServletResponse response) {



        ModelAndView model = new ModelAndView();

        if (error != null) {
            model.addObject("error", "Invalid login.");
        }

        if (logout != null) {
            model.addObject("message", "Logged out successfully.");
        }

        try{

            OAuth2Authentication auth2Authentication = (OAuth2Authentication) SecurityContextHolder.getContext().getAuthentication();
            List<GrantedAuthority> authorities = (List<GrantedAuthority>) auth2Authentication.getAuthorities();
            String loginUserRole = authorities.get(0).toString();
            LOGGER.info("loginUserRole : " + loginUserRole);

            if (!(loginUserRole.equalsIgnoreCase("ROLE_USER") || loginUserRole.equalsIgnoreCase("ROLE_ADMIN"))) {
                model.setViewName("/");
            } else {
                model.setView(new RedirectView("/org/orgMain", true, false));
            }
        }catch (Exception e) {
            e.printStackTrace();
            model.setViewName("/login");
        }

        return model;
    }


    /**
     * Request email authentication model and view.
     *
     * @param request  the request
     * @param response the response
     * @return the model and view
     */
    @RequestMapping(value = "/requestEmailAuthentication", method = RequestMethod.POST)
    public ModelAndView requestEmailAuthentication (HttpServletRequest request, HttpServletResponse response) {
        String id = (null == request.getParameter("id")) ? "" : request.getParameter("id").toString();
        ModelAndView model = new ModelAndView();

        User userDetail = new User();
        userDetail.setUserId(id);
        Map result = commonService.procRestTemplate("/requestEmailAuthentication", HttpMethod.POST, userDetail, null);

        model.setViewName("/user/addUser");
        if ((Boolean) result.get("bRtn")) {
            model.addObject("success", "인증이메일 보내기가 성공하였습니다.");
            model.addObject("id", id);
        } else {

            model.addObject("error",  result.getOrDefault("error","") +" 인증이메일 보내기가 실패하였습니다.");
        }

        return model;

    }

}
