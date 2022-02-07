package uz.pdp.g42accessoryserver.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import uz.pdp.g42accessoryserver.entity.Defect;
import uz.pdp.g42accessoryserver.entity.Reject;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

public interface DefectRepository extends JpaRepository<Defect, UUID> {
    Page<Defect> findAllByAccepted(boolean accepted, Pageable pageable);
    Page<Defect> findAllByAcceptedAndWarehouseId(boolean accepted, Integer warehouse_id, Pageable pageable);
    List<Defect> findAllByAcceptedAndCreatedAtBetween(boolean accepted, Timestamp createdAt, Timestamp createdAt2);
    List<Defect> findAllByAcceptedAndWarehouseIdAndCreatedAtBetween(boolean accepted, Integer warehouse_id, Timestamp createdAt, Timestamp createdAt2);
}
