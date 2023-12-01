package com.adm.cruddemo.service;

import com.adm.cruddemo.DTO.ChartPositionRecord;
import com.adm.cruddemo.DTO.ChartRecord;
import com.adm.cruddemo.DTO.DashboardRecord;
import com.adm.cruddemo.entity.Chart;
import com.adm.cruddemo.entity.ChartPosition;
import com.adm.cruddemo.entity.Dashboard;
import com.adm.cruddemo.entity.User;
import com.adm.cruddemo.exception.AccessDeniedException;
import com.adm.cruddemo.exception.ResourceNotFoundException;
import com.adm.cruddemo.repository.ChartPositionRepo;
import com.adm.cruddemo.repository.ChartRepo;
import com.adm.cruddemo.repository.DashboardRepo;
import com.adm.cruddemo.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.CacheManager;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class DashboardService {
    @Autowired
    private UserRepo userRepository;
    @Autowired
    private DashboardRepo dashboardRepo;
    @Autowired
    private ChartRepo chartRepo;
    @Autowired
    private ChartPositionRepo chartPositionRepo;
    @Autowired
    private RedisTemplate redisTemplate;

    public DashboardService(){}

    public DashboardService(UserRepo userRepository, DashboardRepo dashboardRepo, ChartRepo chartRepo, ChartPositionRepo chartPositionRepo) {
        this.userRepository = userRepository;
        this.dashboardRepo = dashboardRepo;
        this.chartRepo = chartRepo;
        this.chartPositionRepo = chartPositionRepo;
    }

    public void handleAuthorization(long userId, Dashboard dashboard) throws RuntimeException {
        if(dashboard.getUser().getId() != userId) {
            throw new AccessDeniedException("Forbidden");
        }
    }

    public Dashboard createDashboard(long userId, DashboardRecord dashboardRecord) throws RuntimeException {
        Optional<User> foundUser = userRepository.findById(userId);
        if(foundUser.isEmpty()){
            throw new ResourceNotFoundException("User Not Found");
        }

        Dashboard newDashboard = new Dashboard();
        newDashboard.setName(dashboardRecord.name());
        newDashboard.setUser(foundUser.get());
        newDashboard.setCharts(new ArrayList<>());

        return dashboardRepo.save(newDashboard);
    }

    public void deleteDashboard(long userId, long dashboardId) throws RuntimeException {
        Optional<Dashboard> foundDashboard = dashboardRepo.findById(dashboardId);
        if(foundDashboard.isEmpty()){
            throw new ResourceNotFoundException("Dashboard Not Found");
        }

        handleAuthorization(userId, foundDashboard.get());

        dashboardRepo.delete(foundDashboard.get());
    }

    public Dashboard updateDashboard(long userId, long dashboardId,  DashboardRecord dashboardRecord) throws RuntimeException {
        Optional<Dashboard> foundDashboard = dashboardRepo.findById(dashboardId);
        if(foundDashboard.isEmpty()){
            throw new ResourceNotFoundException("Dashboard Not Found");
        }

        handleAuthorization(userId, foundDashboard.get());

        Dashboard dashboardToUpdate = foundDashboard.get();
        dashboardToUpdate.setName(dashboardRecord.name());

        return dashboardRepo.save(dashboardToUpdate);
    }

    public ChartPosition createDefaultChartPosition() {
        return new ChartPosition(0, 0, 50, 565);
    }

    public ChartPosition createChartPosition(ChartPositionRecord positionRecord) {
        return new ChartPosition(positionRecord.x(), positionRecord.y(), positionRecord.w(), positionRecord.h());
    }

    public Dashboard insertChart(long userId, long dashboardId, ChartRecord chartRecord) throws RuntimeException {
        Optional<User> foundUser = userRepository.findById(userId);
        if(foundUser.isEmpty()){
            throw new ResourceNotFoundException("User Not Found");
        }

        Optional<Dashboard> foundDashboard = dashboardRepo.findById(dashboardId);
        if(foundDashboard.isEmpty()){
            throw new ResourceNotFoundException("Dashboard Not Found");
        }

        handleAuthorization(userId, foundDashboard.get());

        Chart newChart = new Chart();
        newChart.setUser(foundUser.get());
        newChart.setDashboard(foundDashboard.get());
        newChart.setName(chartRecord.name());
        newChart.setSrcUrl(chartRecord.srcUrl());
        newChart.setDataKey(chartRecord.dataKey());
        newChart.setLabelKey(chartRecord.labelKey());
        newChart.setChartType(chartRecord.chartType());
        newChart.setMethod(chartRecord.method());
        newChart.setApiKey(chartRecord.apiKey());
        newChart.setFromDate(chartRecord.fromDate());
        newChart.setToDate(chartRecord.toDate());

        //Position
        ChartPosition curChartPos = chartRecord.position() == null ? createDefaultChartPosition() : createChartPosition(chartRecord.position());
        newChart.addPosition(curChartPos);

        //Save Dashboard
        foundDashboard.get().addChart(newChart);

        return dashboardRepo.save(foundDashboard.get());
    }
    public Dashboard removeChartFromDashboard(long userId, long dashboardId, long chartId) throws RuntimeException {
        Optional<Dashboard> foundDashboard = dashboardRepo.findById(dashboardId);
        if (foundDashboard.isEmpty()) {
            throw new ResourceNotFoundException("Dashboard Not Found");
        }

        handleAuthorization(userId, foundDashboard.get());

        Dashboard dashboard = foundDashboard.get();
        dashboard.getCharts().removeIf(chart -> chart.getId() == chartId);

        return dashboardRepo.save(dashboard);
    }

    public Dashboard updateChartInDashboard(long userId, long dashboardId, long chartId, ChartRecord updatedChartRecord) throws RuntimeException {
        Optional<Dashboard> foundDashboard = dashboardRepo.findById(dashboardId);
        if (foundDashboard.isEmpty()) {
            throw new ResourceNotFoundException("Dashboard Not Found");
        }

        handleAuthorization(userId, foundDashboard.get());

        Dashboard dashboard = foundDashboard.get();
        Chart chartToUpdate = dashboard.getCharts().stream()
                .filter(chart -> chart.getId() == chartId)
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Chart Not Found"));

        // Update Chart Properties
        chartToUpdate.setName(updatedChartRecord.name());
        chartToUpdate.setSrcUrl(updatedChartRecord.srcUrl());
        chartToUpdate.setDataKey(updatedChartRecord.dataKey());
        chartToUpdate.setLabelKey(updatedChartRecord.labelKey());
        chartToUpdate.setChartType(updatedChartRecord.chartType());
        chartToUpdate.setMethod(updatedChartRecord.method());
        chartToUpdate.setApiKey(updatedChartRecord.apiKey());
        chartToUpdate.setFromDate(updatedChartRecord.fromDate());
        chartToUpdate.setToDate(updatedChartRecord.toDate());

        return dashboardRepo.save(dashboard);
    }

    public Dashboard updateChartPosition(long userId, long dashboardId, long chartId, ChartPositionRecord chartPositionRecord) throws RuntimeException {
        // Find the Dashboard
        Optional<Dashboard> foundDashboard = dashboardRepo.findById(dashboardId);
        if (foundDashboard.isEmpty()) {
            throw new ResourceNotFoundException("Dashboard Not Found");
        }

        handleAuthorization(userId, foundDashboard.get());

        // Retrieve the Chart from the Dashboard
        Dashboard dashboard = foundDashboard.get();
        Chart chartToUpdate = dashboard.getCharts().stream()
                .filter(chart -> chart.getId() == chartId)
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Chart Not Found"));

        // Update ChartPosition
        ChartPosition chartPosition = chartToUpdate.getPosition();
        if (chartPosition == null) {
            chartPosition = new ChartPosition();
            chartToUpdate.setPosition(chartPosition);
        }

        chartPosition.setX(chartPositionRecord.x());
        chartPosition.setY(chartPositionRecord.y());
        chartPosition.setW(chartPositionRecord.w());
        chartPosition.setH(chartPositionRecord.h());

        // Save changes via Dashboard
        return dashboardRepo.save(dashboard);
    }
}
