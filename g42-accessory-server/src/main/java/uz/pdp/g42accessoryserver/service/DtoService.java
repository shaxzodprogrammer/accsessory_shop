package uz.pdp.g42accessoryserver.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uz.pdp.g42accessoryserver.entity.*;
import uz.pdp.g42accessoryserver.entity.enums.RoleName;
import uz.pdp.g42accessoryserver.payload.*;
import uz.pdp.g42accessoryserver.repository.ProductWithAmountRepository;
import uz.pdp.g42accessoryserver.repository.TradeRepository;
import uz.pdp.g42accessoryserver.repository.UserRepository;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DtoService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    TradeRepository tradeRepository;

    @Autowired
    ProductWithAmountRepository productWithAmountRepository;

    public WarehouseDto warehouseDto(Warehouse warehouse) {
        return new WarehouseDto(
                warehouse.getId(),
                warehouse.getName(),
                warehouse.getDescription(),
                warehouse.getAddress(),
                warehouse.getShop()!=null?shopDto(warehouse.getShop()):null,
                warehouse.isActive()
        );
    }

    public ShopDto shopDto(Shop shop) {
        return new ShopDto(
                shop.getId(),
                shop.getName(),
                shop.getDescription(),
                shop.getAddress(),
                shop.getSeller()!=null?userDto(shop.getSeller()):null,
                shop.isActive()
        );
    }

    public UserDto userDto(User user) {
        return new UserDto(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber(),
                user.getUsername(),
                user.getRoles().stream().map(Role::getRoleName).collect(Collectors.toList()),
                user.isEnabled()
        );
    }

    public CategoryDto categoryDto(Category category) {
        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setId(category.getId());
        categoryDto.setName(category.getName());
        categoryDto.setActive(category.isActive());
        if (category.getParent() != null) {
            categoryDto.setParentCategoryDto(categoryDto(category.getParent()));
        }
        return categoryDto;
    }

    public ProductDto getProductDto(Product product) {
        return new ProductDto(
                product.getId(),
                product.getId(),
                product.getCategory()!=null?categoryDto(product.getCategory()):null,
                product.getName(),
                product.getName(),
                product.getIncomePrice(),
                product.getSalePrice(),
                product.getNorma(),
                product.isActive()
        );
    }

    public ReportDto reportDto(Report report) {
        ReportDto dto= new ReportDto(
                report.getId(),
                shopDto(report.getShop()),
                userDto(report.getSeller()),
                report.getStatus(),
                report.getCreatedAt()
        );
        if (report.getManagerOrDirector()!=null){
            dto.setManagerDto(userDto(report.getManagerOrDirector()));
        }
        dto.setSum(report.getTotalSum());
        List<ProductWithAmountDto> productWithAmountDtos=new ArrayList<>();
        List<Trade> allByReport = tradeRepository.findAllByReport(report);
        for (Trade trade : allByReport) {
            List<ProductWithAmount> allByTrade = productWithAmountRepository.findAllByTrade(trade);
            for (ProductWithAmount productWithAmount : allByTrade) {
                productWithAmountDtos.add(productWithAmountDto(productWithAmount));
            }
        }
        dto.setPwa(productWithAmountDtos);
        return dto;
    }

    public DefectDto defectDto(Defect defect) {
        DefectDto defectDto = new DefectDto(
                defect.getId(),
                warehouseDto(defect.getWarehouse()),
                defect.isAccepted()
        );
        defectDto.setCreatedBy(userDto(userRepository.getById(defect.getCreatedBy())));
        List<ProductWithAmountDto> collect =new ArrayList<>();
        double totalSum=0;
        for (ProductWithAmount productWithAmount : defect.getProductWithAmounts()) {
            collect.add(productWithAmountDto(productWithAmount));
            totalSum+=productWithAmount.getRealSoldPrice()*productWithAmount.getAmount();
        }
        defectDto.setTotalDefectSum(totalSum);
        defectDto.setProductWithAmountDtos(collect);
        defectDto.setCreatedAt(defect.getCreatedAt());
        return defectDto;
    }

