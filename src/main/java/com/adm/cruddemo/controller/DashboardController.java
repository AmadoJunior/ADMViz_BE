//package com.adm.cruddemo.controller;
//
//import com.adm.cruddemo.entity.Dashboard;
//import com.adm.cruddemo.entity.User;
//import com.adm.cruddemo.repository.DashboardRepo;
//import com.adm.cruddemo.repository.UserRepo;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import java.util.Collection;
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/api")
//public class DashboardController {
//    @Autowired
//    private AuthenticationManager authenticationManager;
//
//    @Autowired
//    private UserRepo userRepo;
//
//    @Autowired
//    private DashboardRepo dashboardRepo;
//
//    private Logger logger = LoggerFactory.getLogger(AuthenticationController.class);
//
//    @GetMapping("/dashboards")
//    public ResponseEntity<?> getUserDashboards(@AuthenticationPrincipal UserDetails userDetails) {
//        if(userDetails == null){
//            logger.debug("User Details Not Found");
//            return new ResponseEntity<>(HttpStatus.BAD_REQUEST.getReasonPhrase(), HttpStatus.BAD_REQUEST);
//        }
//
//        Optional<User> foundUser = userRepo.findByUserName(userDetails.getUsername());
//        if(foundUser.isPresent()){
//            Collection<Dashboard> foundDashboards = dashboardRepo.findByUserId(foundUser.get().getId());
//            return new ResponseEntity<Collection<Dashboard>>(foundDashboards, HttpStatus.CREATED);
//        }
//
//        return new ResponseEntity<>(
//                HttpStatus.NOT_FOUND.getReasonPhrase(), HttpStatus.NOT_FOUND
//        );
//    }
//}
