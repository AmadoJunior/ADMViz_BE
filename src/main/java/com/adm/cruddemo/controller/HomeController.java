package com.adm.cruddemo.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class HomeController {
    @RequestMapping(value = { "/authenticate", "/dashboards", "/about" }, method = RequestMethod.GET)
    public String getIndex(HttpServletRequest request) {
        System.out.println(request.toString());
        return "/index.html";
    }
}

