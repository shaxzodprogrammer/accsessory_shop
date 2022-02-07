package uz.pdp.g42accessoryserver.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.pdp.g42accessoryserver.entity.Shop;
import uz.pdp.g42accessoryserver.entity.User;
import uz.pdp.g42accessoryserver.entity.enums.ReportStatus;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReportDto {

    private UUID id;

    private ShopDto shopDto;

    private UserDto sellerDto;

    private UserDto managerDto;

    private ReportStatus status;

    private Timestamp createdAt;

    private double sum;

    private List<ProductWithAmountDto> pwa;

    public ReportDto(UUID id, ShopDto shopDto, UserDto sellerDto, ReportStatus status, Timestamp createdAt) {
        this.id = id;
        this.shopDto = shopDto;
        this.sellerDto = sellerDto;
        this.status = status;
        this.createdAt = createdAt;
    }
}
