package uz.pdp.g42accessoryserver.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import uz.pdp.g42accessoryserver.entity.User;
import uz.pdp.g42accessoryserver.payload.ApiResponse;
import uz.pdp.g42accessoryserver.secret.CurrentUser;
import uz.pdp.g42accessoryserver.service.DashboardService;
import uz.pdp.g42accessoryserver.utills.AppConst;

import java.util.UUID;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    DashboardService dashboardService;

    @GetMapping("/productCount")
    public HttpEntity<?> productCount(@RequestParam(value = "page",defaultValue = AppConst.PAGE_DEFAULT_NUMBER)Integer page,
                                      @RequestParam(value = "size",defaultValue = AppConst.PAGE_DEFAULT_SIZE)Integer size,
                                      @RequestParam(value = "productId",required = false) UUID productId){
        ApiResponse apiResponse = dashboardService.productCount(page,size,productId);
        return ResponseEntity.status(apiResponse.isSuccess()?200:409).body(apiResponse);
    }

    @PreAuthorize("hasRole('ROLE_DIRECTOR')")
    @GetMapping("/totalCashFlow")
    public HttpEntity<?> totalCashFlow() {
        return ResponseEntity.ok(dashboardService.totalCashFlow());
    }

}
