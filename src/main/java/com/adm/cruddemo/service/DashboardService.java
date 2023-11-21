package com.adm.cruddemo.service;

import com.adm.cruddemo.DTO.ChartPositionRecord;
import com.adm.cruddemo.DTO.ChartRecord;
import com.adm.cruddemo.DTO.DashboardRecord;
import com.adm.cruddemo.entity.Chart;
import com.adm.cruddemo.entity.ChartPosition;
import com.adm.cruddemo.entity.Dashboard;
import com.adm.cruddemo.entity.User;
import com.adm.cruddemo.repository.ChartPositionRepo;
import com.adm.cruddemo.repository.ChartRepo;
import com.adm.cruddemo.repository.DashboardRepo;
import com.adm.cruddemo.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
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

    public Dashboard createDashboard(int userId, DashboardRecord dashboardRecord) throws Exception {
        Optional<User> foundUser = userRepository.findById(userId);
        if(foundUser.isEmpty()){
            throw new Exception("User Not Found");
        }

        Dashboard newDashboard = new Dashboard();
        newDashboard.setName(dashboardRecord.name());
        newDashboard.setUser(foundUser.get());
        newDashboard.setCharts(new ArrayList<>());

        return dashboardRepo.save(newDashboard);
    }

    public void deleteDashboard(int dashboardId) throws Exception {
        Optional<Dashboard> foundDashboard = dashboardRepo.findById(dashboardId);
        if(foundDashboard.isEmpty()){
            throw new Exception("Dashboard Not Found");
        }

        dashboardRepo.delete(foundDashboard.get());
    }

    public Dashboard updateDashboard(int dashboardId,  DashboardRecord dashboardRecord) throws Exception {
        Optional<Dashboard> foundDashboard = dashboardRepo.findById(dashboardId);
        if(foundDashboard.isEmpty()){
            throw new Exception("Dashboard Not Found");
        }

        Dashboard dashboardToUpdate = foundDashboard.get();
        dashboardToUpdate.setName(dashboardRecord.name());

        return dashboardRepo.save(dashboardToUpdate);
    }

    public ChartPosition createDefaultChartPosition(Chart parentChart) {
        return new ChartPosition(0, 0, 50, 565, parentChart);
    }

    public Dashboard insertChart(int userId, int dashboardId, ChartRecord chartRecord) throws Exception {
        Optional<User> foundUser = userRepository.findById(userId);
        if(foundUser.isEmpty()){
            throw new Exception("User Not Found");
        }

        Optional<Dashboard> foundDashboard = dashboardRepo.findById(dashboardId);
        if(foundDashboard.isEmpty()){
            throw new Exception("Dashboard Not Found");
        }

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
        ChartPosition defaultChartPosition = createDefaultChartPosition(newChart);
        newChart.addPosition(defaultChartPosition);

        //Save Dashboard
        foundDashboard.get().addChart(newChart);

        return dashboardRepo.save(foundDashboard.get());
    }
    public Dashboard removeChartFromDashboard(int dashboardId, int chartId) throws Exception {
        Optional<Dashboard> foundDashboard = dashboardRepo.findById(dashboardId);
        if (foundDashboard.isEmpty()) {
            throw new Exception("Dashboard Not Found");
        }

        Dashboard dashboard = foundDashboard.get();
        dashboard.getCharts().removeIf(chart -> chart.getId() == chartId);

        return dashboardRepo.save(dashboard);
    }

    public Dashboard updateChartInDashboard(int dashboardId, int chartId, ChartRecord updatedChartRecord) throws Exception {
        Optional<Dashboard> foundDashboard = dashboardRepo.findById(dashboardId);
        if (foundDashboard.isEmpty()) {
            throw new Exception("Dashboard Not Found");
        }

        Dashboard dashboard = foundDashboard.get();
        Chart chartToUpdate = dashboard.getCharts().stream()
                .filter(chart -> chart.getId() == chartId)
                .findFirst()
                .orElseThrow(() -> new Exception("Chart Not Found"));

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

    public Dashboard updateChartPosition(int dashboardId, int chartId, ChartPositionRecord chartPositionRecord) throws Exception {
        // Find the Dashboard
        Optional<Dashboard> foundDashboard = dashboardRepo.findById(dashboardId);
        if (foundDashboard.isEmpty()) {
            throw new Exception("Dashboard Not Found");
        }

        // Retrieve the Chart from the Dashboard
        Dashboard dashboard = foundDashboard.get();
        Chart chartToUpdate = dashboard.getCharts().stream()
                .filter(chart -> chart.getId() == chartId)
                .findFirst()
                .orElseThrow(() -> new Exception("Chart Not Found"));

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
