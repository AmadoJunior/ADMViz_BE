package com.adm.cruddemo.security;

import com.adm.cruddemo.entity.Chart;
import com.adm.cruddemo.entity.ChartPosition;
import com.adm.cruddemo.entity.Dashboard;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.hateoas.MediaTypes;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.concurrent.TimeUnit;

@Component
public class SpringDataRestCustomization implements RepositoryRestConfigurer {
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        config.exposeIdsFor(Dashboard.class);
        config.exposeIdsFor(ChartPosition.class);
        config.exposeIdsFor(Chart.class);
        config.setReturnBodyOnCreate(true);
        config.setReturnBodyForPutAndPost(true);
        config.setReturnBodyOnUpdate(true);
        config.setMaxPageSize(250);
        config.setDefaultPageSize(50);
        config.setDefaultMediaType(MediaTypes.HAL_JSON);
        config.useHalAsDefaultJsonMediaType(true);

//        cors.addMapping("/**")
//                .allowedOrigins("http://localhost:3000")
//                .allowedMethods("GET", "POST", "PUT", "DELETE")
//                .allowedHeaders("*")
//                .exposedHeaders("WWW-Authenticate")
//                .allowCredentials(true)
//                .maxAge(TimeUnit.DAYS.toSeconds(1));
    }
}
