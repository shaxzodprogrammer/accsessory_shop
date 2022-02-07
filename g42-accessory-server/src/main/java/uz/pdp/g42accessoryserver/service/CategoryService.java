package uz.pdp.g42accessoryserver.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import uz.pdp.g42accessoryserver.entity.Category;
import uz.pdp.g42accessoryserver.payload.ApiResponse;
import uz.pdp.g42accessoryserver.payload.CategoryDto;
import uz.pdp.g42accessoryserver.repository.CategoryRepository;
import uz.pdp.g42accessoryserver.utills.CommonUtills;

import java.util.stream.Collectors;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private DtoService dtoService;

    public ApiResponse saveOrEdit(CategoryDto categoryDto){
        try {
            Category category=new Category();
            category.setParent(categoryDto.getParentCategoryDto()!=null ?
                    categoryRepository.getOne(categoryDto.getParentCategoryDto().getId()):null);
            if (categoryDto.getId()==null){
                category.setName(categoryDto.getName());
                category.setActive(true);
                categoryRepository.save(category);
                return new ApiResponse("Saved",true);
            }
            else {
                category.setId(categoryDto.getId());
                category.setName(categoryDto.getName());
                category.setActive(true);
                categoryRepository.save(category);
                return new ApiResponse("Edited",true);
            }

        }catch (Exception e){
            e.printStackTrace();
            return new ApiResponse("Error",false);
        }

    }

    public ApiResponse all(Integer page, Integer size) throws IllegalAccessException {
        Page<Category> all = categoryRepository.findAll(CommonUtills.getPageableByIdDesc(page, size));
        return new ApiResponse("Ok", true, all.getContent().stream().map(category -> dtoService.categoryDto(category)).collect(Collectors.toList()), all.getTotalElements(), all.getTotalPages());
    }

    public ApiResponse remove(Integer id) {
        try {
            categoryRepository.deleteById(id);
            return new ApiResponse("Deleted", true);
        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse("Error", false);
        }
    }
}
