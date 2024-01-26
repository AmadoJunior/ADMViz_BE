package com.adm.cruddemo.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;

@OpenAPIDefinition(
        info = @Info(
                contact = @Contact(
                        name = "Amado",
                        email = "amado@admbuilt.com",
                        url = "http://admbuilt.com"
                ),
                title = "ADMViz OpenAPI Documentation",
                version = "1.0"
        ),
        servers = {
                @Server(
                        description = "Local ENV",
                        url = "http://localhost:8080"
                )
        },
        security = @SecurityRequirement(
                name = "SESSION"
        )
)
@SecurityScheme(
        name = "SESSION",
        description = "Use default spring security authentication.",
        type = SecuritySchemeType.APIKEY,
        in = SecuritySchemeIn.COOKIE
)
public class OpenApiConfig {
}
