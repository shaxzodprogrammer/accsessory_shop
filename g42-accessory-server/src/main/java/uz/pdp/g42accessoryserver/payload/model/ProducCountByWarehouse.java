package uz.pdp.g42accessoryserver.payload.model;

import javax.persistence.Convert;
import javax.persistence.Converter;
import java.util.List;
import java.util.UUID;


public interface ProducCountByWarehouse {
    UUID getId();
    String getName();
    List<Object[]> getAmount();
}
