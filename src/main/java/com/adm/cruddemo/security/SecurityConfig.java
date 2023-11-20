package com.adm.cruddemo.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    @Bean
    public AuthenticationSuccessHandler authenticationSuccessHandler()
    {
        return new RestAuthenticationSuccessHandler();
    }
    @Bean
    public AuthenticationFailureHandler authenticationFailureHandler()
    {
        return new RestAuthenticationFailureHandler();
    }
    @Bean
    public AccessDeniedHandler accessDeniedHandler()
    {
        return new RestAccessDeniedHandler();
    }
    //BCrypt Encoder
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    //Auth Provider
    @Bean
    public AuthenticationProvider authenticationProvider(UserDetailsService userService) {
        RestAuthenticationProvider authProvider = new RestAuthenticationProvider();
        authProvider.setUserDetailsService(userService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    //Security Chain
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        //Routes
        http.authorizeHttpRequests(configure ->
                configure
                        .requestMatchers(
                                HttpMethod.GET,
                                "/index*", "/static/**", "/*.js", "/*.json", "/*.ico")
                        .permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/perform_login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/perform_register").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/self").permitAll()
                        .anyRequest().authenticated()
        );

        //Basic Auth
        //http.httpBasic(Customizer.withDefaults());

        //Exceptions
        http.exceptionHandling(exception -> {
            exception.accessDeniedHandler(accessDeniedHandler());
        });

        //Sessions
        http.sessionManagement(session -> session
                        .maximumSessions(10)
                );

        //Authentication
        http.formLogin(formLogin ->
                formLogin
                        .loginPage("/")
                        .loginProcessingUrl("/api/perform_login")
                        .successHandler(authenticationSuccessHandler())
                        .failureHandler(authenticationFailureHandler())
                        .permitAll()
        );

        http.logout(logout ->
                logout
                        .logoutUrl("/api/perform_logout")
                        .deleteCookies("JSESSIONID")
                        .logoutSuccessUrl("/")
        );

        //CSRF OFF
        http.csrf(AbstractHttpConfigurer::disable);

        return http.build();
    }
}
