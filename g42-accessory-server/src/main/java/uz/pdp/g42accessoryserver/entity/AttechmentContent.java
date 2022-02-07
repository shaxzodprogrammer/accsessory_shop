package uz.pdp.g42accessoryserver.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.pdp.g42accessoryserver.entity.template.AbsEntity;

import javax.persistence.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
public class AttechmentContent extends AbsEntity {

    @Column(nullable = false)
    private byte[] bytes;
    @OneToOne(optional = false)
    private Attechment attechment;
}
