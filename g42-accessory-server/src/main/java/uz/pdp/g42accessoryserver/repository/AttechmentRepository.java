package uz.pdp.g42accessoryserver.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uz.pdp.g42accessoryserver.entity.Attechment;

import java.util.UUID;

public interface AttechmentRepository extends JpaRepository<Attechment, UUID> {
}
