package com.example.APIGateway.config;

import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouterValidator {

        public static final List<String> openApiEndpoints = List.of(
                        "/api/internal/register",
                        "/api/internal/login",
                        "/api/internal/test-db",
                        "/api/investors/register",
                        "/api/investors/login",
                        "/api/investors/check-email",
                        "/api/investors/reset-password",
                        "/eureka");

        public Predicate<ServerHttpRequest> isSecured = request -> openApiEndpoints
                        .stream()
                        .noneMatch(uri -> request.getURI().getPath().contains(uri));

}
