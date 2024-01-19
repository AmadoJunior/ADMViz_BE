package com.adm.cruddemo.repository;

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
public class DashboardRepoTest {
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

        final int mockDashboardCount = 2;
        List<Dashboard> dashboardList = new ArrayList<>();
        for(int i = 0; i < mockDashboardCount; i++){
            Dashboard mockDashboard = Dashboard.builder()
                    .name("Dashboard" + String.valueOf(i))
                    .user(mockUser)
                    .build();

            Dashboard savedDashboard = dashboardRepo.save(mockDashboard);
            dashboardList.add(savedDashboard);
        }

        //Act
        Long dashboardCount = dashboardRepo.countByUserId(mockUser.getId());

        //Assert
        Assertions.assertEquals(dashboardCount, dashboardList.size());
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

        //Act
        Long dashboardCount = dashboardRepo.countByUserId(mockUser.getId());

        //Assert
        Assertions.assertEquals(dashboardCount, 0);
    }
}
