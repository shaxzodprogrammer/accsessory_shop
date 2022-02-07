package uz.pdp.g42accessoryserver.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.pdp.g42accessoryserver.entity.ProductWithAmount;
import uz.pdp.g42accessoryserver.entity.enums.RoleName;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DefectDto {
    private UUID id;
    private WarehouseDto warehouseDto;
    private boolean accepted;
    private UserDto createdBy;
    private double totalDefectSum;
    private Timestamp createdAt;
    private List<ProductWithAmountDto> productWithAmountDtos;

    public DefectDto(UUID id, WarehouseDto warehouseDto, boolean accepted) {
        this.id = id;
        this.warehouseDto = warehouseDto;
        this.accepted = accepted;
    }
}
