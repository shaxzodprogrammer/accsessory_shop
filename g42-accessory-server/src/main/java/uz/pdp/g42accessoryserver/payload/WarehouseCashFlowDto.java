package uz.pdp.g42accessoryserver.payload;

import lombok.Data;

@Data
public class WarehouseCashFlowDto {
    private WarehouseDto warehouseDto;
    private Double totalSum;
}
