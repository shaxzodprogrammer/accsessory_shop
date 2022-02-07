package uz.pdp.g42accessoryserver.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uz.pdp.g42accessoryserver.entity.Discount;
import uz.pdp.g42accessoryserver.entity.Transfer;

import java.util.UUID;

public interface DiscountRepository extends JpaRepository<Discount, UUID> {
}
