package com.adm.cruddemo.DTO;

public record ChartRecord(
        String name,
        String srcUrl,
        String dataKey,
        String labelKey,
        String chartType,
        String method,
        String select,
        String where,
        String group,
        String limit,
        Long fromDate,
        Long toDate,
        ChartPositionRecord position
) {
}
