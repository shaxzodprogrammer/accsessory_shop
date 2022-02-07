package uz.pdp.g42accessoryserver.component;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import uz.pdp.g42accessoryserver.entity.Role;
import uz.pdp.g42accessoryserver.entity.User;
import uz.pdp.g42accessoryserver.entity.enums.RoleName;
import uz.pdp.g42accessoryserver.repository.RoleRepository;
import uz.pdp.g42accessoryserver.repository.UserRepository;

import java.util.Collections;


@Component
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DataLoader implements CommandLineRunner {

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Value("${spring.datasource.initialization-mode}")
    private String mode;

    @Override
    public void run(String... args) throws Exception {
        if (mode.equals("always")){
            Role director = roleRepository.save(new Role(RoleName.ROLE_DIRECTOR));
            Role manager = roleRepository.save(new Role(RoleName.ROLE_MANAGER));
            Role seller = roleRepository.save(new Role(RoleName.ROLE_SELLER));
            userRepository.save(new User(
                    "Director",
                    "Director",
                    "+998993632587",
                    "director",
                    passwordEncoder.encode("director"),
                    Collections.singleton(director)
            ));
        }
    }
}
