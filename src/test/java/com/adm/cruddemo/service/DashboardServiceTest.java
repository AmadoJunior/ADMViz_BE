package com.adm.cruddemo.service;

import com.adm.cruddemo.DTO.DashboardRecord;
import com.adm.cruddemo.entity.Dashboard;
import com.adm.cruddemo.entity.User;
import com.adm.cruddemo.exception.ResourceNotFoundException;
import com.adm.cruddemo.exception.TooManyResourcesException;
import com.adm.cruddemo.repository.ChartPositionRepo;
import com.adm.cruddemo.repository.ChartRepo;
import com.adm.cruddemo.repository.DashboardRepo;
import com.adm.cruddemo.repository.UserRepo;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
@ActiveProfiles("test")
@ExtendWith(MockitoExtension.class)
public class DashboardServiceTest {
    @Mock
    private UserRepo userRepository;
    @Mock
    private DashboardRepo dashboardRepo;
    @Mock
    private ChartRepo chartRepo;
    @Mock
    private ChartPositionRepo chartPositionRepo;
    @Mock
    private RedisTemplate redisTemplate;

    @InjectMocks
    private DashboardService dashboardService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(dashboardService, "dashboardLimit", 2L);
        ReflectionTestUtils.setField(dashboardService, "chartLimit", 2L);
    }

    @AfterEach
    void tearDown() {
        Mockito.reset(userRepository);
    }

    @Test
    void createDashboard_Success() {
        //Arrange
        Long mockDashboardCount = 1L;
        Long mockUserId = 3L;
        User mockUser = User.builder()
                .id(mockUserId)
                .build();

        String mockDashboardName = "TestDashboard";
        DashboardRecord dashboardRecord = new DashboardRecord(mockDashboardName);


        //Mock
        Mockito.when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);
        Mockito.when(dashboardRepo.save(any(Dashboard.class))).thenAnswer(i -> i.getArguments()[0]);

        Mockito.when(userRepository.findById(mockUser.getId())).thenReturn(Optional.of(mockUser));
        Mockito.when(dashboardRepo.countByUserId(mockUser.getId())).thenReturn(mockDashboardCount);

        //Action
        Dashboard returnedDashboard = dashboardService.createDashboard(mockUser.getId(), dashboardRecord);

        assertNotNull(returnedDashboard);
        assertEquals(returnedDashboard.getName(), mockDashboardName);
        assertEquals(returnedDashboard.getUser().getId(), mockUserId);
    }
    @Test
    void createDashboard_UserNotFound() {
        //Arrange
        Long mockDashboardCount = 1L;
        Long mockUserId = 3L;
        User mockUser = User.builder()
                .id(mockUserId)
                .build();

        String mockDashboardName = "TestDashboard";
        DashboardRecord dashboardRecord = new DashboardRecord(mockDashboardName);


        //Mock
        Mockito.when(userRepository.findById(mockUser.getId())).thenReturn(Optional.empty());

        //Action
        ResourceNotFoundException thrown = assertThrows(
                ResourceNotFoundException.class,
                () -> dashboardService.createDashboard(mockUser.getId(), dashboardRecord));
        assertTrue(thrown.getMessage().contains("User Not Found"));
    }
    @Test
    void createDashboard_DashboardLimitReached() {
        //Arrange
        Long mockDashboardCount = 3L;
        Long mockUserId = 3L;
        User mockUser = User.builder()
                .id(mockUserId)
                .build();

        String mockDashboardName = "TestDashboard";
        DashboardRecord dashboardRecord = new DashboardRecord(mockDashboardName);

        //Mock
        Mockito.when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);

        Mockito.when(userRepository.findById(mockUser.getId())).thenReturn(Optional.of(mockUser));
        Mockito.when(dashboardRepo.countByUserId(mockUser.getId())).thenReturn(mockDashboardCount);

        //Action
        TooManyResourcesException thrown = assertThrows(
                TooManyResourcesException.class,
                () -> dashboardService.createDashboard(mockUser.getId(), dashboardRecord));
        assertTrue(thrown.getMessage().contains("Too Many Dashboards"));
    }

    @Test
    void deleteDashboard() {

    }

    @Test
    void updateDashboard() {

    }

    @Test
    void insertChart() {

    }

    @Test
    void removeChartFromDashboard() {

    }

    @Test
    void updateChartInDashboard() {

    }

    @Test
    void updateChartPosition() {

    }
}
