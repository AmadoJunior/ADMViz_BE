//package com.adm.cruddemo.controller;
//
//import com.adm.cruddemo.entity.Chart;
//import com.adm.cruddemo.entity.Dashboard;
//import com.adm.cruddemo.entity.User;
//import com.adm.cruddemo.repository.ChartRepo;
//import com.adm.cruddemo.repository.DashboardRepo;
//import com.adm.cruddemo.repository.UserRepo;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.data.repository.query.Param;
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
//public class ChartController {
//    @Autowired
//    private AuthenticationManager authenticationManager;
//
//    @Autowired
//    private UserRepo userRepo;
//
//    @Autowired
//    private DashboardRepo dashboardRepo;
//
//    @Autowired
//    private ChartRepo chartRepo;
//
//    private Logger logger = LoggerFactory.getLogger(AuthenticationController.class);
//
//    @GetMapping("/charts")
//    public ResponseEntity<?> getUserDashboardCharts(@AuthenticationPrincipal UserDetails userDetails, @Param("dashboardId") int dashboardId) {
//        if(userDetails == null){
//            logger.debug("User Details Not Found");
//            return new ResponseEntity<>(HttpStatus.BAD_REQUEST.getReasonPhrase(), HttpStatus.BAD_REQUEST);
//        }
//
//        Optional<User> foundUser = userRepo.findByUserName(userDetails.getUsername());
//        if(foundUser.isPresent()){
//            Optional<Dashboard> foundDashboard = dashboardRepo.findByUserId(foundUser.get().getId(), dashboardId);
//            if(foundDashboard.isPresent()){
//                Dashboard dashboard = foundDashboard.get();
//                Collection<Chart> charts = chartRepo.findByDashboardId(dashboard.getId());
//                if(charts.isEmpty()){
//                    return new ResponseEntity<>(
//                            HttpStatus.NOT_FOUND.getReasonPhrase(), HttpStatus.NOT_FOUND
//                    );
//                }
//
//                return new ResponseEntity<Collection<Chart>>(charts, HttpStatus.OK);
//            }
//
//        }
//
//        return new ResponseEntity<>(
//                HttpStatus.NOT_FOUND.getReasonPhrase(), HttpStatus.NOT_FOUND
//        );
//    }
//}
