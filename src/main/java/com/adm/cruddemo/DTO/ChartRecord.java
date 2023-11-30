package com.adm.cruddemo.DTO;

public record ChartRecord(
        String name,
        String srcUrl,
        String dataKey,
        String labelKey,
        String chartType,
        String method,
        String apiKey,
        Long fromDate,
        Long toDate,
        ChartPositionRecord position
) {
}
