package uz.pdp.g42accessoryserver.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import uz.pdp.g42accessoryserver.entity.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);
    List<User> getAllByRolesNotContaining(String roleName);
    @Query(value = "select * from users where   username=:uname",nativeQuery = true)
    List<User> byUsername(@Param(value = "uname") String uname);
}
