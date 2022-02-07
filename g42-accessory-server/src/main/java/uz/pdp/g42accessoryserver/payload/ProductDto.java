package uz.pdp.g42accessoryserver.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.pdp.g42accessoryserver.entity.Category;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductDto {
    private UUID id;
    private UUID value;
    private CategoryDto categoryDto;
    private String name;
    private String label;
    private double incomePrice;
    private double salePrice;
    private int norma;
    private boolean active;

    public ProductDto(UUID id, CategoryDto categoryDto, String name, double incomePrice, double salePrice, int norma, boolean active) {
        this.id = id;
        this.categoryDto = categoryDto;
        this.name = name;
        this.incomePrice = incomePrice;
        this.salePrice = salePrice;
        this.norma = norma;
        this.active = active;
    }
}
