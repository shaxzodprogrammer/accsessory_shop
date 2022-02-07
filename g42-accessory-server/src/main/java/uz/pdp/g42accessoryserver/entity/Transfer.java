package uz.pdp.g42accessoryserver.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import uz.pdp.g42accessoryserver.entity.template.AbsEntity;

import javax.persistence.*;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Transfer extends AbsEntity {
    @ManyToOne
    private Warehouse fromWarehouse;

    @ManyToOne
    private Warehouse toWarehouse;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "transfer",cascade = CascadeType.ALL)
    private List<ProductWithAmount> productWithAmounts;

    private boolean accepted;

}
