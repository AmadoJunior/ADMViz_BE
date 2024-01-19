package com.adm.cruddemo.service;

import com.adm.cruddemo.DTO.ChartPositionRecord;
import com.adm.cruddemo.DTO.ChartRecord;
import com.adm.cruddemo.DTO.DashboardRecord;
import com.adm.cruddemo.entity.Chart;
import com.adm.cruddemo.entity.Dashboard;
import com.adm.cruddemo.entity.User;
import com.adm.cruddemo.exception.AccessDeniedException;
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

import java.util.ArrayList;
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

    private User mockUser;
    private Dashboard mockDashboard;
    private Chart mockChart;
    private DashboardRecord dashboardRecord;
    private ChartRecord chartRecord;
    private ChartPositionRecord chartPositionRecord;
    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(dashboardService, "dashboardLimit", 2L);
        ReflectionTestUtils.setField(dashboardService, "chartLimit", 2L);

        mockUser = User.builder()
                .id(1L)
                .build();
        mockChart = Chart.builder()
                .id(1L)
                .name("mockChart")
                .build();
        mockDashboard = Dashboard.builder()
                .id(1L)
                .name("TestDashboard")
                .user(mockUser)
                .charts(new ArrayList<>())
                .build();
        mockDashboard.addChart(mockChart);

        dashboardRecord = new DashboardRecord("TestDashboard");
        chartPositionRecord = new ChartPositionRecord(0, 0, 50, 565);
        chartRecord = new ChartRecord("chartRecord","","","","","","","","","","",0L,0L, chartPositionRecord);
    }

    @AfterEach
    void tearDown() {
        Mockito.reset(userRepository);
    }

    @Test
    void createDashboard_Success() {
        //Arrange
        Long mockDashboardCount = 1L;

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
        assertEquals(returnedDashboard.getUser().getId(), mockUser.getId());
    }
    @Test
    void createDashboard_UserNotFound() {
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
    void deleteDashboard_Success() {
        //Arrange

        //Mock
        Mockito.when(dashboardRepo.findById(any(Long.class))).thenReturn(Optional.of(mockDashboard));

        //Assert + Action
        assertDoesNotThrow(() -> dashboardService.deleteDashboard(mockUser.getId(), mockDashboard.getId()));
    }
    @Test
    void deleteDashboard_DashboardNotFound() {
        //Arrange

        //Mock
        Mockito.when(dashboardRepo.findById(any(Long.class))).thenReturn(Optional.empty());

        //Assert + Action
        ResourceNotFoundException thrown = assertThrows(
                ResourceNotFoundException.class,
                () -> dashboardService.deleteDashboard(mockUser.getId(), mockDashboard.getId()));
        assertTrue(thrown.getMessage().contains("Dashboard Not Found"));
    }

    @Test
    void deleteDashboard_Unauthorized() {
        //Arrange
        User mockUser1 = User.builder()
                .id(2L)
                .build();

        //Mock
        Mockito.when(dashboardRepo.findById(mockDashboard.getId())).thenReturn(Optional.of(mockDashboard));

        //Action + Assert
        AccessDeniedException thrown = assertThrows(
                AccessDeniedException.class,
                () -> dashboardService.deleteDashboard(mockUser1.getId(), mockDashboard.getId()));
        assertTrue(thrown.getMessage().contains("Forbidden"));
    }

    @Test
    void updateDashboard_DashboardNotFound() {
        //Arrange

        //Mock
        Mockito.when(dashboardRepo.findById(any(Long.class))).thenReturn(Optional.empty());

        //Assert + Action
        ResourceNotFoundException thrown = assertThrows(
                ResourceNotFoundException.class,
                () -> dashboardService.updateDashboard(mockUser.getId(), mockDashboard.getId(), dashboardRecord));
        assertTrue(thrown.getMessage().contains("Dashboard Not Found"));
    }

    @Test
    void updateDashboard_Unauthorized() {
        //Arrange
        User mockUser1 = User.builder()
                .id(2L)
                .build();

        //Mock
        Mockito.when(dashboardRepo.findById(mockDashboard.getId())).thenReturn(Optional.of(mockDashboard));

        //Assert + Action
        AccessDeniedException thrown = assertThrows(
                AccessDeniedException.class,
                () -> dashboardService.updateDashboard(mockUser1.getId(), mockDashboard.getId(), dashboardRecord));
        assertTrue(thrown.getMessage().contains("Forbidden"));
    }
    @Test
    void updateDashboard_Success() {
        //Arrange
        DashboardRecord updatedRecord = new DashboardRecord("Updated");

        //Mock
        Mockito.when(dashboardRepo.findById(any(Long.class))).thenReturn(Optional.of(mockDashboard));
        Mockito.when(dashboardRepo.save(any(Dashboard.class))).thenAnswer(i -> i.getArguments()[0]);

        //Assert + Action
        assertDoesNotThrow(() -> dashboardService.updateDashboard(mockUser.getId(), mockDashboard.getId(), updatedRecord));

        Dashboard updatedDashboard = dashboardService.updateDashboard(mockUser.getId(), mockDashboard.getId(), updatedRecord);
        assertEquals(updatedDashboard.getName(), updatedRecord.name());
    }

    @Test
    void insertChart_UserNotFound() {
        Mockito.when(userRepository.findById(mockUser.getId())).thenReturn(Optional.empty());

        ResourceNotFoundException thrown = assertThrows(
                ResourceNotFoundException.class,
                () -> dashboardService.insertChart(mockUser.getId(), mockDashboard.getId(), chartRecord));
        assertTrue(thrown.getMessage().contains("User Not Found"));
    }
    @Test
    void insertChart_DashNotFound() {
        Mockito.when(userRepository.findById(mockUser.getId())).thenReturn(Optional.of(mockUser));
        Mockito.when(dashboardRepo.findById(mockDashboard.getId())).thenReturn(Optional.empty());

        ResourceNotFoundException thrown = assertThrows(
                ResourceNotFoundException.class,
                () -> dashboardService.insertChart(mockUser.getId(), mockDashboard.getId(), chartRecord));
        assertTrue(thrown.getMessage().contains("Dashboard Not Found"));
    }
    @Test
    void insertChart_ChatLimitReached() {
        Mockito.when(userRepository.findById(mockUser.getId())).thenReturn(Optional.of(mockUser));
        Mockito.when(dashboardRepo.findById(mockDashboard.getId())).thenReturn(Optional.of(mockDashboard));
        Mockito.when(chartRepo.countByDashboardId(mockDashboard.getId())).thenReturn(5L);

        TooManyResourcesException thrown = assertThrows(
                TooManyResourcesException.class,
                () -> dashboardService.insertChart(mockUser.getId(), mockDashboard.getId(), chartRecord));
        assertTrue(thrown.getMessage().contains("Too Many Charts"));
    }
    @Test
    void insertChart_Success() {
        Mockito.when(userRepository.findById(mockUser.getId())).thenReturn(Optional.of(mockUser));
        Mockito.when(dashboardRepo.findById(mockDashboard.getId())).thenReturn(Optional.of(mockDashboard));
        Mockito.when(chartRepo.countByDashboardId(mockDashboard.getId())).thenReturn(1L);
        Mockito.when(dashboardRepo.save(any(Dashboard.class))).thenAnswer(i -> i.getArguments()[0]);

        Dashboard returnedDashboard = dashboardService.insertChart(mockUser.getId(), mockDashboard.getId(), chartRecord);

        assertNotNull(returnedDashboard);
        assertFalse(returnedDashboard.getCharts().isEmpty());
    }


    @Test
    void removeChartFromDashboard_DashboardNotFound() {
        Mockito.when(dashboardRepo.findById(mockDashboard.getId())).thenReturn(Optional.empty());

        ResourceNotFoundException thrown = assertThrows(
                ResourceNotFoundException.class,
                () -> dashboardService.removeChartFromDashboard(mockUser.getId(), mockDashboard.getId(), mockChart.getId()));
        assertTrue(thrown.getMessage().contains("Dashboard Not Found"));
    }

    @Test
    void removeChartFromDashboard_Success() {
        Mockito.when(dashboardRepo.save(any(Dashboard.class))).thenAnswer(i -> i.getArguments()[0]);
        Mockito.when(dashboardRepo.findById(mockDashboard.getId())).thenReturn(Optional.of(mockDashboard));

        assertFalse(mockDashboard.getCharts().isEmpty());

        Dashboard returnedDashboard = dashboardService.removeChartFromDashboard(mockUser.getId(), mockDashboard.getId(), mockChart.getId());

        assertTrue(returnedDashboard.getCharts().isEmpty());
    }

    @Test
    void updateChartInDashboard_DashboardNotFound() {
        Mockito.when(dashboardRepo.findById(mockDashboard.getId())).thenReturn(Optional.empty());

        ResourceNotFoundException thrown = assertThrows(
                ResourceNotFoundException.class,
                () -> dashboardService.updateChartInDashboard(mockUser.getId(), mockDashboard.getId(), mockChart.getId(), chartRecord));
        assertTrue(thrown.getMessage().contains("Dashboard Not Found"));
    }
    @Test
    void updateChartInDashboard_ChartNotFound() {
        Mockito.when(dashboardRepo.findById(mockDashboard.getId())).thenReturn(Optional.of(mockDashboard));

        ResourceNotFoundException thrown = assertThrows(
                ResourceNotFoundException.class,
                () -> dashboardService.updateChartInDashboard(mockUser.getId(), mockDashboard.getId(), 2L, chartRecord));
        assertTrue(thrown.getMessage().contains("Chart Not Found"));
    }
    @Test
    void updateChartInDashboard_Success() {
        Mockito.when(dashboardRepo.save(any(Dashboard.class))).thenAnswer(i -> i.getArguments()[0]);
        Mockito.when(dashboardRepo.findById(mockDashboard.getId())).thenReturn(Optional.of(mockDashboard));

        assertFalse(mockDashboard.getCharts().stream().parallel()
                .anyMatch((chart -> chart.getName().equals(chartRecord.name()))));
        Dashboard returnedDashboard = dashboardService.updateChartInDashboard(mockUser.getId(), mockDashboard.getId(), mockChart.getId(), chartRecord);
        assertTrue(returnedDashboard.getCharts().stream().parallel()
                .anyMatch((chart -> chart.getName().equals(chartRecord.name()))));
    }

    @Test
    void updateChartPosition_DashboardNotFound() {
        Mockito.when(dashboardRepo.findById(mockDashboard.getId())).thenReturn(Optional.empty());

        ResourceNotFoundException thrown = assertThrows(
                ResourceNotFoundException.class,
                () -> dashboardService.updateChartPosition(mockUser.getId(), mockDashboard.getId(), mockChart.getId(), chartPositionRecord));
        assertTrue(thrown.getMessage().contains("Dashboard Not Found"));
    }
    @Test
    void updateChartPosition_ChartNotFound() {
        Mockito.when(dashboardRepo.findById(mockDashboard.getId())).thenReturn(Optional.of(mockDashboard));

        ResourceNotFoundException thrown = assertThrows(
                ResourceNotFoundException.class,
                () -> dashboardService.updateChartPosition(mockUser.getId(), mockDashboard.getId(), 2L, chartPositionRecord));
        assertTrue(thrown.getMessage().contains("Chart Not Found"));
    }
    @Test
    void updateChartPosition_Success() {
        Mockito.when(dashboardRepo.save(any(Dashboard.class))).thenAnswer(i -> i.getArguments()[0]);
        Mockito.when(dashboardRepo.findById(mockDashboard.getId())).thenReturn(Optional.of(mockDashboard));

        assertTrue(mockDashboard.getCharts().stream().parallel()
                .anyMatch((chart -> chart.getPosition() == null)));
        Dashboard returnedDashboard = dashboardService.updateChartPosition(mockUser.getId(), mockDashboard.getId(), mockChart.getId(), chartPositionRecord);
        assertFalse(returnedDashboard.getCharts().stream().parallel()
                .anyMatch((chart ->  chart.getPosition() == null)));
    }
}
