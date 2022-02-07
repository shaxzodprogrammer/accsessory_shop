package uz.pdp.g42accessoryserver.payload;

import lombok.Data;

@Data
public class AddressDto {
    private Integer id;
    private Double lon;
    private Double lat;

    private String street;
    private String home;

    private DistrictDto districtDto;
}
