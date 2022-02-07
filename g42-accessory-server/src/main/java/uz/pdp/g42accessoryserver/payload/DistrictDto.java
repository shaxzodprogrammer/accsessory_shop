package uz.pdp.g42accessoryserver.payload;

import lombok.Data;

@Data
public class DistrictDto {
    private Integer id;
    private String name;
    private RegionDto regionDto;
}
