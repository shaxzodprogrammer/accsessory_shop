package uz.pdp.g42accessoryserver.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import uz.pdp.g42accessoryserver.entity.Category;
import uz.pdp.g42accessoryserver.payload.ApiResponse;
import uz.pdp.g42accessoryserver.payload.ResToken;
import uz.pdp.g42accessoryserver.payload.SignIn;
import uz.pdp.g42accessoryserver.repository.CategoryRepository;
import uz.pdp.g42accessoryserver.service.AuthService;

@RestController
@Controller
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {
    @Autowired
    AuthService authService;

    @Autowired
    CategoryRepository categoryRepository;

    @PostMapping("/login")
    public HttpEntity<?> login(@RequestBody SignIn signIn){
        ResToken resToken=authService.signIn(signIn);
        return ResponseEntity.status(resToken!=null?200:401).body(resToken);
    }



    @GetMapping("/searchUser/{search}")
    public HttpEntity<?> searchUser(@PathVariable String search){
        return ResponseEntity.ok(authService.searchUser(search));
    }
    @GetMapping("/all")
    public HttpEntity<?> searchUser(){
        return ResponseEntity.ok(authService.all());
    }


    @GetMapping("/testGet")
    public HttpEntity<?> testGet(){
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @GetMapping("/testInsert")
    public HttpEntity<?> testInsert(){
        Category category = new Category();
        category.setName("Test Insert From G47new User");
        category.setActive(true);
        categoryRepository.save(category);
        return ResponseEntity.ok("Saved");
    }
}
