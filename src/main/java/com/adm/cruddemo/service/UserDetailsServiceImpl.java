package com.adm.cruddemo.service;

import com.adm.cruddemo.repository.RoleRepo;
import com.adm.cruddemo.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import com.adm.cruddemo.entity.User;
import com.adm.cruddemo.entity.Role;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.Collection;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private UserRepo userRepo;

    private RoleRepo roleRepo;

    @Autowired
    public UserDetailsServiceImpl(UserRepo userRepo, RoleRepo roleRepo) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
    }

    public User findByUserName(String userName) {
        Optional<User> userResult = userRepo.findByUserName(userName);
        return userResult.orElse(null);
    }

    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        Optional<User> userResult = userRepo.findByUserName(userName);
        if (userResult.isEmpty()) {
            throw new UsernameNotFoundException("User Not Found");
        }
        User user = userResult.get();
        return new org.springframework.security.core.userdetails.User(user.getUserName(), user.getPassword(),
                mapRolesToAuthorities(user.getRoles()));
    }

    private Collection<? extends GrantedAuthority> mapRolesToAuthorities(Collection<Role> roles) {
        return roles.stream().map(role -> new SimpleGrantedAuthority(role.getName())).collect(Collectors.toList());
    }

    public User loadUserById(Integer userId) throws UsernameNotFoundException {
        Optional<User> userResult = userRepo.findById(userId);
        if (userResult.isEmpty()) {
            throw new UsernameNotFoundException("User Not Found");
        }
        return userResult.get();
    }
}
