package com.adm.cruddemo.repository;

import com.adm.cruddemo.entity.Chart;
import com.adm.cruddemo.entity.Dashboard;
import com.adm.cruddemo.entity.User;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.util.ArrayList;
import java.util.List;

@DataJpaTest
@ActiveProfiles("test")
public class ChartRepoTest {
    @Autowired
    private ChartRepo chartRepo;
    @Autowired
    private DashboardRepo dashboardRepo;
    @Autowired
    private UserRepo userRepo;

    private static final String MOCK_USER_NAME = "test";
    private static final String MOCK_USER_EMAIL = "test@gmail.com";
    private static final String MOCK_USER_PASS = "pass";
    @Test
    public void Query_countByDashboardId_ReturnsCount() {
        //Arrange
        User mockUser = User.builder()
                .userName(MOCK_USER_NAME)
                .email(MOCK_USER_EMAIL)
                .password(MOCK_USER_PASS)
                .enabled(true)
                .build();
        userRepo.save(mockUser);

        Dashboard mockDashboard = Dashboard.builder()
                .name("DashboardTest")
                .user(mockUser)
                .build();
        Dashboard savedDashboard = dashboardRepo.save(mockDashboard);

        final int mockChartCount = 2;
        List<Chart> chartList = new ArrayList<>();
        for(int i = 0; i < mockChartCount; i++){
            Chart mockChart = Chart.builder()
                    .name("ChartTest" + String.valueOf(i))
                    .dashboard(savedDashboard)
                    .user(mockUser)
                    .build();
            Chart savedChart = chartRepo.save(mockChart);
            chartList.add(savedChart);
        }

        //Act
        Long chartCount = chartRepo.countByDashboardId(savedDashboard.getId());

        //Assert
        Assertions.assertEquals(chartCount, chartList.size());
    }
    @Test
    public void Query_countByDashboardId_ReturnsZeroFound() {
        //Arrange
        User mockUser = User.builder()
                .userName(MOCK_USER_NAME)
                .email(MOCK_USER_EMAIL)
                .password(MOCK_USER_PASS)
                .enabled(true)
                .build();
        userRepo.save(mockUser);

        Dashboard mockDashboard = Dashboard.builder()
                .name("DashboardTest")
                .user(mockUser)
                .build();
        Dashboard savedDashboard = dashboardRepo.save(mockDashboard);

        //Act
        Long chartCount = chartRepo.countByDashboardId(savedDashboard.getId());

        //Assert
        Assertions.assertEquals(chartCount, 0);
    }

    @Test
    public void Query_findByChartName_ReturnsFound() {
        //Arrange
        User mockUser = User.builder()
                .userName(MOCK_USER_NAME)
                .email(MOCK_USER_EMAIL)
                .password(MOCK_USER_PASS)
                .enabled(true)
                .build();
        userRepo.save(mockUser);

        Dashboard mockDashboard = Dashboard.builder()
                .name("DashboardTest")
                .user(mockUser)
                .build();
        Dashboard savedDashboard = dashboardRepo.save(mockDashboard);

        Chart mockChart = Chart.builder()
                .name("ChartTest")
                .dashboard(savedDashboard)
                .user(mockUser)
                .build();
        Chart savedChart = chartRepo.save(mockChart);

        //Act
        Chart foundChart = chartRepo.findByChartName("ChartTest");

        //Assert
        Assertions.assertTrue(foundChart != null);
    }

    @Test
    public void Query_findByChartName_ReturnsNotFound() {
        //Arrange
        User mockUser = User.builder()
                .userName(MOCK_USER_NAME)
                .email(MOCK_USER_EMAIL)
                .password(MOCK_USER_PASS)
                .enabled(true)
                .build();
        userRepo.save(mockUser);

        Dashboard mockDashboard = Dashboard.builder()
                .name("DashboardTest")
                .user(mockUser)
                .build();
        Dashboard savedDashboard = dashboardRepo.save(mockDashboard);

        Chart mockChart = Chart.builder()
                .name("ChartTest")
                .dashboard(savedDashboard)
                .user(mockUser)
                .build();
        Chart savedChart = chartRepo.save(mockChart);

        //Act
        Chart foundChart = chartRepo.findByChartName("NonExistentChartName");

        //Assert
        Assertions.assertTrue(foundChart == null);
    }
}
