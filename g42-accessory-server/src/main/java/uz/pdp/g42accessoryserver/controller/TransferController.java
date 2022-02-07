package uz.pdp.g42accessoryserver.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uz.pdp.g42accessoryserver.entity.User;
import uz.pdp.g42accessoryserver.payload.ApiResponse;
import uz.pdp.g42accessoryserver.payload.TransferDto;
import uz.pdp.g42accessoryserver.secret.CurrentUser;
import uz.pdp.g42accessoryserver.service.TransferService;
import uz.pdp.g42accessoryserver.utills.AppConst;

import java.util.UUID;

@RestController
@RequestMapping("/api/transfer")
public class TransferController {
    @Autowired
    TransferService transferService;

    @PostMapping("/saveOrEdit")
    public HttpEntity<?> saveOrEdit(@RequestBody TransferDto transferDto,@CurrentUser User user){
        ApiResponse response = transferService.saveOrEdit(transferDto,user);
        return ResponseEntity.status(response.isSuccess()?response.getMessage().equals("Saved")?201:202:409).body(response);
    }

    @GetMapping("/all")
    public HttpEntity<?> all(
            @RequestParam(value = "page",defaultValue = AppConst.PAGE_DEFAULT_NUMBER) Integer page,
            @RequestParam(value = "size",defaultValue = AppConst.PAGE_DEFAULT_SIZE) Integer size,
            @RequestParam boolean accepted,
            @RequestParam boolean income,
            @CurrentUser User user,
            @RequestParam Integer fromWarehouseId,
            @RequestParam Integer toWarehouseId,
            @RequestParam(value = "startDate", required = false)String startDate,
            @RequestParam(value = "endDate", required = false)String endDate
            ){
       return ResponseEntity.ok(transferService.all(page,size,accepted,income,user,fromWarehouseId,toWarehouseId,startDate,endDate));
    }

    @GetMapping("/accept/{id}")
    public HttpEntity<?> accept(@PathVariable UUID id,@CurrentUser User user){
        ApiResponse response = transferService.acceptTransfer(id, user);
        return ResponseEntity.status(response.isSuccess()?200:409).body(response);
    }

    @GetMapping("/remove/{id}")
    public HttpEntity<?> remove(@PathVariable UUID id,@CurrentUser User user){
        ApiResponse response = transferService.remove(id,user);
        return ResponseEntity.status(response.isSuccess()?200:409).body(response);
    }

    @GetMapping("/countProductByWarehouse")
    public HttpEntity<?> countProductByWarehouse(@RequestParam UUID prodId,@RequestParam Integer warehouseId,@CurrentUser User user){
        ApiResponse response = transferService.countProductByWarehouse(warehouseId,prodId,user);
        return ResponseEntity.status(response.isSuccess()?200:409).body(response);
    }
}
