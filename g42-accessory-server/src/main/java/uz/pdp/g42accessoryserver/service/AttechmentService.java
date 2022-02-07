package uz.pdp.g42accessoryserver.service;

import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;
import uz.pdp.g42accessoryserver.entity.Attechment;
import uz.pdp.g42accessoryserver.entity.AttechmentContent;
import uz.pdp.g42accessoryserver.payload.ApiResponse;
import uz.pdp.g42accessoryserver.repository.AttechmentContentRepository;
import uz.pdp.g42accessoryserver.repository.AttechmentRepository;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Iterator;
import java.util.Optional;
import java.util.UUID;

@Service
public class AttechmentService {
    @Autowired
    AttechmentRepository attechmentRepository;
    @Autowired
    AttechmentContentRepository attechmentContentRepository;

    public ApiResponse uploadFileToDb(MultipartHttpServletRequest request) throws IOException {
        Iterator<String> fileNames = request.getFileNames();
        MultipartFile file = request.getFile(fileNames.next());
        if (file != null) {
            Attechment attechment = new Attechment();
            attechment.setOriginalName(file.getOriginalFilename());
            attechment.setContentType(file.getContentType());
            attechment.setSize(file.getSize());
            attechment = attechmentRepository.save(attechment);
            AttechmentContent attechmentContent = new AttechmentContent();
            attechmentContent.setAttechment(attechment);
            attechmentContent.setBytes(file.getBytes());
            attechmentContentRepository.save(attechmentContent);
            return new ApiResponse("OK!", true);
        }
        return new ApiResponse("ERROR!", false);
    }

    public ResponseEntity<byte[]> getFileFromDb(UUID attechmentId) throws IOException {
        Optional<Attechment> optionalAttechment = attechmentRepository.findById(attechmentId);
        if (optionalAttechment.isPresent()) {
            Attechment attechment = optionalAttechment.get();
            if (attechment.getPath()!=null){
                File file = new File(attechment.getPath());
                byte[] bytes = Files.readAllBytes(file.toPath());
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(attechment.getContentType()))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + attechment.getOriginalName() + "\"")
                        .body(bytes);
            }
            AttechmentContent attechmentContent = attechmentContentRepository.findByAttechment(attechment);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(attechment.getContentType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + attechment.getOriginalName() + "\"")
                    .body(attechmentContent.getBytes());
        }
        return null;
    }

    @SneakyThrows
    public ApiResponse uploadToSystem(MultipartHttpServletRequest request) {
        Iterator<String> fileNames = request.getFileNames();
        MultipartFile file = request.getFile(fileNames.next());
        if (file != null) {
            Attechment attechment = new Attechment();
            attechment.setOriginalName(file.getOriginalFilename());
            attechment.setContentType(file.getContentType());
            attechment.setSize(file.getSize());
            attechment = attechmentRepository.save(attechment);
            String[] split = file.getOriginalFilename().split("\\.");
            String name = UUID.randomUUID().toString() + "." + split[split.length-1];
            attechment.setFileName(name);
            Path path = Paths.get("E:\\PROJECTS\\g42-accessory\\g42-accessory-server\\src\\main\\resources\\files/" + name);
            Files.copy(file.getInputStream(), path);
            attechment.setPath(path.toString());
            attechmentRepository.save(attechment);
            return new ApiResponse("Ok", true);
        }
        return null;
    }
}
