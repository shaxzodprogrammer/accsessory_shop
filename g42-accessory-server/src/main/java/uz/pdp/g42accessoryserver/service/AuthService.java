package uz.pdp.g42accessoryserver.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import uz.pdp.g42accessoryserver.entity.User;
import uz.pdp.g42accessoryserver.payload.ApiResponse;
import uz.pdp.g42accessoryserver.payload.ResToken;
import uz.pdp.g42accessoryserver.payload.SignIn;
import uz.pdp.g42accessoryserver.repository.UserRepository;
import uz.pdp.g42accessoryserver.secret.JwtTokenProvider;

import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AuthService implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    JwtTokenProvider jwtTokenProvider;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    DtoService dtoService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException(username + " not found"));
    }

    public User loadByUserId(UUID userId) {
        return userRepository.findById(userId).orElseThrow(() -> new IllegalStateException("user not found"));
    }

    public ResToken signIn(SignIn signIn) {
        try {
            System.out.println("sign in " + signIn.getPassword());
            System.out.println("sign in " + signIn.getUsername());
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(signIn.getUsername(), signIn.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            User principal = (User) authentication.getPrincipal();
            String jwt = jwtTokenProvider.generateToken(principal);
            return new ResToken(jwt);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public ApiResponse searchUser(String search) {
        return new ApiResponse("Ok", true, userRepository.byUsername(search));
    }

    public ApiResponse all() {
        return new ApiResponse("Ok", true, userRepository.findAll().stream().map(item -> dtoService.userDto(item)).collect(Collectors.toList()));
    }
}
