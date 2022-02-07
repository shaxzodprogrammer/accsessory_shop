package uz.pdp.g42accessoryserver.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
import uz.pdp.g42accessoryserver.entity.enums.ReportStatus;
import uz.pdp.g42accessoryserver.entity.template.AbsEntity;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.ManyToOne;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Report extends AbsEntity {
    @ManyToOne
    private Shop shop;

    @ManyToOne
    private User seller;

    @ManyToOne
    private User managerOrDirector;

    @Enumerated(value = EnumType.STRING)
    private ReportStatus status;

    private double totalSum=0;

}
