package com.adm.cruddemo.projections;

import com.adm.cruddemo.entity.Chart;
import com.adm.cruddemo.entity.ChartPosition;
import org.springframework.data.rest.core.config.Projection;

@Projection(name = "withPosition", types = { Chart.class })
public interface ChartProjection {
    // Define getters for fields you want to expose
    int getId();
    String getName();
    String getSrcUrl();
    String getDataKey();
    String getLabelKey();
    String getChartType();
    String getMethod();
    String getApiKey();
    String getToDate();
    String getFromDate();
    // Include getter for the position field
    ChartPosition getPosition();
}