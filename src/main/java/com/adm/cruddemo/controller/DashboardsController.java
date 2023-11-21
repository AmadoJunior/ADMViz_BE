package com.adm.cruddemo.controller;

import com.adm.cruddemo.DTO.*;
import com.adm.cruddemo.entity.Dashboard;
import com.adm.cruddemo.service.CustomUserDetails;
import com.adm.cruddemo.service.DashboardService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController()
@RequestMapping(path = "/api")
public class DashboardsController {
    @Autowired
    DashboardService dashboardService;

    private Logger logger = LoggerFactory.getLogger(AuthenticationController.class);

    public DashboardsController() {
    }

    public DashboardsController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @Transactional
    @PostMapping("/dashboards")
    public ResponseEntity<?> createDashboard(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody DashboardRecord newDashboard
    ) {
        try {
            Dashboard savedDashboard = dashboardService.createDashboard(userDetails.getId(), newDashboard);
            logger.debug("Created Dashboard");
            return new ResponseEntity<Dashboard>(savedDashboard, HttpStatus.OK);
        } catch(Exception e) {
            logger.debug("Failed To Create Dashboard");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST.getReasonPhrase(), HttpStatus.BAD_REQUEST);
        }
    }
    @Transactional
    @PatchMapping("/dashboards/{dashboardId}")
    public ResponseEntity<?> updateDashboard(
            @PathVariable(value="dashboardId") int dashboardId,
            @RequestBody DashboardRecord updatedDashboard
    ) {
        try {
            Dashboard savedDashboard = dashboardService.updateDashboard(dashboardId, updatedDashboard);
            logger.debug("Updated Dashboard");
            return new ResponseEntity<Dashboard>(savedDashboard, HttpStatus.OK);
        } catch(Exception e) {
            logger.debug("Failed To Update Dashboard");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST.getReasonPhrase(), HttpStatus.BAD_REQUEST);
        }
    }

    @Transactional
    @DeleteMapping("/dashboards/{dashboardId}")
    public ResponseEntity<?> deleteDashboard(
            @PathVariable(value="dashboardId") int dashboardId
    ) {
        try {
            dashboardService.deleteDashboard(dashboardId);
            logger.debug("Deleted Dashboard");
            return new ResponseEntity<>(HttpStatus.OK.getReasonPhrase(), HttpStatus.OK);
        } catch(Exception e) {
            logger.debug("Failed To Delete Dashboard");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST.getReasonPhrase(), HttpStatus.BAD_REQUEST);
        }
    }

    @Transactional
    @PostMapping("/dashboards/{dashboardId}/charts")
    public ResponseEntity<?> insertChart(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable(value="dashboardId") int dashboardId,
            @RequestBody ChartRecord newChart
    ) {
        try {
            Dashboard savedDashboard = dashboardService.insertChart(userDetails.getId(), dashboardId, newChart);
            logger.debug("Chart Inserted");
            return new ResponseEntity<Dashboard>(savedDashboard, HttpStatus.OK);
        } catch(Exception e) {
            logger.debug("Failed To Insert Chart");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST.getReasonPhrase(), HttpStatus.BAD_REQUEST);
        }
    }

    @Transactional
    @PatchMapping("/dashboards/{dashboardId}/charts/{chartId}")
    public ResponseEntity<?> updateChartInDashboard(
            @PathVariable(value="dashboardId") int dashboardId,
            @PathVariable(value="chartId") int chartId,
            @RequestBody ChartRecord updatedChart
    ) {
        try {
            Dashboard savedDashboard = dashboardService.updateChartInDashboard(dashboardId, chartId, updatedChart);
            logger.debug("Chart Updated");
            return new ResponseEntity<Dashboard>(savedDashboard, HttpStatus.OK);
        } catch(Exception e) {
            logger.debug("Failed To Update Chart");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST.getReasonPhrase(), HttpStatus.BAD_REQUEST);
        }
    }

    @Transactional
    @DeleteMapping("/dashboards/{dashboardId}/charts/{chartId}")
    public ResponseEntity<?> deleteChart(
            @PathVariable(value="dashboardId") int dashboardId,
            @PathVariable(value="chartId") int chartId
    ) {
        try {
            Dashboard savedDashboard = dashboardService.removeChartFromDashboard(dashboardId, chartId);
            logger.debug("Chart Deleted");
            return new ResponseEntity<Dashboard>(savedDashboard, HttpStatus.OK);
        } catch(Exception e) {
            logger.debug("Failed To Delete Chart");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST.getReasonPhrase(), HttpStatus.BAD_REQUEST);
        }
    }

    @Transactional
    @PatchMapping("/dashboards/{dashboardId}/charts/{chartId}/position")
    public ResponseEntity<?> updateChartPosition(
            @PathVariable(value="dashboardId") int dashboardId,
            @PathVariable(value="chartId") int chartId,
            @RequestBody ChartPositionRecord chartPosition
    ) {
        try {
            Dashboard savedDashboard = dashboardService.updateChartPosition(dashboardId, chartId, chartPosition);
            logger.debug("Chart Position Updated");
            return new ResponseEntity<Dashboard>(savedDashboard, HttpStatus.OK);
        } catch(Exception e) {
            logger.debug("Failed To Update Chart Pos");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST.getReasonPhrase(), HttpStatus.BAD_REQUEST);
        }
    }

    public DashboardService getDashboardService() {
        return dashboardService;
    }

    public void setDashboardService(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    public Logger getLogger() {
        return logger;
    }

    public void setLogger(Logger logger) {
        this.logger = logger;
    }
}