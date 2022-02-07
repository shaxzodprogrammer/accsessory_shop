package uz.pdp.g42accessoryserver.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import uz.pdp.g42accessoryserver.entity.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductWithAmountRepository extends JpaRepository<ProductWithAmount, UUID> {

    List<ProductWithAmount> findAllByDefect(Defect defect);

    @Query(value = "select ((select coalesce(sum(pwa.amount), 0) " +
            "from product_with_amount pwa" +
            " join transfer t on t.id = pwa.transfer_id" +
            " and t.accepted=true" +
            " and t.to_warehouse_id = :wId" +
            " where pwa.product_id = p.id) +" +
            " (select coalesce(sum(pwa.amount), 0)" +
            " from product_with_amount pwa" +
            " join reject r on r.id = pwa.reject_id" +
            " and r.accepted=true" +
            " and r.warehouse_id = :wId " +
            "where pwa.product_id = p.id) - " +
            "(select coalesce(sum(pwa.amount), 0) " +
            "from product_with_amount pwa " +
            "join defect d on d.id = pwa.defect_id " +
            "and d.accepted=true " +
            "and d.warehouse_id = :wId" +
            " where pwa.product_id = p.id) - " +
            "(select coalesce(sum(pwa.amount), 0) " +
            "from product_with_amount pwa " +
            "join transfer t2 on t2.id = pwa.transfer_id" +
            " and t2.accepted=true " +
            "and t2.from_warehouse_id = :wId " +
            "where pwa.product_id = p.id) - " +
            "(select coalesce(sum(pwa.amount), 0) " +
            "from product_with_amount pwa join trade tr on tr.id = pwa.trade_id and tr.shop_id in (select w.shop_id from warehouse w where w.id = :wId) where pwa.product_id = p.id)) from product p where p.id = :proId",nativeQuery = true)
    Integer getProductCount(@Param(value = "proId")UUID proId,@Param(value = "wId")Integer wId);

    List<ProductWithAmount> findAllByTrade(Trade trade);


}
