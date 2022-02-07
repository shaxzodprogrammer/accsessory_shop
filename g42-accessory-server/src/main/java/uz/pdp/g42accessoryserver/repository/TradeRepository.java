package uz.pdp.g42accessoryserver.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uz.pdp.g42accessoryserver.entity.*;

import java.util.List;
import java.util.UUID;

public interface TradeRepository extends JpaRepository<Trade, UUID> {
    List<Trade> findAllByShopAndSellerAndReportOrderByCreatedAtDesc(Shop shop, User seller, Report report);
    List<Trade> findAllByReport(Report report);
}
