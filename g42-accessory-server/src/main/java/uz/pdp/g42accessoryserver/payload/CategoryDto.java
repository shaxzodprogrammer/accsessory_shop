package uz.pdp.g42accessoryserver.payload;

import lombok.Data;

@Data
public class CategoryDto {
    private Integer id;
    private String name;
    private boolean active;
    private CategoryDto parentCategoryDto;
}
