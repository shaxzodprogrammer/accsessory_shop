package uz.pdp.g42accessoryserver.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import uz.pdp.g42accessoryserver.entity.Shop;
import uz.pdp.g42accessoryserver.entity.Warehouse;
import uz.pdp.g42accessoryserver.payload.ApiResponse;
import uz.pdp.g42accessoryserver.payload.ShopDto;
import uz.pdp.g42accessoryserver.repository.ShopRepository;
import uz.pdp.g42accessoryserver.repository.UserRepository;
import uz.pdp.g42accessoryserver.repository.WarehouseRepository;
import uz.pdp.g42accessoryserver.utills.CommonUtills;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ShopService {
    @Autowired
    ShopRepository shopRepository;

    @Autowired
    DtoService dtoService;

    @Autowired
    WarehouseRepository warehouseRepository;

    @Autowired
    UserRepository userRepository;

    public ApiResponse saveOrEdit(ShopDto shopDto) {
        try {
            Shop shop = new Shop();
            if (shopDto.getId() != null) {
                shop = shopRepository.findById(shopDto.getId()).orElseThrow(() -> new IllegalStateException("Shop not found"));
            }
            shop.setName(shopDto.getName());
            shop.setAddress(shopDto.getAddress());
            if (shopDto.getSeller()!=null){
                List<Shop> allBySellerId = shopRepository.findAllBySellerId(shopDto.getSeller().getId());
                for (Shop shop1 : allBySellerId) {
                    shop1.setSeller(null);
                    shopRepository.save(shop1);
                }
                shop.setSeller(userRepository.findById(shopDto.getSeller().getId()).orElseThrow(() -> new IllegalStateException("Seller not found")));
            }else {
                return new ApiResponse("Error",false);
            }

//            shop.setActive(shopDto.isActive());
            Shop savedShop = shopRepository.save(shop);
            if (shopDto.getId() == null) {
                Warehouse warehouse = new Warehouse();
                warehouse.setShop(savedShop);
                warehouse.setActive(savedShop.isActive());
                warehouse.setName(savedShop.getName() + " sklad");
                warehouse.setAddress(savedShop.getAddress());
                warehouseRepository.save(warehouse);
            }
            return new ApiResponse(shopDto.getId() != null ? "Edited" : "Saved", true);
        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse("Error", false);
        }
    }


    public ApiResponse all(Integer page, Integer size) throws IllegalAccessException {
        Page<Shop> all = shopRepository.findAll(CommonUtills.getPageableByIdDesc(page, size));
        return new ApiResponse("Ok", true, all.getContent().stream().map(shop -> dtoService.shopDto(shop)).collect(Collectors.toList()), all.getTotalElements(), all.getTotalPages());
    }

    public ApiResponse changeActive(Integer id) {
        try {
            Shop shop = shopRepository.findById(id).orElseThrow(() -> new IllegalStateException("Shop not found"));
            shop.setActive(!shop.isActive());
            shopRepository.save(shop);
            return new ApiResponse(shop.isActive() ? "Activated" : "Blocked", true);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ApiResponse("Error", false);
    }

    public ApiResponse remove(Integer id) {
        try {
            shopRepository.deleteById(id);
            return new ApiResponse("Deleted", true);
        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse("Error", false);
        }
    }
}
