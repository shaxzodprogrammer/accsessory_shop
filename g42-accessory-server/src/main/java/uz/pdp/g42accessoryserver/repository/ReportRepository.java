package uz.pdp.g42accessoryserver.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import uz.pdp.g42accessoryserver.entity.Report;
import uz.pdp.g42accessoryserver.entity.Shop;
import uz.pdp.g42accessoryserver.entity.User;
import uz.pdp.g42accessoryserver.entity.enums.ReportStatus;

import java.sql.Timestamp;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReportRepository extends JpaRepository<Report, UUID> {
    Page<Report> findAllByStatus(ReportStatus status, Pageable pageable);
    Page<Report> findAllByStatusAndShopId(ReportStatus status, Integer shop_id, Pageable pageable);
    Optional<Report> findByStatusAndShop(ReportStatus status, Shop shop);

    List<Report> findAllByStatusAndShopIdAndCreatedAtBetween(ReportStatus status, Integer shop_id, Timestamp createdAt, Timestamp createdAt2);
    List<Report> findAllByStatusAndCreatedAtBetween(ReportStatus status,Timestamp createdAt, Timestamp createdAt2);
    List<Report> findAllByStatusAndSellerAndCreatedAtBetween(ReportStatus status, User seller, Timestamp createdAt, Timestamp createdAt2);

    @Query(value = "select * from report where status <> 'DRAFT' and seller_id=:sellerId",nativeQuery = true)
    Page<Report> allReportByUserId(@Param(value = "sellerId") UUID sellerId,Pageable pageable);

    Page<Report> findAllBySellerIdAndStatus(UUID seller_id, ReportStatus status, Pageable pageable);
}
