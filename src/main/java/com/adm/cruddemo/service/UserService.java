package com.adm.cruddemo.service;

import com.adm.cruddemo.entity.User;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {

    public User findByUserName(String userName);


}
