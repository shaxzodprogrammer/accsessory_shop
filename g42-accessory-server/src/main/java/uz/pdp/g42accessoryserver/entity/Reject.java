package uz.pdp.g42accessoryserver.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
import uz.pdp.g42accessoryserver.entity.template.AbsEntity;
import uz.pdp.g42accessoryserver.entity.template.AbsNameEntity;

import javax.persistence.*;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Reject extends AbsEntity {

    private double rejectTotalSum;

    @ManyToOne
    private Warehouse warehouse;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "reject",cascade = CascadeType.ALL)
    private List<ProductWithAmount> productWithAmounts;

    private boolean accepted;

    @ManyToOne(fetch = FetchType.LAZY)
    private User seller;

    @ManyToOne(fetch = FetchType.LAZY)
    private User manager;
}
