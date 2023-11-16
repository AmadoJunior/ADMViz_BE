package com.adm.cruddemo.security;

import com.adm.cruddemo.service.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.*;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.bcrypt.*;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    //BCrypt Encoder
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    //Auth Provider
    @Bean
    public DaoAuthenticationProvider authenticationProvider(UserService userService) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userService); //set the custom user details service
        authProvider.setPasswordEncoder(passwordEncoder()); //set the password encoder - bcrypt
        return authProvider;
    }

    //Security Chain
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        //Routes
        http.authorizeHttpRequests(configure ->
                configure
                        .requestMatchers(HttpMethod.GET, "/api/users").hasRole("USER")
                        .requestMatchers(HttpMethod.GET, "/api/users/**").hasRole("USER")
                        .requestMatchers(HttpMethod.POST, "/api/users").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/users/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/users").hasRole("ADMIN"));

        //Basic Auth
        http.httpBasic(Customizer.withDefaults());

        //CSRF OFF
        http.csrf(AbstractHttpConfigurer::disable);

        return http.build();
    }
}
