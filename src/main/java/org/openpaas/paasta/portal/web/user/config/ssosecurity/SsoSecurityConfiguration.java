package org.openpaas.paasta.portal.web.user.config.ssosecurity;

import org.openpaas.paasta.portal.web.user.security.SsoAuthenticationDetailsSource;
import org.openpaas.paasta.portal.web.user.security.SsoAuthenticationProcessingFilter;
import org.openpaas.paasta.portal.web.user.security.SsoAuthenticationSuccessHandler;
import org.openpaas.paasta.portal.web.user.security.SsoLogoutRedirectStrategy;
import org.openpaas.paasta.portal.web.user.util.SSLUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.security.authentication.AuthenticationDetailsSource;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.oauth2.client.DefaultOAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.filter.OAuth2ClientContextFilter;
import org.springframework.security.oauth2.client.token.AccessTokenRequest;
import org.springframework.security.oauth2.client.token.DefaultAccessTokenRequest;
import org.springframework.security.oauth2.client.token.grant.code.AuthorizationCodeResourceDetails;
import org.springframework.security.oauth2.provider.token.*;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;
import org.springframework.security.web.authentication.logout.SimpleUrlLogoutSuccessHandler;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.context.WebApplicationContext;

import javax.servlet.http.HttpServletRequest;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;

import static java.util.Arrays.asList;

/**
 * Created by Moon on 2017-07-21.
 */
@Configuration
public class SsoSecurityConfiguration {
    private static final Logger LOGGER = LoggerFactory.getLogger(SsoAuthenticationDetailsSource.class);




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

    @Autowired
    @Qualifier("authenticationManager")
    private AuthenticationManager authenticationManager;

    @Autowired
    private HttpServletRequest httpServletRequest;

    @Bean(name = "ssoEntryPointMatcher")
    public RequestMatcher ssoEntryPointMatcher() {
        return new AntPathRequestMatcher("/login/**");
    }

    @Bean(name = "ssoClientContextFilter")
    public SsoFilterWrapper ssoClientContextFilter() {
        // If it was a Filter bean it would be automatically added out of the Spring security filter chain.
        return SsoFilterWrapper.wrap(new OAuth2ClientContextFilter());
    }

    @Bean(name = "ssoSocialClientFilter")
    @Autowired
    public SsoFilterWrapper ssoSocialClientFilter() {
        // If it was a Filter bean it would be automatically added out of the Spring security filter chain.
        final SsoAuthenticationProcessingFilter filter
                = new SsoAuthenticationProcessingFilter();

        filter.setRestTemplate(ssoRestOperations());
        filter.setTokenServices(ssoResourceServerTokenServices());
        filter.setAuthenticationManager(authenticationManager);
        filter.setRequiresAuthenticationRequestMatcher(ssoEntryPointMatcher());
        filter.setDetailsSource(ssoAuthenticationDetailsSource());
        filter.setAuthenticationSuccessHandler(new SsoAuthenticationSuccessHandler());

        return SsoFilterWrapper.wrap(filter);
    }

    @Bean(name = "ssoProtectedResourceDetails")
    @Scope(value = WebApplicationContext.SCOPE_SESSION)
    @Autowired
    public AuthorizationCodeResourceDetails ssoProtectedResourceDetails() {
        final AuthorizationCodeResourceDetails resourceDetails = new AuthorizationCodeResourceDetails() {
            @Override
            public boolean isClientOnly() {
                return true;
            }
        };
        resourceDetails.setClientId(clientId);
        resourceDetails.setClientSecret(clientSecret);
        resourceDetails.setUserAuthorizationUri(authorizationUri);
        resourceDetails.setAccessTokenUri(accessUri);
        resourceDetails.setUseCurrentUri(true);
        resourceDetails.setScope(asList("openid", "cloud_controller_service_permissions.read", "cloud_controller.read", "cloud_controller.write"));

        return resourceDetails;
    }

    @Bean(name = "ssoClientContext")
    @Scope(value = WebApplicationContext.SCOPE_SESSION, proxyMode = ScopedProxyMode.TARGET_CLASS)
    @Autowired
    public OAuth2ClientContext ssoClientContext() {
        return new DefaultOAuth2ClientContext(ssoAccessTokenRequest());
    }

    @Bean(name = "ssoAccessTokenRequest")
    @Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.TARGET_CLASS)
    @Autowired
    public AccessTokenRequest ssoAccessTokenRequest() {
        final DefaultAccessTokenRequest request = new DefaultAccessTokenRequest(httpServletRequest.getParameterMap());

        final Object currentUri = httpServletRequest.getAttribute(OAuth2ClientContextFilter.CURRENT_URI);
        if (currentUri != null) {
            request.setCurrentUri(currentUri.toString());
        }

        return request;
    }

    @Bean(name = "ssoRestOperations")
    @Scope(value = WebApplicationContext.SCOPE_SESSION, proxyMode = ScopedProxyMode.TARGET_CLASS)
    @Autowired
    public OAuth2RestTemplate ssoRestOperations() {

        try {
            SSLUtils.turnOffSslChecking();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (KeyManagementException e) {
            e.printStackTrace();
        }


        return new OAuth2RestTemplate(ssoProtectedResourceDetails(), ssoClientContext());
    }

    @Bean(name = "ssoAccessTokenConverter")
    public AccessTokenConverter ssoAccessTokenConverter() {
        final DefaultAccessTokenConverter defaultAccessTokenConverter = new DefaultAccessTokenConverter();
        final DefaultUserAuthenticationConverter userTokenConverter = new DefaultUserAuthenticationConverter();
        userTokenConverter.setDefaultAuthorities(new String[]{"ROLE_" + SsoSecurityConfigAdapter.ROLE_LOGIN});
        defaultAccessTokenConverter.setUserTokenConverter(userTokenConverter);

        return defaultAccessTokenConverter;
    }

    @Bean(name = "ssoResourceServerTokenServices")
    @Scope(value = WebApplicationContext.SCOPE_SESSION, proxyMode = ScopedProxyMode.TARGET_CLASS)
    @Autowired
    public ResourceServerTokenServices ssoResourceServerTokenServices() {
        final RemoteTokenServices remoteTokenServices = new RemoteTokenServices();

        remoteTokenServices.setClientId(clientId);
        remoteTokenServices.setClientSecret(clientSecret);
        remoteTokenServices.setCheckTokenEndpointUrl(checkTokenUri);
        remoteTokenServices.setAccessTokenConverter(ssoAccessTokenConverter());

        return remoteTokenServices;
    }

    @Bean(name = "ssoAuthenticationDetailsSource")
    @Autowired
    public AuthenticationDetailsSource ssoAuthenticationDetailsSource() {
        return new SsoAuthenticationDetailsSource(ssoRestOperations(), oauthInfoUrl);
    }




    @Bean(name = "ssoLogoutSuccessHandler")
    public LogoutSuccessHandler ssoLogoutSuccessHandler() {
        final SimpleUrlLogoutSuccessHandler logoutSuccessHandler = new SimpleUrlLogoutSuccessHandler();
        logoutSuccessHandler.setRedirectStrategy(new SsoLogoutRedirectStrategy(logoutUrl));

        return logoutSuccessHandler;
    }

    @Bean(name = "ssoLogoutUrlMatcher")
    public RequestMatcher ssoLogoutUrlMatcher() {
        return new AntPathRequestMatcher("/logout");
    }

}
