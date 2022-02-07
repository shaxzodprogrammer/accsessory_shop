package uz.pdp.g42accessoryserver.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
import uz.pdp.g42accessoryserver.entity.template.AbsEntity;

import javax.persistence.*;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Defect extends AbsEntity {

    @ManyToOne
    private Warehouse warehouse;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "defect",cascade = CascadeType.ALL)
    private List<ProductWithAmount> productWithAmounts;

    private boolean accepted;
}
