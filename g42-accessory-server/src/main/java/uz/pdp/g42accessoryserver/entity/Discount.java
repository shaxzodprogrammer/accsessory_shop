package uz.pdp.g42accessoryserver.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import uz.pdp.g42accessoryserver.entity.enums.DiscountType;
import uz.pdp.g42accessoryserver.entity.template.AbsEntity;

import javax.persistence.*;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Discount extends AbsEntity {

    @Enumerated(EnumType.STRING)
    private DiscountType discountType;

    private double amount;
}