//    public TransferDto transferDto(Transfer transfer) {
//        return new TransferDto(
//                transfer.getId(),
//                transfer.getCreatedAt(),
//                userDto(userRepository.getById(transfer.getCreatedBy())),
//                warehouseDto(transfer.getFromWarehouse()),
//                warehouseDto(transfer.getToWarehouse()),
//                transfer.isAccepted(),
//                transfer.getProductWithAmounts().stream().map(this::productWithAmountDto).collect(Collectors.toList())
//                );
////        return null;
//    }

    public RejectDto rejectDto(Reject reject) {
        RejectDto dto= new RejectDto(
                reject.getId(),
                reject.getRejectTotalSum(),
                reject.getProductWithAmounts().stream().map(this::productWithAmountDto).collect(Collectors.toList()),
                reject.isAccepted(),
                reject.getCreatedAt(),
                warehouseDto(reject.getWarehouse())
        );
        dto.setSeller(userDto(reject.getSeller()));
        if (reject.getManager()!=null){
            dto.setManager(userDto(reject.getManager()));
        }
        return dto;
    }

    public ProductWithAmountDto productWithAmountDto(ProductWithAmount productWithAmount){
        ProductWithAmountDto dto = new ProductWithAmountDto();
        dto.setId(productWithAmount.getId());
        dto.setAmount(productWithAmount.getAmount());
        dto.setProductDto(getProductDto(productWithAmount.getProduct()));
        dto.setRealSoldPrice(productWithAmount.getRealSoldPrice());
        return dto;
    }

    public TransferDto transferDto(Transfer transfer){
        TransferDto dto = new TransferDto();
        dto.setId(transfer.getId());
        dto.setCreatedAt(transfer.getCreatedAt());
        dto.setCreatedBy(userDto(userRepository.findById(transfer.getCreatedBy()).orElseThrow(() -> new IllegalStateException("Created By User not found"))));
        if (transfer.getFromWarehouse()!=null){
            dto.setFromWarehouseDto(warehouseDto(transfer.getFromWarehouse()));
        }
        dto.setToWarehouseDto(warehouseDto(transfer.getToWarehouse()));
        dto.setAccepted(transfer.isAccepted());
        List<ProductWithAmountDto> productWithAmountDtos = new ArrayList<>();
        for (ProductWithAmount productWithAmount : transfer.getProductWithAmounts()) {
            productWithAmountDtos.add(productWithAmountDto(productWithAmount));
        }
        dto.setProductWithAmountDtos(productWithAmountDtos);
        return dto;
    }

    public RoleName userRoleName(User user){
        for (Role role : user.getRoles()) {
            return role.getRoleName();
        }
        return RoleName.ROLE_ANONYMOUS;
    }

    public TradeDto tradeDto(Trade trade){
        TradeDto dto = new TradeDto();
        dto.setId(trade.getId());
        dto.setCreatedAt(trade.getCreatedAt());
        dto.setSellerDto(userDto(trade.getSeller()));
        dto.setShopDto(shopDto(trade.getShop()));
        dto.setTotalSum(trade.getTotalSum());
        dto.setTotalIncomeSum(trade.getTotalIncomeSum());
        dto.setAfterDiscountTotalSum(trade.getAfterDiscountTotalSum());
        List<ProductWithAmountDto> productWithAmountDtos=new ArrayList<>();
        for (ProductWithAmount productWithAmount : trade.getProductWithAmounts()) {
            productWithAmountDtos.add(productWithAmountDto(productWithAmount));
        }
        dto.setProductWithAmountDtos(productWithAmountDtos);
        if (trade.getDiscount()!=null){
            dto.setDiscountDto(discountDto(trade.getDiscount()));
        }
        return dto;
    }

    public DiscountDto discountDto(Discount discount){
        DiscountDto dto = new DiscountDto();
        dto.setId(discount.getId());
        dto.setDiscountType(discount.getDiscountType());
        dto.setAmount(discount.getAmount());
        return dto;
    }
}
