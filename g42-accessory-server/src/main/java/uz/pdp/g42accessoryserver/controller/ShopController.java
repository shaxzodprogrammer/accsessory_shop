package uz.pdp.g42accessoryserver.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uz.pdp.g42accessoryserver.payload.ApiResponse;
import uz.pdp.g42accessoryserver.payload.ShopDto;
import uz.pdp.g42accessoryserver.service.ShopService;
import uz.pdp.g42accessoryserver.utills.AppConst;

import java.util.UUID;

@RestController
@RequestMapping("/api/shop")
@CrossOrigin
public class ShopController {

    @Autowired
    private ShopService shopService;

//    public ShopController(ShopService shopService) {
//        this.shopService = shopService;
//    }

//    public static void setShopService(ShopService shopService) {
//        ShopController.shopService = shopService;
//    }

//    @PreAuthorize("hasRole({'ROLE_DIRECTOR'})")
    @PostMapping("/saveOrEdit")
    public HttpEntity<?> saveOrEdit(@RequestBody ShopDto dto) {
        ApiResponse response = shopService.saveOrEdit(dto);
        return ResponseEntity.status(response.isSuccess() ?
                response.getMessage().equals("Edited") ? 202 : 201 : 409).body(response);
    }

    @PreAuthorize("hasRole({'ROLE_DIRECTOR'})")
    @DeleteMapping("/remove/{id}")
    public HttpEntity<?> remove(@PathVariable Integer id) {
        ApiResponse response = shopService.remove(id);
        return ResponseEntity.status(response.isSuccess()?200:409).body(response);
    }

    @GetMapping("/all")
    public HttpEntity<?> all(@RequestParam(value = "page",
                                     defaultValue = AppConst.PAGE_DEFAULT_NUMBER) Integer page,
                             @RequestParam(value = "size",
                                     defaultValue = AppConst.PAGE_DEFAULT_SIZE) Integer size)
            throws IllegalAccessException {

        ApiResponse response = shopService.all(page, size);
        return ResponseEntity.status(response.isSuccess() ? 200 : 409).body(response);
    }

    @PreAuthorize("hasRole({'ROLE_DIRECTOR'})")
    @GetMapping("/changeActive/{id}")
    public HttpEntity<?> changeActive(@PathVariable Integer id){
        ApiResponse response = shopService.changeActive(id);
        return ResponseEntity.status(response.isSuccess()?200:409).body(response);
    }
}
