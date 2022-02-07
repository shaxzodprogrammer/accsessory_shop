package uz.pdp.g42accessoryserver.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TradeDto {
    private UUID id;
    private Timestamp createdAt;
    private ShopDto shopDto;
    private UserDto sellerDto;
    private double totalSum;
    private double totalIncomeSum;
    private double afterDiscountTotalSum;
    private List<ProductWithAmountDto> productWithAmountDtos;
    private DiscountDto discountDto;
}
