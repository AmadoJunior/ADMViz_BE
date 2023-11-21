package com.adm.cruddemo.DTO;

public record ChartRecord(
        String name,
        String srcUrl,
        String dataKey,
        String labelKey,
        String chartType,
        String method,
        String apiKey,
        int fromDate,
        int toDate
) {
}
