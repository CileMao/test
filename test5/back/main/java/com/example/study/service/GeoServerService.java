package com.example.study.service;
import org.springframework.stereotype.Service;

@Service
public class GeoServerService {

    private static final String GEOSERVER_BASE_URL = "http://localhost:8080/geoserver";
    private static final String WORKSPACE = "test";  // 如实验四发布服务的工作区
    private static final String LAYER_GROUP = "福建省土壤有机质专题图";  // 实验二发布的图层组
    private static final String LAYER_POTASSIUM = "福建省土壤速效钾专题图";

    // 获取专题图 WMS 服务 URL（示例：土壤酸化专题图 ）
    public String getAcidSoilWmsUrl() {
        return GEOSERVER_BASE_URL + "/" + WORKSPACE + "/wms?service=WMS&version=1.1.0&request=GetMap"
                + "&layers=" + WORKSPACE + "%3A" + LAYER_GROUP
                + "&bbox=383568.375%2C2603619.0%2C882345.5625%2C3135232.25"
                + "&width=720&height=768"
                + "&srs=EPSG%3A2436"
                + "&styles=acid_soil_style"
                + "&format=image/png";
    }

    // 获取其他专题图（如土壤有机质 ）WMS URL ，类似上面方法
    public String getOrganicMatterWmsUrl() {

        return GEOSERVER_BASE_URL + "/" + WORKSPACE + "/wms?service=WMS&version=1.1.0&request=GetMap"
                + "&layers=" + WORKSPACE + "%3A" + LAYER_POTASSIUM
                + "&bbox=378717.8105219478%2C2598640.125341792%2C898132.9710795982%2C3141402.3482612646"
                + "&width=734&height=768"
                + "&srs=EPSG%3A2436"
                + "&styles=potassium_style"
                + "&format=image/png";
    }
}