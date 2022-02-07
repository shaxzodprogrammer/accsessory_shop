package uz.pdp.g42accessoryserver.entity;

import lombok.*;
import uz.pdp.g42accessoryserver.entity.template.AbsNameEntity;

import javax.persistence.*;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class Category extends AbsNameEntity {
    @ManyToOne
    private Category parent;

    @OneToMany(fetch = FetchType.LAZY,mappedBy = "parent",cascade = CascadeType.ALL)
    private List<Category> children;

}
