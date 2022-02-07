package uz.pdp.g42accessoryserver.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import uz.pdp.g42accessoryserver.payload.ApiResponse;
import uz.pdp.g42accessoryserver.service.AttechmentService;

import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/attechment")
public class AttechmentController {
    @Autowired
    AttechmentService attechmentService;

    @PostMapping("/uploadToDb")
    public ApiResponse uploadFileToDb(MultipartHttpServletRequest request) throws IOException {
        return attechmentService.uploadFileToDb(request);
    }

    @GetMapping("/getFileFromDb/{attechmentId}")
    public HttpEntity<?> getFileFromDb(@PathVariable UUID attechmentId) throws IOException {

        return attechmentService.getFileFromDb(attechmentId);

    }
    @PostMapping("/uploadToFileSystem")
    public ApiResponse uploadToFileSystem(MultipartHttpServletRequest request){
        return attechmentService.uploadToSystem(request);
    }




}
