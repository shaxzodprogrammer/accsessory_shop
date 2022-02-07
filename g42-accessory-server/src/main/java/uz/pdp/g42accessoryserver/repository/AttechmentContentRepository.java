package uz.pdp.g42accessoryserver.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import uz.pdp.g42accessoryserver.entity.Attechment;
import uz.pdp.g42accessoryserver.entity.AttechmentContent;

import java.util.UUID;

public interface AttechmentContentRepository extends JpaRepository<AttechmentContent, UUID> {
    AttechmentContent findByAttechment(Attechment attechment);
}
