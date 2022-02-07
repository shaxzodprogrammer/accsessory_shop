package uz.pdp.g42accessoryserver.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uz.pdp.g42accessoryserver.entity.Shop;

import java.util.List;
import java.util.UUID;

public interface ShopRepository extends JpaRepository<Shop,Integer> {
    List<Shop> findAllBySellerId(UUID seller_id);
}
