package uz.pdp.g42accessoryserver.config;


import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import uz.pdp.g42accessoryserver.entity.User;

import java.util.Optional;
import java.util.UUID;

public class AuditorAwareImpl implements AuditorAware<UUID> {

    @Override
    public Optional<UUID> getCurrentAuditor() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!(authentication == null || !authentication.isAuthenticated()
                || "anonymousUser".equals("" + authentication.getPrincipal()))) {
            try {
                return Optional.of(((User) authentication.getPrincipal()).getId());
            }catch (Exception e){
                return Optional.empty();
            }
        }
        return Optional.empty();
    }
}
