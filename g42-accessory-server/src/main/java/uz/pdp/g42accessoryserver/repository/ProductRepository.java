package uz.pdp.g42accessoryserver.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import uz.pdp.g42accessoryserver.entity.Category;
import uz.pdp.g42accessoryserver.entity.Product;

import java.util.List;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<Product, UUID> {
    Page<Product> findBySalePriceBetweenAndCategory(double salePrice, double salePrice2, Category category, Pageable pageable);
    List<Product> findAllByNameContainingIgnoreCase(String name);
}
