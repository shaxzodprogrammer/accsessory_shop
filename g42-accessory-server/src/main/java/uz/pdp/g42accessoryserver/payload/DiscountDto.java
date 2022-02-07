package uz.pdp.g42accessoryserver.payload;

import lombok.Data;
import uz.pdp.g42accessoryserver.entity.enums.DiscountType;

import java.util.UUID;

@Data
public class DiscountDto {
    private UUID id;
    private DiscountType discountType;

    private double amount;
}
