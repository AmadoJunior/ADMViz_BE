package com.adm.cruddemo.controller;

import com.adm.cruddemo.DTO.*;
import com.adm.cruddemo.entity.Dashboard;
import com.adm.cruddemo.exception.TooManyResourcesException;
import com.adm.cruddemo.service.CustomUserDetails;
import com.adm.cruddemo.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.hateoas.RepresentationModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
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

    @Operation(
            description = "Creates a new dashboard for the authenticated user.",
            responses = {
                    @ApiResponse(
                            description = "Dashboard Created Successfully",
                            responseCode = "200",
                            content = @Content(
                                    mediaType = "application/json"
                            )
                    ),
                    @ApiResponse(
                            description = "Too Many Dashboards",
                            responseCode = "406",
                            content = @Content(
                                    mediaType = "text/plain"
                            )
                    ),
                    @ApiResponse(
                            description = "Failed To Create Dashboard",
                            responseCode = "400",
                            content = @Content(
                                    mediaType = "text/plain"
                            )
                    )
            }
    )
    @Transactional
    @RequestMapping(method=RequestMethod.POST, path = "/dashboards")
    public ResponseEntity<?> createDashboard(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody DashboardRecord newDashboard
    ) {
        try {
            System.out.println(userDetails.getId());
            Dashboard savedDashboard = dashboardService.createDashboard(userDetails.getId(), newDashboard);
            logger.debug("Created Dashboard");
            return new ResponseEntity<>(RepresentationModel.of(savedDashboard), HttpStatus.OK);
        } catch (TooManyResourcesException e) {
            logger.debug("Too Many Dashboards");
            return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE.getReasonPhrase(), HttpStatus.NOT_ACCEPTABLE);
        } catch(Exception e) {
            logger.debug("Failed To Create Dashboard");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST.getReasonPhrase(), HttpStatus.BAD_REQUEST);
        }
    }
    @Operation(
            description = "Updates an existing dashboard for the authenticated user.",
            responses = {
                    @ApiResponse(
                            description = "Dashboard Updated Successfully",
                            responseCode = "200",
                            content = @Content(
                                    mediaType = "application/json"
                            )
                    ),
                    @ApiResponse(
                            description = "Failed To Update Dashboard",
                            responseCode = "400",
                            content = @Content(
                                    mediaType = "text/plain"
                            )
                    )
            }
    )
    @Transactional
    @RequestMapping(method=RequestMethod.PUT, path = "/dashboards/{dashboardId}")
    public ResponseEntity<?> updateDashboard(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable(value="dashboardId") int dashboardId,
            @RequestBody DashboardRecord updatedDashboard
    ) {
        try {
            Dashboard savedDashboard = dashboardService.updateDashboard(userDetails.getId(), dashboardId, updatedDashboard);
            logger.debug("Updated Dashboard");
            return new ResponseEntity<>(RepresentationModel.of(savedDashboard), HttpStatus.OK);
        } catch(Exception e) {
            logger.debug("Failed To Update Dashboard");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST.getReasonPhrase(), HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(
            description = "Deletes a specified dashboard for the authenticated user.",
            responses = {
                    @ApiResponse(
                            description = "Dashboard Deleted Successfully",
                            responseCode = "200",
                            content = @Content(
                                    mediaType = "text/plain"
                            )
                    ),
                    @ApiResponse(
                            description = "Failed To Delete Dashboard",
                            responseCode = "400",
                            content = @Content(
                                    mediaType = "text/plain"
                            )
                    )
            }
    )
    @Transactional
    @RequestMapping(method=RequestMethod.DELETE, path = "/dashboards/{dashboardId}")
    public ResponseEntity<?> deleteDashboard(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable(value="dashboardId") int dashboardId
    ) {
        try {
            dashboardService.deleteDashboard(userDetails.getId(), dashboardId);
            logger.debug("Deleted Dashboard");
            return new ResponseEntity<>(HttpStatus.OK.getReasonPhrase(), HttpStatus.OK);
        } catch(Exception e) {
            logger.debug("Failed To Delete Dashboard");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST.getReasonPhrase(), HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(
            description = "Inserts a new chart into a specified dashboard for the authenticated user.",
            responses = {
                    @ApiResponse(
                            description = "Chart Inserted Successfully",
                            responseCode = "200",
                            content = @Content(
                                    mediaType = "application/json"
                            )
                    ),
                    @ApiResponse(
                            description = "Too Many Charts",
                            responseCode = "406",
                            content = @Content(
                                    mediaType = "text/plain"
                            )
                    ),
                    @ApiResponse(
                            description = "Failed To Insert Chart",
                            responseCode = "400",
                            content = @Content(
                                    mediaType = "text/plain"
                            )
                    )
            }
    )
    @Transactional
    @RequestMapping(method=RequestMethod.POST, path = "/dashboards/{dashboardId}/charts")
    public ResponseEntity<?> insertChart(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable(value="dashboardId") int dashboardId,
            @RequestBody ChartRecord newChart
    ) {
        try {
            Dashboard savedDashboard = dashboardService.insertChart(userDetails.getId(), dashboardId, newChart);
            logger.debug("Chart Inserted");
            return new ResponseEntity<>(RepresentationModel.of(savedDashboard), HttpStatus.OK);
        } catch (TooManyResourcesException e) {
            logger.debug("Too Many Charts");
            return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE.getReasonPhrase(), HttpStatus.NOT_ACCEPTABLE);
        } catch(Exception e) {
            logger.debug("Failed To Insert Chart");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST.getReasonPhrase(), HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(
            description = "Updates a specific chart in a specified dashboard for the authenticated user.",
            responses = {
                    @ApiResponse(
                            description = "Chart Updated Successfully",
                            responseCode = "200",
                            content = @Content(
                                    mediaType = "application/json"
                            )
                    ),
                    @ApiResponse(
                            description = "Failed To Update Chart",
                            responseCode = "400",
                            content = @Content(
                                    mediaType = "text/plain"
                            )
                    )
            }
    )
    @Transactional
    @RequestMapping(method=RequestMethod.PUT, path = "/dashboards/{dashboardId}/charts/{chartId}")
    public ResponseEntity<?> updateChartInDashboard(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable(value="dashboardId") int dashboardId,
            @PathVariable(value="chartId") int chartId,
            @RequestBody ChartRecord updatedChart
    ) {
        try {
            Dashboard savedDashboard = dashboardService.updateChartInDashboard(userDetails.getId(), dashboardId, chartId, updatedChart);
            logger.debug("Chart Updated");
            return new ResponseEntity<>(RepresentationModel.of(savedDashboard), HttpStatus.OK);
        } catch(Exception e) {
            logger.debug("Failed To Update Chart");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST.getReasonPhrase(), HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(
            description = "Deletes a specific chart from a specified dashboard for the authenticated user.",
            responses = {
                    @ApiResponse(
                            description = "Chart Deleted Successfully",
                            responseCode = "200",
                            content = @Content(
                                    mediaType = "text/plain"
                            )
                    ),
                    @ApiResponse(
                            description = "Failed To Delete Chart",
                            responseCode = "400",
                            content = @Content(
                                    mediaType = "text/plain"
                            )
                    )
            }
    )
    @Transactional
    @RequestMapping(method=RequestMethod.DELETE, path = "/dashboards/{dashboardId}/charts/{chartId}")
    public ResponseEntity<?> deleteChart(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable(value="dashboardId") int dashboardId,
            @PathVariable(value="chartId") int chartId
    ) {
        try {
            Dashboard savedDashboard = dashboardService.removeChartFromDashboard(userDetails.getId(), dashboardId, chartId);
            logger.debug("Chart Deleted");
            return new ResponseEntity<>(RepresentationModel.of(savedDashboard), HttpStatus.OK);
        } catch(Exception e) {
            logger.debug("Failed To Delete Chart");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST.getReasonPhrase(), HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(
            description = "Updates the position of a specific chart in a specified dashboard for the authenticated user.",
            responses = {
                    @ApiResponse(
                            description = "Chart Position Updated Successfully",
                            responseCode = "200",
                            content = @Content(
                                    mediaType = "application/json"
                            )
                    ),
                    @ApiResponse(
                            description = "Failed To Update Chart Position",
                            responseCode = "400",
                            content = @Content(
                                    mediaType = "text/plain"
                            )
                    )
            }
    )
    @Transactional
    @RequestMapping(method=RequestMethod.PUT, path = "/dashboards/{dashboardId}/charts/{chartId}/position")
    public ResponseEntity<?> updateChartPosition(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable(value="dashboardId") int dashboardId,
            @PathVariable(value="chartId") int chartId,
            @RequestBody ChartPositionRecord chartPosition
    ) {
        try {
            Dashboard savedDashboard = dashboardService.updateChartPosition(userDetails.getId(), dashboardId, chartId, chartPosition);
            logger.debug("Chart Position Updated");
            return new ResponseEntity<>(RepresentationModel.of(savedDashboard), HttpStatus.OK);
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
