package uz.pdp.g42accessoryserver.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uz.pdp.g42accessoryserver.entity.Defect;
import uz.pdp.g42accessoryserver.entity.Reject;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Repository
public interface RejectRepository extends JpaRepository<Reject, UUID> {
    Page<Reject> findAllByAccepted(boolean accepted, Pageable pageable);
    List<Reject> findAllByAcceptedAndCreatedAtBetween(boolean accepted, Timestamp createdAt, Timestamp createdAt2);
    Page<Reject> findAllByAcceptedAndWarehouseId(boolean accepted, Integer warehouse_id, Pageable pageable);
    List<Reject> findAllByAcceptedAndWarehouseIdAndCreatedAtBetween(boolean accepted, Integer warehouse_id, Timestamp createdAt, Timestamp createdAt2);
}
