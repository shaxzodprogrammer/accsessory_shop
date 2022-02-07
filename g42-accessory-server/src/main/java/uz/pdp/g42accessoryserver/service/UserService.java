package uz.pdp.g42accessoryserver.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import uz.pdp.g42accessoryserver.entity.Role;
import uz.pdp.g42accessoryserver.entity.User;
import uz.pdp.g42accessoryserver.entity.enums.RoleName;
import uz.pdp.g42accessoryserver.payload.ApiResponse;
import uz.pdp.g42accessoryserver.payload.UserDto;
import uz.pdp.g42accessoryserver.repository.RoleRepository;
import uz.pdp.g42accessoryserver.repository.UserRepository;
import uz.pdp.g42accessoryserver.utills.CommonUtills;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {
    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    RoleRepository roleRepository;

    public ApiResponse saveOrEdit(UserDto dto, User currentUser) {
        try {
            User user = new User();
            if (dto.getId() != null) {
                user = userRepository.findById(dto.getId()).orElseThrow(() -> new IllegalStateException("User not found"));
            }else {
                if (!hasRole(currentUser,RoleName.ROLE_DIRECTOR)){
                    return new ApiResponse("Error", false);
                }
            }
            user.setFirstName(dto.getFirstName());
            user.setLastName(dto.getLastName());
            user.setPhoneNumber(dto.getPhoneNumber());
            user.setUsername(dto.getUsername());
            if (dto.getPassword() != null) {
                user.setPassword(passwordEncoder.encode(dto.getPassword()));
            }
            if (dto.getRoleName() != null && !dto.getRoleName().equals(RoleName.ROLE_DIRECTOR)) {
                user.setRoles(new HashSet<>(Collections.singletonList(roleRepository.findByRoleName(dto.getRoleName()))));
            }
            userRepository.save(user);
            return new ApiResponse(dto.getId() != null ? "Edited" : "Saved", true);
        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse("Error", false);
        }
    }

    public ApiResponse changePassword(String oldPassword, String newPassword, User user) {
        try {
            if (passwordEncoder.matches(user.getPassword(), oldPassword)) {
                user.setPassword(passwordEncoder.encode(newPassword));
                userRepository.save(user);
                return new ApiResponse("Ok", true);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ApiResponse("Error", false);
    }

    public boolean hasRole(User user, RoleName roleName) {
        for (Role role : user.getRoles()) {
            if (role.getRoleName().equals(roleName))
                return true;
        }
        return false;
    }

    public ApiResponse changeActive(UUID id) {
        try {
            User user = userRepository.findById(id).orElseThrow(() -> new IllegalStateException("User not found"));
            user.setEnabled(!user.isEnabled());
            userRepository.save(user);
            return new ApiResponse(user.isEnabled()?"Activated":"Blocked", true);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ApiResponse("Error", false);
    }

    public ApiResponse remove(UUID id) {
        try {
            userRepository.deleteById(id);
            return new ApiResponse("Deleted", true);
        } catch (Exception e) {
            e.printStackTrace();
            return new ApiResponse("Error", false);
        }
    }

    public ApiResponse all(Integer page, Integer size) throws IllegalAccessException {
        Page<User> all = userRepository.findAll(CommonUtills.getPageableByCreatedAtDesc(page, size));
//        return new ApiResponse("Ok",true,all.getContent().stream().filter(item->!item.getRoles().contains(roleRepository.findByRoleName(RoleName.ROLE_DIRECTOR))).map(this::getUserDto).collect(Collectors.toList()),all.getTotalElements(),all.getTotalPages());
        return new ApiResponse("Ok",true,all.getContent().stream().map(this::getUserDto).collect(Collectors.toList()),all.getTotalElements(),all.getTotalPages());
    }

    public ApiResponse all_seller(Integer page, Integer size) throws IllegalAccessException {
        List<User> all = userRepository.findAll().stream().filter(item->item.getRoles().contains(roleRepository.findByRoleName(RoleName.ROLE_SELLER))&&item.isEnabled()).collect(Collectors.toList());

        return new ApiResponse("Ok",true,all.stream().map(this::getUserDto).collect(Collectors.toList()));
    }

    public UserDto getUserDto(User user){
        UserDto dto= new UserDto(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getPhoneNumber(),
                user.getUsername(),
                user.getRoles().stream().map(Role::getRoleName).collect(Collectors.toList()),
                user.isEnabled()
        );
        dto.setRoleName(getUserRoleName(user));
        return dto;
    }
    public RoleName getUserRoleName(User user){
        for (Role role : user.getRoles()) {
            return role.getRoleName();
        }
        return null;
    }


}
