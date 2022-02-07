package uz.pdp.g42accessoryserver.payload.model;

import org.springframework.beans.factory.annotation.Value;

import java.util.UUID;

public interface PwaInterface {
    UUID getProductId();
    Integer getWarehouseId();
    String getProductName();
    Integer getProductAmount();

    @Value("#{@productWithAmountRepository.getProductCount(target.productId,target.warehouseId)}")
    int getProductCount();
}
