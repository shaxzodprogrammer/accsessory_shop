package uz.pdp.g42accessoryserver.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uz.pdp.g42accessoryserver.entity.User;
import uz.pdp.g42accessoryserver.entity.enums.ReportStatus;
import uz.pdp.g42accessoryserver.payload.ApiResponse;
import uz.pdp.g42accessoryserver.secret.CurrentUser;
import uz.pdp.g42accessoryserver.service.ReportService;
import uz.pdp.g42accessoryserver.utills.AppConst;

import java.util.UUID;

@RestController
@RequestMapping("/api/report")
public class ReportController {

    @Autowired
    ReportService reportService;

    @GetMapping("/getAllReportByStatus")
    public HttpEntity<?> getAllReportByStatus(@RequestParam ReportStatus status,
                                @RequestParam(value = "page", defaultValue = AppConst.PAGE_DEFAULT_NUMBER) Integer page,
                                @RequestParam(value = "size", defaultValue = AppConst.PAGE_DEFAULT_SIZE) Integer size,
                                              @CurrentUser User user,
                                              @RequestParam(value = "startDate", required = false)String startDate,
                                              @RequestParam(value = "endDate", required = false)String endDate,
                                              @RequestParam(value = "shopId",required = false)Integer shopId
                                              ) throws IllegalAccessException {
        ApiResponse response = reportService.getAllReportByStatus(status,page,size,user,startDate,endDate,shopId);
        return ResponseEntity.status(response.isSuccess()?200:409).body(response);
    }

    @PreAuthorize("hasAnyRole({'ROLE_MANAGER','ROLE_DIRECTOR'})")
    @PutMapping("/accept/{id}")
    public HttpEntity<?> update(@PathVariable UUID id,
                                @CurrentUser User user){
        ApiResponse response = reportService.acceptReport(id,user);
        return ResponseEntity.status(response.isSuccess()?200:409).body(response);
    }

}
