package logitrack.controller;

import jakarta.validation.Valid;
import logitrack.dto.UserCreateDTO;
import logitrack.dto.UserDTO;
import logitrack.dto.UserUpdateDTO;
import logitrack.model.Usuario;
import logitrack.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof Usuario loggedUser)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autenticado.");
        }
        if (!"ADMIN".equalsIgnoreCase(loggedUser.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Apenas administradores (ADMIN) podem visualizar a lista de usuários.");
        }

        List<UserDTO> users = usuarioRepository.findAll().stream()
                .map(u -> UserDTO.builder()
                        .id(u.getId())
                        .username(u.getNomeUsuario() != null ? u.getNomeUsuario() : u.getUsername())
                        .email(u.getEmail())
                        .role(u.getRole())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @PostMapping
    public ResponseEntity<?> createUser(@Valid @RequestBody UserCreateDTO request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof Usuario loggedUser)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autenticado.");
        }
        
        if (!"ADMIN".equalsIgnoreCase(loggedUser.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Apenas administradores (ADMIN) podem cadastrar novos usuários e definir cargos.");
        }

        if (usuarioRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Nome de usuário já existe.");
        }
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email já cadastrado.");
        }

        String role = request.getRole() != null ? request.getRole().toUpperCase() : "GESTOR";
        if (!"ADMIN".equals(role) && !"GESTOR".equals(role)) {
            return ResponseEntity.badRequest().body("Cargo inválido. Escolha ADMIN ou GESTOR.");
        }

        Usuario user = Usuario.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();
        
        usuarioRepository.save(user);

        UserDTO responseDto = UserDTO.builder()
                .id(user.getId())
                .username(user.getNomeUsuario())
                .email(user.getEmail())
                .role(user.getRole())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(responseDto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @Valid @RequestBody UserUpdateDTO request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof Usuario loggedUser)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autenticado.");
        }
        if (!"ADMIN".equalsIgnoreCase(loggedUser.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Apenas administradores (ADMIN) podem editar usuários.");
        }

        Usuario user = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        if (!user.getNomeUsuario().equals(request.getUsername()) && usuarioRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Nome de usuário já existe.");
        }
        if (!user.getEmail().equals(request.getEmail()) && usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email já cadastrado para outro usuário.");
        }

        String role = request.getRole() != null ? request.getRole().toUpperCase() : "GESTOR";
        if (!"ADMIN".equals(role) && !"GESTOR".equals(role)) {
            return ResponseEntity.badRequest().body("Cargo inválido. Escolha ADMIN ou GESTOR.");
        }

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setRole(role);

        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            if (request.getPassword().length() < 6) {
                return ResponseEntity.badRequest().body("A nova senha deve ter no mínimo 6 caracteres.");
            }
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        }

        usuarioRepository.save(user);

        UserDTO responseDto = UserDTO.builder()
                .id(user.getId())
                .username(user.getNomeUsuario())
                .email(user.getEmail())
                .role(user.getRole())
                .build();

        return ResponseEntity.ok(responseDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof Usuario loggedUser)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuário não autenticado.");
        }
        if (!"ADMIN".equalsIgnoreCase(loggedUser.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Apenas administradores (ADMIN) podem excluir usuários.");
        }

        Usuario user = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        if (user.getId().equals(loggedUser.getId())) {
            return ResponseEntity.badRequest().body("Você não pode excluir a si mesmo!");
        }

        usuarioRepository.delete(user);
        return ResponseEntity.noContent().build();
    }
}

