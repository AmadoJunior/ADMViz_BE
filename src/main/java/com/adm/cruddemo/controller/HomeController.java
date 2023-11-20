package com.adm.cruddemo.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomeController {
    @RequestMapping(value = { "/", "/dashboards", "/about" })
    public String getIndex(HttpServletRequest request) {
        System.out.println(request.toString());
        return "/index.html";
    }
}

