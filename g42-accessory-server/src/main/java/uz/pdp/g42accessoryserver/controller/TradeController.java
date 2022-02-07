package uz.pdp.g42accessoryserver.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uz.pdp.g42accessoryserver.entity.User;
import uz.pdp.g42accessoryserver.payload.ApiResponse;
import uz.pdp.g42accessoryserver.payload.TradeDto;
import uz.pdp.g42accessoryserver.secret.CurrentUser;
import uz.pdp.g42accessoryserver.service.TradeService;

import java.util.UUID;

@RestController
@RequestMapping("/api/trade")
public class TradeController {
    @Autowired
    TradeService tradeService;

    @PostMapping("/saveOrEdit")
    public HttpEntity<?> saveOrEdit(@RequestBody TradeDto tradeDto, @CurrentUser User user){
        ApiResponse response = tradeService.saveOrEdit(tradeDto, user);
        return ResponseEntity.status(response.isSuccess()?response.getMessage().equals("Saved")?201:202:409).body(response);
    }
    @GetMapping("/getAllByDraftReport")
    public HttpEntity<?> getAllByDraftReport(@CurrentUser User user){
        ApiResponse response = tradeService.getAllByDraftReport(user);
        return ResponseEntity.status(response.isSuccess()?200:409).body(response);
    }

    @DeleteMapping("/remove/{id}")
    public HttpEntity<?> remove(@PathVariable UUID id){
        ApiResponse response = tradeService.remove(id);
        return ResponseEntity.status(response.isSuccess()?200:409).body(response);
    }

    @GetMapping("/closeDay/{id}")
    public HttpEntity<?> closeDay(@PathVariable UUID id){
        ApiResponse apiResponse = tradeService.closeDay(id);
        return ResponseEntity.status(apiResponse.isSuccess()?200:409).body(apiResponse);
    }

}
