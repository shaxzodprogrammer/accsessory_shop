package uz.pdp.g42accessoryserver.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uz.pdp.g42accessoryserver.payload.ApiResponse;
import uz.pdp.g42accessoryserver.payload.WarehouseDto;
import uz.pdp.g42accessoryserver.service.WarehouseService;
import uz.pdp.g42accessoryserver.utills.AppConst;

@RestController
@RequestMapping("/api/warehouse")
@CrossOrigin
public class WarehouseController {

    @Autowired
    WarehouseService warehouseService;

    @PreAuthorize("hasRole('ROLE_DIRECTOR')")
    @PostMapping("/saveOrEdit")
    public HttpEntity<?> saveOrEdit(@RequestBody WarehouseDto whdto) {
        ApiResponse apiResponse = warehouseService.saveOrEdit(whdto);
        return ResponseEntity.status(apiResponse.isSuccess() ?
                apiResponse.getMessage().equals("Edited") ? 202 : 201 : 409)
                .body(apiResponse);
    }

    @GetMapping("/all")
    public HttpEntity<?> all(
            @RequestParam(value = "page", defaultValue = AppConst.PAGE_DEFAULT_NUMBER) Integer page,
            @RequestParam(value = "size", defaultValue = AppConst.PAGE_DEFAULT_SIZE) Integer size
    ) {
        ApiResponse all = warehouseService.all(page, size);
        return ResponseEntity.status(all.isSuccess() ? 200 : 409).body(all);
    }

    @GetMapping("/allAll")
    public HttpEntity<?> allAll() {
        return ResponseEntity.ok(warehouseService.allAll());
    }


    @PreAuthorize("hasRole('ROLE_DIRECTOR')")
    @GetMapping("/changeActive/{id}")
    public HttpEntity<?> changeActive(@PathVariable("id") Integer id) {
        ApiResponse apiResponse = warehouseService.changeActive(id);
        return ResponseEntity.status(apiResponse.isSuccess() ? 200 : 409).body(apiResponse);
    }


    @PreAuthorize("hasRole('ROLE_DIRECTOR')")
    @GetMapping("/remove/{id}")
    public HttpEntity<?> remove(@PathVariable("id") Integer id) {
        ApiResponse apiResponse = warehouseService.remove(id);
        return ResponseEntity.status(apiResponse.isSuccess() ? 200 : 409).body(apiResponse);
    }
}
