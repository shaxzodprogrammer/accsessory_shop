package uz.pdp.g42accessoryserver.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import uz.pdp.g42accessoryserver.entity.*;
import uz.pdp.g42accessoryserver.entity.enums.RoleName;
import uz.pdp.g42accessoryserver.exeptions.CustomExeption;
import uz.pdp.g42accessoryserver.payload.ApiResponse;
import uz.pdp.g42accessoryserver.payload.ProductWithAmountDto;
import uz.pdp.g42accessoryserver.payload.TransferDto;
import uz.pdp.g42accessoryserver.repository.*;
import uz.pdp.g42accessoryserver.utills.CommonUtills;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TransferService {
    @Autowired
    DtoService dtoService;

    @Autowired
    TransferRepository transferRepository;

    @Autowired
    WarehouseRepository warehouseRepository;

    @Autowired
    ProductWithAmountRepository productWithAmountRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    UserRepository userRepository;

    @Transactional
    public ApiResponse saveOrEdit(TransferDto dto, User user) {
        Transfer transfer = new Transfer();
        if (dto.getId() != null) {
            transfer = transferRepository.findById(dto.getId()).orElseThrow(() -> new IllegalStateException("Transfer not fount"));
            if (transfer.isAccepted()) {
                return new ApiResponse("Error", false);
            }
            List<ProductWithAmount> productWithAmounts = transfer.getProductWithAmounts();
            for (ProductWithAmount productWithAmount : productWithAmounts) {
                productWithAmountRepository.deleteById(productWithAmount.getId());
            }
        }
        if (dto.getFromWarehouseDto() != null && dto.getFromWarehouseDto().getId() != null) {
            transfer.setFromWarehouse(warehouseRepository.findById(dto.getFromWarehouseDto().getId()).orElseThrow(() -> new IllegalStateException("From Warehouse not found")));
        } else {
            RoleName roleName = dtoService.userRoleName(user);
            if (roleName.equals(RoleName.ROLE_SELLER)) {
                Warehouse byShopSellerId = warehouseRepository.findByShopSellerId(user.getId());
                transfer.setFromWarehouse(byShopSellerId);
            }
        }
        transfer.setAccepted(false);
        transfer.setToWarehouse(warehouseRepository.findById(dto.getToWarehouseDto().getId()).orElseThrow(() -> new IllegalStateException("To Warehouse not found")));
        Transfer savedTransfer = transferRepository.save(transfer);
        for (ProductWithAmountDto productWithAmountDto : dto.getProductWithAmountDtos()) {
            ProductWithAmount pwa = new ProductWithAmount();
            Product product = productRepository.findById(productWithAmountDto.getProductDto().getId()).orElseThrow(() -> new IllegalStateException("Product not found"));
            pwa.setTransfer(savedTransfer);
            pwa.setProduct(product);
            if (savedTransfer.getFromWarehouse() != null) {
                Integer productCount = productWithAmountRepository.getProductCount(product.getId(), savedTransfer.getFromWarehouse().getId());
                if (productWithAmountDto.getAmount() > productCount || productWithAmountDto.getAmount() < 1) {
                    throw new CustomExeption("Error");
                }
            }
            pwa.setAmount(productWithAmountDto.getAmount());
            productWithAmountRepository.save(pwa);
        }
        return new ApiResponse(dto.getId() != null ? "Edited" : "Saved", true);
    }

    public ApiResponse acceptTransfer(UUID transferId, User user) {
        try {
            Transfer transfer = transferRepository.findById(transferId).orElseThrow(() -> new IllegalStateException("Transfer not found"));
            RoleName roleName = dtoService.userRoleName(user);
            if (transfer.getToWarehouse().getShop() != null) {
                if (transfer.getToWarehouse().getShop().getSeller().getId().equals(user.getId()) || roleName.equals(RoleName.ROLE_DIRECTOR)) {
                    transfer.setAccepted(true);
                }
            } else {
                if (roleName.equals(RoleName.ROLE_DIRECTOR)) {
                    transfer.setAccepted(true);
                }
            }
            transferRepository.save(transfer);
            return new ApiResponse("Ok", true);
        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse("Error", false);
        }
    }

    public ApiResponse all(int page, int size, Boolean accepted, boolean income, User user, Integer fromWarehouseId, Integer toWarehouseId, String startDate, String endDate) {
        RoleName roleName = dtoService.userRoleName(user);
        if (!roleName.equals(RoleName.ROLE_ANONYMOUS)) {
            if (roleName.equals(RoleName.ROLE_DIRECTOR)
                    || roleName.equals(RoleName.ROLE_MANAGER)) {
                if (income) {
                    try {
                        if (toWarehouseId > 0) {
                            Page<Transfer> transfers = transferRepository.findAllByToWarehouseAndAccepted(warehouseRepository.findById(toWarehouseId).orElseThrow(() -> new IllegalStateException("toWarehouse not found")), accepted, CommonUtills.getPageableByCreatedAtDesc(page, size));
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
                                List<Transfer> transferList = transferRepository.findAllByToWarehouseAndAcceptedAndCreatedAtBetween(warehouseRepository.findById(toWarehouseId).orElseThrow(() -> new IllegalStateException("toWarehouse not found")), accepted,startDate2,endDate2);
                                return new ApiResponse("Ok", true, transferList.stream().map(item -> dtoService.transferDto(item)).collect(Collectors.toList()), 0,0);
                            }
                            catch (Exception e) {
                                e.printStackTrace();
                            }
                            return new ApiResponse("Ok", true, transfers.getContent().stream().map(item -> dtoService.transferDto(item)).collect(Collectors.toList()), transfers.getTotalElements(), transfers.getTotalPages());
                        }
                        else {
                            Page<Transfer> transferList = transferRepository.findAllByAccepted(accepted, CommonUtills.getPageableByCreatedAtDesc(page, size));
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
                                List<Transfer> transferList2 = transferRepository.findAllByAcceptedAndCreatedAtBetween(accepted,startDate2,endDate2);
                                return new ApiResponse("Ok", true, transferList2.stream().map(item -> dtoService.transferDto(item)).collect(Collectors.toList()), 0,0);
                            }
                            catch (Exception e) {
                                e.printStackTrace();
                            }
                            return new ApiResponse("Ok", true, transferList.getContent().stream().map(item -> dtoService.transferDto(item)).collect(Collectors.toList()), transferList.getTotalElements(), transferList.getTotalPages());
                        }
                    } catch (IllegalAccessException e) {
                        e.printStackTrace();
                        return new ApiResponse("Error", false);
                    }

                } else {
                    try {
                        if (fromWarehouseId > 0) {
                            Page<Transfer> transfers = transferRepository.findAllByFromWarehouseAndAccepted(warehouseRepository.findById(fromWarehouseId).orElseThrow(() -> new IllegalStateException("From Warehouse not found")), accepted, CommonUtills.getPageableByCreatedAtDesc(page, size));
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
                                List<Transfer> transferList = transferRepository.findAllByFromWarehouseAndAcceptedAndCreatedAtBetween(warehouseRepository.findById(fromWarehouseId).orElseThrow(() -> new IllegalStateException("fromWarehouse not found")), accepted,startDate2,endDate2);
                                return new ApiResponse("Ok", true, transferList.stream().map(item -> dtoService.transferDto(item)).collect(Collectors.toList()), 0,0);
                            }
                            catch (Exception e) {
                                e.printStackTrace();
                            }
                            return new ApiResponse("Ok", true, transfers.getContent().stream().map(item -> dtoService.transferDto(item)).collect(Collectors.toList()), transfers.getTotalElements(), transfers.getTotalPages());
                        } else {
                            Page<Transfer> transfers = transferRepository.findAllByFromWarehouseIsNotNullAndAccepted(accepted, CommonUtills.getPageableByCreatedAtDesc(page, size));
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
                                List<Transfer> transferList = transferRepository.findAllByAcceptedAndCreatedAtBetweenAndFromWarehouseIsNotNull(accepted,startDate2,endDate2);
                                return new ApiResponse("Ok", true, transferList.stream().map(item -> dtoService.transferDto(item)).collect(Collectors.toList()), 0,0);
                            }
                            catch (Exception e) {
                                e.printStackTrace();
                            }
                            return new ApiResponse("Ok", true, transfers.getContent().stream().map(item -> dtoService.transferDto(item)).collect(Collectors.toList()), transfers.getTotalElements(), transfers.getTotalPages());

                        }
                    } catch (IllegalAccessException e) {
                        e.printStackTrace();
                        return new ApiResponse("Error", false);
                    }
                }
            }
            else {
                if (income) {
                    try {
                        Page<Transfer> transfers = transferRepository.findAllByToWarehouseAndAccepted(warehouseRepository.findByShopSellerId(user.getId()), accepted, CommonUtills.getPageableByCreatedAtDesc(page, size));
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
                            List<Transfer> transferList = transferRepository.findAllByToWarehouseAndAcceptedAndCreatedAtBetween(warehouseRepository.findByShopSellerId(user.getId()), accepted,startDate2,endDate2);
                            return new ApiResponse("Ok", true, transferList.stream().map(item -> dtoService.transferDto(item)).collect(Collectors.toList()), 0,0);
                        }
                        catch (Exception e) {
                            e.printStackTrace();
                        }
                        return new ApiResponse("Ok", true, transfers.getContent().stream().map(item -> dtoService.transferDto(item)).collect(Collectors.toList()), transfers.getTotalElements(), transfers.getTotalPages());
                    } catch (Exception e) {
                        return new ApiResponse("Error", false);
                    }
                } else {
                    try {
                        Page<Transfer> transfers = transferRepository.findAllByFromWarehouseAndAccepted(warehouseRepository.findByShopSellerId(user.getId()), accepted, CommonUtills.getPageableByCreatedAtDesc(page, size));
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
                            List<Transfer> transferList = transferRepository.findAllByFromWarehouseAndAcceptedAndCreatedAtBetween(warehouseRepository.findByShopSellerId(user.getId()), accepted,startDate2,endDate2);
                            return new ApiResponse("Ok", true, transferList.stream().map(item -> dtoService.transferDto(item)).collect(Collectors.toList()), 0,0);
                        }
                        catch (Exception e) {
                            e.printStackTrace();
                        }
                        return new ApiResponse("Ok", true, transfers.getContent().stream().map(item -> dtoService.transferDto(item)).collect(Collectors.toList()), transfers.getTotalElements(), transfers.getTotalPages());
                    } catch (Exception e) {
                        return new ApiResponse("Error", false);
                    }
                }
            }
        } else {
            return new ApiResponse("Error", false);
        }
    }

    public ApiResponse remove(UUID transferId, User user) {
        try {
            Transfer transfer = transferRepository.findById(transferId).orElseThrow(() -> new IllegalStateException("Transfer not found"));
            if (transfer.isAccepted()) {
                return new ApiResponse("Error", false);
            }
            if (transfer.getCreatedBy().equals(user.getId())) {
                transferRepository.deleteById(transferId);
            }
            return new ApiResponse("Deleted", true);
        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse("Error", false);
        }
    }

    public ApiResponse countProductByWarehouse(Integer warehouseId, UUID productId, User user) {
        try {
            int count = 0;
            if (warehouseId == null || warehouseId == 0) {
                RoleName roleName = dtoService.userRoleName(user);
                if (roleName.equals(RoleName.ROLE_SELLER)) {
                    Warehouse warehouse = warehouseRepository.findByShopSellerId(user.getId());
                    warehouseId = warehouse.getId();
                } else {
                    return new ApiResponse("Error", false);
                }
            }
            count = productWithAmountRepository.getProductCount(productId, warehouseId);
            return new ApiResponse("Ok", true, count);
        } catch (Exception e) {
            return new ApiResponse("Error", false);
        }
    }
}
