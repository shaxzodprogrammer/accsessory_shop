package uz.pdp.g42accessoryserver.service;

import com.google.gson.Gson;
import org.apache.poi.ss.util.CellRangeAddress;
import org.hibernate.internal.build.AllowSysOut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import uz.pdp.g42accessoryserver.entity.Product;
import uz.pdp.g42accessoryserver.entity.User;
import uz.pdp.g42accessoryserver.entity.Warehouse;
import uz.pdp.g42accessoryserver.payload.ApiResponse;
import uz.pdp.g42accessoryserver.payload.TotalCashFlowDto;
import uz.pdp.g42accessoryserver.payload.WarehouseCashFlowDto;
import uz.pdp.g42accessoryserver.payload.model.ProductCountDto;
import uz.pdp.g42accessoryserver.payload.model.WarehouseProductCount;
import uz.pdp.g42accessoryserver.repository.ProductRepository;
import uz.pdp.g42accessoryserver.repository.WarehouseRepository;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class DashboardService {

    @Autowired
    WarehouseRepository warehouseRepository;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    DtoService dtoService;


    public ApiResponse productCount(Integer page, Integer size, UUID productId) {
        List<Object[]> objects = new ArrayList<>();
        if (productId != null) {
            Product product = productRepository.getById(productId);
            objects = warehouseRepository.productCountByWarehouseByProductId(productId);
        } else {
            objects = warehouseRepository.productCountByWarehouseByPageable(page, size);
        }
        Gson gson = new Gson();
        List<ProductCountDto> productCountDtos = new ArrayList<>();
        for (int i = 0; i < objects.size(); i++) {
            ProductCountDto dto = new ProductCountDto();
            Object[] obj = objects.get(i);
            String productName = String.valueOf(obj[1]);
            dto.setProductName(productName);

            String arr = String.valueOf(obj[2]);
            WarehouseProductCount[] warehouseProductCounts = gson.fromJson(arr, WarehouseProductCount[].class);
            dto.setWarehouseProductCounts(Arrays.asList(warehouseProductCounts));
            productCountDtos.add(dto);
        }
        long count = productRepository.count();
        return new ApiResponse("Ok", true, productCountDtos, count, 0);
    }

    public TotalCashFlowDto totalCashFlow() {

        TotalCashFlowDto totalCashFlow = new TotalCashFlowDto();
        double totalTotal = 0;
        List<WarehouseCashFlowDto> warehouseCashFlow = new ArrayList<>();
        List<Warehouse> warehouses = warehouseRepository.findAll();
        List<Object[]> objects = warehouseRepository.productCountByWarehouse();
        Gson gson = new Gson();
        for (Warehouse warehouse : warehouses) {
            WarehouseCashFlowDto cashFlowDto = new WarehouseCashFlowDto();
            cashFlowDto.setWarehouseDto(dtoService.warehouseDto(warehouse));
            double totalSum = 0;
            for (Object[] object : objects) {
                String arr = String.valueOf(object[2]);
                double productSum = Double.parseDouble(String.valueOf(object[3]));
                WarehouseProductCount[] warehouseProductCounts = gson.fromJson(arr, WarehouseProductCount[].class);
                for (WarehouseProductCount warehouseProductCount : warehouseProductCounts) {
                    if (warehouseProductCount.getId().equals(warehouse.getId())) {
                        totalSum += productSum * warehouseProductCount.getCount();
                    }
                }
            }
            cashFlowDto.setTotalSum(totalSum);
            warehouseCashFlow.add(cashFlowDto);
            totalTotal += totalSum;
        }
        totalCashFlow.setWarehouseCashFlowDtos(warehouseCashFlow);
        totalCashFlow.setTotalSum(totalTotal);
        return totalCashFlow;
    }
}
