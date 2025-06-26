package com.example.study.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class SoilQueryService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Map<String, Object>> queryAcidSoilStats(double threshold) {
        String sql = "SELECT "
                + "COUNT(*) AS plot_count, "
                + "SUM(ST_Area(geom)) AS total_area, "
                + "AVG(soil_acid) AS avg_acidity "
                + "FROM xianqu WHERE soil_acid < ?";
        return jdbcTemplate.queryForList(sql, threshold);
    }

    public String queryAcidSoilArea(double threshold) {

        String sql = "SELECT ST_Area(geom) AS area FROM xianqu WHERE soil_acid < ?";
        return jdbcTemplate.queryForList(sql, threshold).toString();
    }

    public String queryAcidSoilAreaInBounds(double threshold, double minX, double minY, double maxX, double maxY) {
        String sql = "SELECT ST_Area(geom) AS area FROM xianqu WHERE soil_acid < ? AND ST_Intersects(geom, ST_MakeEnvelope(?, ?, ?, ?, 2436))";
        return jdbcTemplate.queryForList(sql, threshold, minX, minY, maxX, maxY).toString();
    }

    public String querySoilPH(Double minX, Double minY, Double maxX, Double maxY) {
        String sql = "SELECT ph_value FROM soil_properties";
        return jdbcTemplate.queryForList(sql).toString();
    }
}