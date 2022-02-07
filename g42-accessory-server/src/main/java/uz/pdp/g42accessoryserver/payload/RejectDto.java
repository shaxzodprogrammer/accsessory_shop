package uz.pdp.g42accessoryserver.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.pdp.g42accessoryserver.entity.Defect;
import uz.pdp.g42accessoryserver.entity.Trade;

import javax.persistence.ManyToOne;
import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RejectDto {
    private UUID id;
    private double rejectTotalSum;
    private List<ProductWithAmountDto> productWithAmountDtos;
    private boolean accepted;
    private Timestamp createdAt;
    private WarehouseDto warehouseDto;
    private UserDto seller;
    private UserDto manager;

    public RejectDto(UUID id, double rejectTotalSum) {
        this.id = id;
        this.rejectTotalSum = rejectTotalSum;
    }

    public RejectDto(UUID id, double rejectTotalSum, List<ProductWithAmountDto> productWithAmountDtos, boolean accepted, Timestamp createdAt, WarehouseDto warehouseDto) {
        this.id = id;
        this.rejectTotalSum = rejectTotalSum;
        this.productWithAmountDtos = productWithAmountDtos;
        this.accepted = accepted;
        this.createdAt = createdAt;
        this.warehouseDto = warehouseDto;
    }
}
