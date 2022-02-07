package uz.pdp.g42accessoryserver.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import uz.pdp.g42accessoryserver.entity.Role;
import uz.pdp.g42accessoryserver.entity.enums.RoleName;
import uz.pdp.g42accessoryserver.payload.model.PwaInterface;

import java.util.List;
import java.util.UUID;

public interface RoleRepository extends JpaRepository<Role,Integer> {
    Role findByRoleName(RoleName roleName);

    @Query(value = "select cast(p.id as varchar) as productId, t.to_warehouse_id as warehouseId , p.name as productName,pwa.amount as productAmount from product_with_amount pwa join product p on pwa.product_id = p.id join transfer t on t.id = pwa.transfer_id and t.id=:tranferId",nativeQuery = true)
    List<PwaInterface> lflfl(@Param(value = "tranferId") UUID tranferId);
}
