package uz.pdp.g42accessoryserver.payload;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import uz.pdp.g42accessoryserver.entity.enums.RoleName;

import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@Builder
public class UserDto {
    private UUID id;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private String username;
    private String password;
    private RoleName roleName;
    private List<RoleName> roleNameList;
    private boolean enable;

    public UserDto(UUID id, String firstName, String lastName, String phoneNumber, String username, List<RoleName> roleNameList,boolean enable) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.username = username;
        this.roleNameList = roleNameList;
        this.enable=enable;
    }

    public UserDto(UUID id, String firstName, String lastName, String phoneNumber, String username, String password, RoleName roleName, List<RoleName> roleNameList, boolean enable) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.phoneNumber = phoneNumber;
        this.username = username;
        this.password = password;
        this.roleName = roleName;
        this.roleNameList = roleNameList;
        this.enable = enable;
    }


}
