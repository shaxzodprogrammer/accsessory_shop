package uz.pdp.g42accessoryserver.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import uz.pdp.g42accessoryserver.entity.*;
import uz.pdp.g42accessoryserver.entity.enums.RoleName;
import uz.pdp.g42accessoryserver.payload.ApiResponse;
import uz.pdp.g42accessoryserver.payload.DefectDto;
import uz.pdp.g42accessoryserver.payload.ProductWithAmountDto;
import uz.pdp.g42accessoryserver.repository.*;
import uz.pdp.g42accessoryserver.utills.CommonUtills;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DefectService {

    @Autowired
    ProductRepository productRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    WarehouseRepository warehouseRepository;

    @Autowired
    private ShopRepository shopRepository;

    @Autowired
    private DefectRepository defectRepository;

    @Autowired
    private ProductWithAmountRepository productWithAmountRepository;

    @Autowired
    private DtoService dtoService;


    public ApiResponse saveOrEdit(DefectDto dto, User user) {
        try {
            Defect defect = new Defect();
            if (dto.getId() != null) {
                defect = defectRepository.findById(dto.getId()).orElseThrow(() -> new IllegalStateException("Defect not fount"));
                if (defect.isAccepted()) {
                    return new ApiResponse("Error", false);
                }
                defectRepository.delete(defect);
                defect = new Defect();
            }
            if (user.getRoles().contains(roleRepository.findByRoleName(RoleName.ROLE_SELLER))) {
                Warehouse warehouse = warehouseRepository.findByShopSellerId(user.getId());
                defect.setWarehouse(warehouse);

            }
            if (user.getRoles().contains(roleRepository.findByRoleName(RoleName.ROLE_DIRECTOR)) || user.getRoles().contains(roleRepository.findByRoleName(RoleName.ROLE_MANAGER))) {
                defect.setWarehouse(warehouseRepository.findById(dto.getWarehouseDto().getId()).orElseThrow(() -> new IllegalStateException("Warehouse not found")));
            }
            Defect savedDefect = defectRepository.save(defect);
            for (ProductWithAmountDto pwaDto : dto.getProductWithAmountDtos()) {
                ProductWithAmount productWithAmount = new ProductWithAmount();
                productWithAmount.setDefect(savedDefect);
                productWithAmount.setAmount(pwaDto.getAmount());
                Product product = productRepository.findById(pwaDto.getProductDto().getId()).orElseThrow(() -> new IllegalStateException("Product not found"));
                productWithAmount.setProduct(product);
                productWithAmount.setRealSoldPrice(product.getIncomePrice());
                productWithAmountRepository.save(productWithAmount);
            }
            return new ApiResponse(dto.getId() != null ? "Edited" : "Saved", true);
        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse("Error", false);
        }

    }

    public ApiResponse remove(UUID id, User user) {
        try {
            RoleName roleName = dtoService.userRoleName(user);
            if (roleName.equals(RoleName.ROLE_DIRECTOR)){
                defectRepository.deleteById(id);
                return new ApiResponse("Deleted", true);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ApiResponse("Error", false);
    }

    public ApiResponse all(Integer page, Integer size, User user, Integer warehouseId, boolean accepted, String startDate, String endDate) throws IllegalAccessException {
        int wId = 0;
        Page<Defect> all = defectRepository.findAllByAccepted(accepted, CommonUtills.getPageableByCreatedAtDesc(page, size));
        if (user.getRoles().contains(roleRepository.findByRoleName(RoleName.ROLE_SELLER))) {
            Warehouse optionalWarehouse = warehouseRepository.findByShopSellerId(user.getId());
            wId = optionalWarehouse.getId();
        }
        if (user.getRoles().contains(roleRepository.findByRoleName(RoleName.ROLE_DIRECTOR))) {
            if (warehouseId != null) {
                if (warehouseId > 0)
                    wId = warehouseId;
            }
        }
        if (wId > 0) {
            all = defectRepository.findAllByAcceptedAndWarehouseId(accepted, wId, CommonUtills.getPageableByCreatedAtDesc(page, size));
        }

        try {
            String[] newDate = startDate.split(" ");
            String startDate1 = "";
            startDate1+=newDate[0];
            startDate1+=", " + newDate[1];
            startDate1+=" " + newDate[2];
            startDate1+=" " + newDate[3];
            SimpleDateFormat formatter=new SimpleDateFormat("E, MMM dd yyyy");
            Date date1 = formatter.parse(startDate1);
            Timestamp startDate2 = new Timestamp(date1.getTime());

            String[] newDate1 = endDate.split(" ");
            String endDate1 = "";
            endDate1+=newDate1[0];
            endDate1+=", " + newDate1[1];
            endDate1+=" " + newDate1[2];
            endDate1+=" " + newDate1[3];
            Date date2 = formatter.parse(endDate1);
            Timestamp endDate2 = new Timestamp(date2.getTime());
            List<Defect> defects = new ArrayList<>();
            if(warehouseId>0) {
                defects = defectRepository.findAllByAcceptedAndWarehouseIdAndCreatedAtBetween(accepted, warehouseId, startDate2, endDate2);
            } else {
                defects = defectRepository.findAllByAcceptedAndCreatedAtBetween(accepted, startDate2, endDate2);
            }
            return new ApiResponse("Ok", true,
                    defects.stream().map(defect -> dtoService.defectDto(defect)).collect(Collectors.toList()),
                    defectRepository.count(),
                   0);
        }
        catch (Exception e) {
            return new ApiResponse("Ok", true,
                    all.getContent().stream().map(defect -> dtoService.defectDto(defect)).collect(Collectors.toList()),
                    all.getTotalElements(),
                    all.getTotalPages());
        }
    }

    public ApiResponse accept(UUID id, User user) {
        try {
            if (dtoService.userRoleName(user).equals(RoleName.ROLE_DIRECTOR)) {
                Defect defect = defectRepository.findById(id).orElseThrow(() -> new IllegalStateException("Defect not found"));
                defect.setAccepted(true);
                defectRepository.save(defect);
                return new ApiResponse("Accepted", true);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ApiResponse("Error", false);
    }
}
