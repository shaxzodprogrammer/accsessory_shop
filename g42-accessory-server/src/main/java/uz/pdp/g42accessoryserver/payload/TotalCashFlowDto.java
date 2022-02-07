package uz.pdp.g42accessoryserver.payload;

import lombok.Data;

import java.util.List;

@Data
public class TotalCashFlowDto {
    private List<WarehouseCashFlowDto> warehouseCashFlowDtos;
    private Double totalSum;
}
