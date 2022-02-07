package uz.pdp.g42accessoryserver.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uz.pdp.g42accessoryserver.entity.*;
import uz.pdp.g42accessoryserver.entity.enums.RoleName;
import uz.pdp.g42accessoryserver.payload.ApiResponse;
import uz.pdp.g42accessoryserver.payload.ProductWithAmountDto;
import uz.pdp.g42accessoryserver.payload.RejectDto;
import uz.pdp.g42accessoryserver.repository.*;
import uz.pdp.g42accessoryserver.utills.CommonUtills;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RejectService {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private RejectRepository rejectRepository;

    @Autowired
    private DefectRepository defectRepository;

    @Autowired
    private ProductWithAmountRepository productWithAmountRepository;

    @Autowired
    private DtoService dtoService;

    @Autowired
    private DefectService defectService;

    @Autowired
    private WarehouseRepository warehouseRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public ApiResponse saveOrEdit(RejectDto dto, User user) {
        Reject reject = new Reject();
        if (dto.getId() != null) {
            reject = rejectRepository.findById(dto.getId()).orElseThrow(() -> new IllegalStateException("Reject not fount"));
            if (reject.isAccepted()) {
                return new ApiResponse("Error", false);
            }
            rejectRepository.delete(reject);
            reject = new Reject();
        }
        double totalRejectSum = 0;
        Warehouse byShopSellerId = warehouseRepository.findByShopSellerId(user.getId());
        reject.setWarehouse(byShopSellerId);
        reject.setSeller(user);
        Reject savedReject = rejectRepository.save(reject);
        for (ProductWithAmountDto pwaDto : dto.getProductWithAmountDtos()) {
            if (pwaDto.getAmount() < 1) {
                throw new NumberFormatException();
            }
            totalRejectSum += pwaDto.getRealSoldPrice() * pwaDto.getAmount();
            ProductWithAmount productWithAmount = new ProductWithAmount();
            productWithAmount.setReject(savedReject);
            productWithAmount.setRealSoldPrice(pwaDto.getRealSoldPrice());
            productWithAmount.setAmount(pwaDto.getAmount());
            Product product = productRepository.findById(pwaDto.getProductDto().getId()).orElseThrow(() -> new IllegalStateException("Product not found"));
            productWithAmount.setProduct(product);
            productWithAmountRepository.save(productWithAmount);
        }
        savedReject.setRejectTotalSum(totalRejectSum);
        rejectRepository.save(savedReject);
        return new ApiResponse(dto.getId() != null ? "Edited" : "Saved", true);
    }

    public ApiResponse remove(UUID id, User user) {
        try {
            Reject reject = rejectRepository.findById(id).orElseThrow(() -> new IllegalStateException("Reject not found"));
            if (reject.getCreatedBy().equals(user.getId()) && !reject.isAccepted()) {
                rejectRepository.deleteById(id);
                return new ApiResponse("Deleted", true);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ApiResponse("Error", false);
    }

    public ApiResponse all(Integer page, Integer size, User user, Integer warehouseId, boolean accepted, String startDate, String endDate) throws IllegalAccessException {
        int wId = 0;
        if (user.getRoles().contains(roleRepository.findByRoleName(RoleName.ROLE_SELLER))) {
            Warehouse optionalWarehouse = warehouseRepository.findByShopSellerId(user.getId());

            wId = optionalWarehouse.getId();

        }
        if (user.getRoles().contains(roleRepository.findByRoleName(RoleName.ROLE_DIRECTOR))) {
            if (warehouseId != null) {
                wId = warehouseId;
            }
        }
        try {
            String[] newDate = startDate.split(" ");
            String startDate1 = "";
            startDate1 += newDate[0];
            startDate1 += ", " + newDate[1];
            startDate1 += " " + newDate[2];
            startDate1 += " " + newDate[3];
            SimpleDateFormat formatter = new SimpleDateFormat("E, MMM dd yyyy");
            Date date1 = formatter.parse(startDate1);
            Timestamp startDate2 = new Timestamp(date1.getTime());

            String[] newDate1 = endDate.split(" ");
            String endDate1 = "";
            endDate1 += newDate1[0];
            endDate1 += ", " + newDate1[1];
            endDate1 += " " + newDate1[2];
            endDate1 += " " + newDate1[3];
            Date date2 = formatter.parse(endDate1);
            Timestamp endDate2 = new Timestamp(date2.getTime());
            List<Reject> rejectList = new ArrayList<>();
            if (wId>0){
                rejectList = rejectRepository.findAllByAcceptedAndWarehouseIdAndCreatedAtBetween(accepted,wId, startDate2, endDate2);
            }else {
                rejectList=rejectRepository.findAllByAcceptedAndCreatedAtBetween(accepted,startDate2,endDate2);
            }
            return new ApiResponse("Ok", true, rejectList.stream().map(item -> dtoService.rejectDto(item)).collect(Collectors.toList()), 0, 0);
        } catch (Exception e) {
            Page<Reject> all = rejectRepository.findAllByAccepted(accepted, CommonUtills.getPageableByCreatedAtDesc(page, size));
            if (wId > 0) {
                all = rejectRepository.findAllByAcceptedAndWarehouseId(accepted, wId, CommonUtills.getPageableByCreatedAtDesc(page, size));
            }
            return new ApiResponse("Ok", true,
                    all.getContent().stream().map(reject -> dtoService.rejectDto(reject)).collect(Collectors.toList()),
                    all.getTotalElements(),
                    all.getTotalPages());
        }
    }

    public ApiResponse accept(UUID id, User user) {
        try {
            Reject reject = rejectRepository.findById(id).orElseThrow(() -> new IllegalStateException("Reject not found"));
            reject.setAccepted(true);
            reject.setManager(user);
            rejectRepository.save(reject);
            return new ApiResponse("Accepted", true);
        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse("Error", false);
        }
    }
}
