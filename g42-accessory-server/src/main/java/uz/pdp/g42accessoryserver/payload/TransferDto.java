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
public class TransferDto {
    private UUID id;
    private Timestamp createdAt;
    private UserDto createdBy;
    private WarehouseDto fromWarehouseDto;
    private WarehouseDto toWarehouseDto;
    private boolean accepted;
    private List<ProductWithAmountDto> productWithAmountDtos;

}
