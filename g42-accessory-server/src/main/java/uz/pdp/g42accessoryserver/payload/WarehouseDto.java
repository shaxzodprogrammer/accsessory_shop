package uz.pdp.g42accessoryserver.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WarehouseDto {
    private Integer id;
    private String name;
    private String description;
    private String address;
    private ShopDto shopDto;
    private boolean active;
}



