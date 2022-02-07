package uz.pdp.g42accessoryserver.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductWithAmountDto {
    private UUID id;
    private ProductDto productDto;
    private int amount;
    private double realSoldPrice;
}
