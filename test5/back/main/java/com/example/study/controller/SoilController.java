package com.example.study.controller;
import com.example.study.service.GeoServerService;
import com.example.study.service.SoilQueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/soil")
public class SoilController {

    @Autowired
    private GeoServerService geoServerService;
    @Autowired
    private SoilQueryService soilQueryService;

    // 新增自定义 API：查询指定阈值下的酸化土壤统计信息
    @GetMapping("/acid-stats")
    public List<Map<String, Object>> getAcidSoilStats(@RequestParam double threshold) {
        return soilQueryService.queryAcidSoilStats(threshold);
    }

    // 新增自定义 API：查询指定阈值下的酸化土壤面积
    @GetMapping("/acid-area")
    public String getAcidSoilArea(@RequestParam double threshold) {
        return soilQueryService.queryAcidSoilArea(threshold);
    }

    /*@GetMapping("/wms/potassium")
    public String getPotassiumWmsUrl() {
        return geoServerService.getOrganicMatterWmsUrl();
    }

    @GetMapping("/wms/organic")
    public String getOrganicMatterWmsUrl() {
        return geoServerService.getOrganicMatterWmsUrl();
    }*/

    @GetMapping("/properties/ph")
    public String getSoilPH(
            @RequestParam(required = false) Double minX,
            @RequestParam(required = false) Double minY,
            @RequestParam(required = false) Double maxX,
            @RequestParam(required = false) Double maxY) {

        if (minX != null && minY != null && maxX != null && maxY != null) {
            return soilQueryService.querySoilPH(minX, minY, maxX, maxY);
        }
        return soilQueryService.querySoilPH(minX, minY, maxX, maxY);
    }
}