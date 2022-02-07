package uz.pdp.g42accessoryserver.payload.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.internal.build.AllowSysOut;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductCountDto {
    private UUID productId;
    private String productName;
    private List<WarehouseProductCount> warehouseProductCounts;
}
