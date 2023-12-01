package com.adm.cruddemo.service;

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

    @Autowired
    public UserDetailsServiceImpl(UserRepo userRepo) {
        this.userRepo = userRepo;
    }
    @Override
    public UserDetails loadUserByUsername(String userName) throws UsernameNotFoundException {
        return loadUser(userName);
    }

    public UserDetails loadUserByUsernameWithoutCredentials(String userName) throws UsernameNotFoundException {
        CustomUserDetails customUserDetails = loadUser(userName);
        customUserDetails.eraseCredentials();
        return customUserDetails;
    }

    private CustomUserDetails loadUser(String userName) throws UsernameNotFoundException {
        Optional<User> userResult = userRepo.findByUsernameOrEmail(userName);
        if (userResult.isEmpty()) {
            throw new UsernameNotFoundException("User Not Found");
        }
        User user = userResult.get();
        return new CustomUserDetails(
                user.getId(),
                user.getUserName(),
                user.getEmail(),
                user.getPassword(),
                user.isEnabled(),
                true,
                true,
                true,
                mapRolesToAuthorities(user.getRoles())
        );
    }

    private Collection<? extends GrantedAuthority> mapRolesToAuthorities(Collection<Role> roles) {
        return roles.stream().map(role -> new SimpleGrantedAuthority(role.getName())).collect(Collectors.toList());
    }


}
