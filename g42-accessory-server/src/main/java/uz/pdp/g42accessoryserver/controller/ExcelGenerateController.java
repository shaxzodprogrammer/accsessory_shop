package uz.pdp.g42accessoryserver.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uz.pdp.g42accessoryserver.service.ExcelService;

import java.security.PublicKey;

@RestController
@RequestMapping("/api/excel")
public class ExcelGenerateController {

    @Autowired
    ExcelService excelService;

    @GetMapping("/productCountByWarehouse")
    public HttpEntity<?> productCountByWarehouse(){
       return excelService.getProductCountByWarehouse();
    }
}
