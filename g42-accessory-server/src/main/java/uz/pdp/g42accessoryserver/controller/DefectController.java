package uz.pdp.g42accessoryserver.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uz.pdp.g42accessoryserver.entity.User;
import uz.pdp.g42accessoryserver.payload.ApiResponse;
import uz.pdp.g42accessoryserver.payload.DefectDto;
import uz.pdp.g42accessoryserver.payload.RejectDto;
import uz.pdp.g42accessoryserver.secret.CurrentUser;
import uz.pdp.g42accessoryserver.service.DefectService;
import uz.pdp.g42accessoryserver.service.RejectService;
import uz.pdp.g42accessoryserver.utills.AppConst;

import java.util.Date;
import java.util.UUID;

@RestController
@RequestMapping("/api/defect")
public class DefectController {

    @Autowired
    private DefectService defectService;

    @PostMapping("/saveOrEdit")
    public HttpEntity<?> saveOrEdit(@RequestBody DefectDto dto, @CurrentUser User user) {
        ApiResponse response = defectService.saveOrEdit(dto,user);
        return ResponseEntity.status(response.isSuccess() ? response.getMessage().equals("Edited") ? 202 : 201 : 409).body(response);
    }

    @DeleteMapping("/remove/{id}")
    public HttpEntity<?> remove(@PathVariable UUID id,
                                @CurrentUser User user) {
        ApiResponse response = defectService.remove(id,user);
        return ResponseEntity.status(response.isSuccess() ? 200 : 409).body(response);
    }

    @GetMapping("/all")
    public HttpEntity<?> all(@RequestParam(value = "page", defaultValue = AppConst.PAGE_DEFAULT_NUMBER) Integer page,
                             @RequestParam(value = "size", defaultValue = AppConst.PAGE_DEFAULT_SIZE) Integer size,
                             @CurrentUser User user,
                             @RequestParam(value = "warehouseId",required = false)Integer warehouseId,
                             @RequestParam(value = "accepted",required = false)boolean accepted,
                             @RequestParam(value = "startDate", required = false)String startDate,
                             @RequestParam(value = "endDate", required = false)String endDate
                             ) throws IllegalAccessException {
        ApiResponse response = defectService.all(page, size,user,warehouseId,accepted, startDate, endDate);
        return ResponseEntity.status(response.isSuccess() ? 200 : 409).body(response);
    }

    @GetMapping("/accept/{id}")
    public HttpEntity<?> accept(@PathVariable UUID id,@CurrentUser User user){
        ApiResponse response = defectService.accept(id,user);
        return ResponseEntity.status(response.isSuccess() ? 200 : 409).body(response);
    }

}
