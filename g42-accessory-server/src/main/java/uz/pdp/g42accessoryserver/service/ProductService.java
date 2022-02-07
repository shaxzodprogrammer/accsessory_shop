package uz.pdp.g42accessoryserver.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import uz.pdp.g42accessoryserver.entity.*;
import uz.pdp.g42accessoryserver.payload.ApiResponse;
import uz.pdp.g42accessoryserver.payload.ProductDto;
import uz.pdp.g42accessoryserver.repository.CategoryRepository;
import uz.pdp.g42accessoryserver.repository.ProductRepository;
import uz.pdp.g42accessoryserver.utills.CommonUtills;

import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    DtoService dtoService;

    @Autowired
    ProductRepository productRepository;

    @Autowired
    CategoryRepository categoryRepository;

    public ApiResponse saveProduct(ProductDto dto) {
        try {
            Product product = new Product();
            if (dto.getCategoryDto() != null) {
                product.setCategory(categoryRepository.findById(dto.getCategoryDto().getId())
                        .orElseThrow(() -> new IllegalStateException("Category not found")));
            } else {
                return new ApiResponse("Error",false);
            }
            product.setSalePrice(dto.getSalePrice());
            product.setIncomePrice(dto.getIncomePrice());
            product.setNorma(dto.getNorma());
            product.setName(dto.getName());
            productRepository.save(product);
            return new ApiResponse("Saved", true);
        }catch (Exception e){
            e.printStackTrace();
            return new ApiResponse("Error", false);
        }
    }


    public ApiResponse editProduct(ProductDto dto) {
        try {
            Product product = productRepository.findById(dto.getId())
                    .orElseThrow(() -> new IllegalStateException("product not found"));
            product.setCategory(categoryRepository.findById(dto.getCategoryDto().getId())
                    .orElseThrow(() -> new IllegalStateException("Category not found")));
            product.setSalePrice(dto.getSalePrice());
            product.setIncomePrice(dto.getIncomePrice());
            product.setNorma(dto.getNorma());
            product.setName(dto.getName());
            productRepository.save(product);
            return new ApiResponse("Edited", true);
        }catch (Exception e){
            e.printStackTrace();
            return new ApiResponse("Error", false);
        }
    }


    public ApiResponse changeActive(UUID id) {
        try {
            Product product = productRepository.findById(id).orElseThrow(() -> new IllegalStateException("Product not found"));
            product.setActive(!product.isActive());
            productRepository.save(product);
            return new ApiResponse(product.isActive()?"Activated":"Blocked", true);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ApiResponse("Error", false);
    }

    public ApiResponse remove(UUID id) {
        try {
            productRepository.deleteById(id);
            return new ApiResponse("Deleted", true);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ApiResponse("Error", false);
    }

    public ApiResponse all(Integer page, Integer size) throws IllegalAccessException {
        Page<Product> all = productRepository.findAll(CommonUtills.getPageableByCreatedAtDesc(page, size));
        return new ApiResponse("Ok",true,all.getContent().stream().map(item->dtoService.getProductDto(item)).collect(Collectors.toList()),all.getTotalElements(),all.getTotalPages());
    }



    public ApiResponse filter(double salePrice1, double salePrice2, Category category, Integer page, Integer size) {
        try {
            Page<Product> all = productRepository.findBySalePriceBetweenAndCategory(salePrice1, salePrice2, category, CommonUtills.getPageableByCreatedAtDesc(page, size));
            return new ApiResponse("Ok",true,all.getContent().stream().map(item->dtoService.getProductDto(item)).collect(Collectors.toList()),all.getTotalElements(),all.getTotalPages());
        }catch (Exception e){
            e.printStackTrace();
            return new ApiResponse("Error", false);
        }
    }

    public ApiResponse search(String val) {
        return new ApiResponse("Ok",true,productRepository.findAllByNameContainingIgnoreCase(val).stream().map(item->dtoService.getProductDto(item)).collect(Collectors.toList()));
    }
}
