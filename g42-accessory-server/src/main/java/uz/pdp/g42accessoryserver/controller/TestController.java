package uz.pdp.g42accessoryserver.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import uz.pdp.g42accessoryserver.repository.RoleRepository;

import java.util.UUID;

@RestController
@RequestMapping("/test")
public class TestController {

    @Autowired
    RoleRepository roleRepository;

    @GetMapping("/{transferId}")
    public HttpEntity<?> sdfsd(@PathVariable UUID transferId){
        return ResponseEntity.ok(roleRepository.lflfl(transferId));
    }
}
