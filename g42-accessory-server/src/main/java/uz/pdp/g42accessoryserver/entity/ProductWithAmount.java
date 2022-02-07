package uz.pdp.g42accessoryserver.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import uz.pdp.g42accessoryserver.entity.template.AbsEntity;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class ProductWithAmount extends AbsEntity {
    @ManyToOne
    private Product product;

    private int amount;

    @ManyToOne
    private Transfer transfer;

    @ManyToOne
    private Trade trade;

    @ManyToOne
    private Reject reject;

    @ManyToOne
    private Defect defect;

    private double realSoldPrice;
}
