package uz.pdp.g42accessoryserver.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.pdp.g42accessoryserver.entity.template.AbsEntity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
public class Attechment extends AbsEntity {


    private String originalName;

    private long size;

    private String contentType;

    private String fileName;
    private String path;
}
