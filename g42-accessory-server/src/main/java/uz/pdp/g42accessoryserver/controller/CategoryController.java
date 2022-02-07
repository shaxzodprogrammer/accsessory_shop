package uz.pdp.g42accessoryserver.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uz.pdp.g42accessoryserver.payload.ApiResponse;
import uz.pdp.g42accessoryserver.payload.CategoryDto;
import uz.pdp.g42accessoryserver.payload.ShopDto;
import uz.pdp.g42accessoryserver.service.CategoryService;
import uz.pdp.g42accessoryserver.utills.AppConst;

@RestController
@RequestMapping("api/category")
@CrossOrigin
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @GetMapping("/all")
    public HttpEntity<?> all(@RequestParam(value = "page", defaultValue = AppConst.PAGE_DEFAULT_NUMBER) Integer page,
                             @RequestParam(value = "size", defaultValue = AppConst.PAGE_DEFAULT_SIZE) Integer size) throws IllegalAccessException {
        ApiResponse apiResponse = categoryService.all(page, size);
        return ResponseEntity.status(apiResponse.isSuccess() ? 200 : 409).body(apiResponse);
    }

    @PreAuthorize("hasRole({'ROLE_DIRECTOR'})")
    @PostMapping("/saveOrEdit")
    public HttpEntity<?> saveOrEdit(@RequestBody CategoryDto dto) {
        ApiResponse response = categoryService.saveOrEdit(dto);
        return ResponseEntity.status(response.isSuccess() ? response.getMessage().equals("Edited") ? 202 : 201 : 409).body(response);
    }

    @PreAuthorize("hasRole({'ROLE_DIRECTOR'})")
    @GetMapping("/remove/{id}")
    public HttpEntity<?> remove(@PathVariable Integer id) {
        ApiResponse response = categoryService.remove(id);
        return ResponseEntity.status(response.isSuccess()?200:409).body(response);
    }


}
