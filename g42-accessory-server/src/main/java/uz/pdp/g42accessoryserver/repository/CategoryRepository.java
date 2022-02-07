package uz.pdp.g42accessoryserver.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uz.pdp.g42accessoryserver.entity.Category;

public interface CategoryRepository extends JpaRepository<Category,Integer> {
}
