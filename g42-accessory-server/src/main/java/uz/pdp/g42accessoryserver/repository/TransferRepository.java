package uz.pdp.g42accessoryserver.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import uz.pdp.g42accessoryserver.entity.Product;
import uz.pdp.g42accessoryserver.entity.Transfer;
import uz.pdp.g42accessoryserver.entity.Warehouse;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

public interface TransferRepository extends JpaRepository<Transfer, UUID> {
    Page<Transfer> findAllByFromWarehouseIsNullAndAccepted(boolean accepted, Pageable pageable);
    Page<Transfer> findAllByAccepted(boolean accepted, Pageable pageable);
    List<Transfer> findAllByAcceptedAndCreatedAtBetween(boolean accepted, Timestamp createdAt, Timestamp createdAt2);
    Page<Transfer> findAllByToWarehouseAndAccepted(Warehouse toWarehouse, boolean accepted, Pageable pageable);
    List<Transfer> findAllByToWarehouseAndAcceptedAndCreatedAtBetween(Warehouse toWarehouse, boolean accepted, Timestamp createdAt, Timestamp createdAt2);
    Page<Transfer> findAllByFromWarehouseAndAccepted(Warehouse fromWarehouse, boolean accepted, Pageable pageable);
    List<Transfer> findAllByFromWarehouseAndAcceptedAndCreatedAtBetween(Warehouse fromWarehouse, boolean accepted, Timestamp createdAt, Timestamp createdAt2);
    Page<Transfer> findAllByFromWarehouseIsNotNullAndAccepted(boolean accepted, Pageable pageable);
    List<Transfer> findAllByAcceptedAndCreatedAtBetweenAndFromWarehouseIsNotNull(boolean accepted, Timestamp createdAt, Timestamp createdAt2);
}
