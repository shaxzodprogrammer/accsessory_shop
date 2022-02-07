package uz.pdp.g42accessoryserver.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import uz.pdp.g42accessoryserver.entity.Category;
import uz.pdp.g42accessoryserver.payload.ApiResponse;
import uz.pdp.g42accessoryserver.payload.ProductDto;
import uz.pdp.g42accessoryserver.service.ProductService;
import uz.pdp.g42accessoryserver.utills.AppConst;

import java.util.UUID;

@RestController
@RequestMapping("/api/product")
@CrossOrigin
public class ProductController {
    @Autowired
    ProductService productService;

    @PostMapping("/addProduct")
    @PreAuthorize("hasRole('ROLE_DIRECTOR')")
    public HttpEntity<?> addProduct(@RequestBody ProductDto dto){
        ApiResponse response = productService.saveProduct(dto);
        return ResponseEntity.status(response.isSuccess()?201:409).body(response);
    }

    @PostMapping("/editProduct")
    @PreAuthorize("hasRole('ROLE_DIRECTOR')")
    public HttpEntity<?> editProduct(@RequestBody ProductDto dto){
        ApiResponse response = productService.editProduct(dto);
        return ResponseEntity.status(response.isSuccess()?202:409).body(response);
    }

    @GetMapping("/changeActive/{id}")
    @PreAuthorize("hasRole('ROLE_DIRECTOR')")
    public HttpEntity<?> changeActive(@PathVariable(value = "id") UUID id){
        ApiResponse response = productService.changeActive(id);
        return ResponseEntity.status(response.isSuccess()?200:409).body(response);
    }

    @GetMapping("/remove/{id}")
    @PreAuthorize("hasRole('ROLE_DIRECTOR')")
    public HttpEntity<?> remove(@PathVariable(value = "id") UUID id){
        ApiResponse response = productService.remove(id);
        return ResponseEntity.status(response.isSuccess()?200:409).body(response);
    }

    @PreAuthorize("hasAnyRole('ROLE_DIRECTOR','ROLE_MANAGER')")
    @GetMapping("/all")
    public HttpEntity<?> all(@RequestParam(value = "page",defaultValue = AppConst.PAGE_DEFAULT_NUMBER)Integer page,
                             @RequestParam(value = "size",defaultValue = AppConst.PAGE_DEFAULT_SIZE)Integer size) throws IllegalAccessException {
        ApiResponse response = productService.all(page,size);
        return ResponseEntity.status(response.isSuccess()?200:409).body(response);
    }

    @GetMapping("/filter")
    public HttpEntity<?> filter(@RequestBody Category category,
                                @RequestParam double salePrice1, @RequestParam double salePrice2,
                                @RequestParam(value = "page",defaultValue = AppConst.PAGE_DEFAULT_NUMBER)Integer page,
                                @RequestParam(value = "size",defaultValue = AppConst.PAGE_DEFAULT_SIZE)Integer size){
        ApiResponse apiResponse = productService.filter(salePrice1, salePrice2, category, page, size);
        return ResponseEntity.status(apiResponse.isSuccess()?200:409).body(apiResponse);
    }

    @GetMapping("/search/{id}")
    public HttpEntity<?> search(@PathVariable String id){
       return ResponseEntity.ok(productService.search(id));
    }
}
