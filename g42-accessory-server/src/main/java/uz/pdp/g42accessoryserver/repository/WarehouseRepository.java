package uz.pdp.g42accessoryserver.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import uz.pdp.g42accessoryserver.entity.Warehouse;
import uz.pdp.g42accessoryserver.payload.model.ProducCountByWarehouse;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WarehouseRepository extends JpaRepository<Warehouse, Integer> {
    Optional<Warehouse> findByShopId(Integer shop_id);

    Warehouse findByShopSellerId(UUID shop_seller_id);

    List<Warehouse> findAllByShopIsNull();

    List<Warehouse> findAllByActiveTrue();


    @Query(value = "select cast(p.id as varchar) as id,p.name,(cast((SELECT json_agg(json_build_object('id',www.id, 'name',www.name,'count',((select coalesce(sum(pwa.amount), 0)from product_with_amount pwa join transfer t on t.id = pwa.transfer_id and t.accepted = true and t.to_warehouse_id = www.id where pwa.product_id = p.id) + (select coalesce(sum(pwa.amount), 0) from product_with_amount pwa join reject r on r.id = pwa.reject_id and r.accepted = true and r.warehouse_id = www.id where pwa.product_id = p.id) - (select coalesce(sum(pwa.amount), 0) from product_with_amount pwa join defect d on d.id = pwa.defect_id and d.accepted = true and d.warehouse_id = www.id where pwa.product_id = p.id) - (select coalesce(sum(pwa.amount), 0) from product_with_amount pwa join transfer t2 on t2.id = pwa.transfer_id and t2.accepted = true and t2.from_warehouse_id = www.id where pwa.product_id = p.id) - (select coalesce(sum(pwa.amount), 0) from product_with_amount pwa join trade tr on tr.id = pwa.trade_id and tr.shop_id in (select w.shop_id from warehouse w where w.id = www.id) where pwa.product_id = p.id)))) from warehouse www) as varchar)) as amount, p.income_price from product p",nativeQuery = true)
    List<Object[]> productCountByWarehouse();

    @Query(value = "select cast(p.id as varchar) as id,p.name,(cast((SELECT json_agg(json_build_object('id',www.id, 'name',www.name,'count',((select coalesce(sum(pwa.amount), 0)from product_with_amount pwa join transfer t on t.id = pwa.transfer_id and t.accepted = true and t.to_warehouse_id = www.id where pwa.product_id = p.id) + (select coalesce(sum(pwa.amount), 0) from product_with_amount pwa join reject r on r.id = pwa.reject_id and r.accepted = true and r.warehouse_id = www.id where pwa.product_id = p.id) - (select coalesce(sum(pwa.amount), 0) from product_with_amount pwa join defect d on d.id = pwa.defect_id and d.accepted = true and d.warehouse_id = www.id where pwa.product_id = p.id) - (select coalesce(sum(pwa.amount), 0) from product_with_amount pwa join transfer t2 on t2.id = pwa.transfer_id and t2.accepted = true and t2.from_warehouse_id = www.id where pwa.product_id = p.id) - (select coalesce(sum(pwa.amount), 0) from product_with_amount pwa join trade tr on tr.id = pwa.trade_id and tr.shop_id in (select w.shop_id from warehouse w where w.id = www.id) where pwa.product_id = p.id)))) from warehouse www) as varchar)) as amount from product p where p.id=:productId",nativeQuery = true)
    List<Object[]> productCountByWarehouseByProductId(UUID productId);

    @Query(value = "select cast(p.id as varchar) as id,p.name,(cast((SELECT json_agg(json_build_object('id',www.id, 'name',www.name,'count',((select coalesce(sum(pwa.amount), 0)from product_with_amount pwa join transfer t on t.id = pwa.transfer_id and t.accepted = true and t.to_warehouse_id = www.id where pwa.product_id = p.id) + (select coalesce(sum(pwa.amount), 0) from product_with_amount pwa join reject r on r.id = pwa.reject_id and r.accepted = true and r.warehouse_id = www.id where pwa.product_id = p.id) - (select coalesce(sum(pwa.amount), 0) from product_with_amount pwa join defect d on d.id = pwa.defect_id and d.accepted = true and d.warehouse_id = www.id where pwa.product_id = p.id) - (select coalesce(sum(pwa.amount), 0) from product_with_amount pwa join transfer t2 on t2.id = pwa.transfer_id and t2.accepted = true and t2.from_warehouse_id = www.id where pwa.product_id = p.id) - (select coalesce(sum(pwa.amount), 0) from product_with_amount pwa join trade tr on tr.id = pwa.trade_id and tr.shop_id in (select w.shop_id from warehouse w where w.id = www.id) where pwa.product_id = p.id)))) from warehouse www) as varchar)) as amount from product p limit :size offset :page*:size",nativeQuery = true)
    List<Object[]> productCountByWarehouseByPageable(Integer page,Integer size);

}
