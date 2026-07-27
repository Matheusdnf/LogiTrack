package logitrack.controller;

import logitrack.dto.AuthRequest;
import logitrack.dto.AuthResponse;
import logitrack.dto.RegisterRequest;
import logitrack.model.Usuario;
import logitrack.repository.UsuarioRepository;
import logitrack.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        String loginIdentifier = request.getEmail() != null ? request.getEmail() : request.getUsername();
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginIdentifier,
                        request.getPassword()
                )
        );
        var user = usuarioRepository.findByEmail(loginIdentifier)
                .or(() -> usuarioRepository.findByUsername(loginIdentifier))
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        var jwtToken = jwtService.generateToken(user);
        
        ResponseCookie cookie = ResponseCookie.from("jwt", jwtToken)
                .httpOnly(true)
                .secure(false) // deve ser false em localhost http
                .path("/")
                .maxAge(24 * 60 * 60)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new AuthResponse(jwtToken, user.getUsername(), user.getRole()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (usuarioRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Nome de usuário já existe");
        }
        if (usuarioRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Credenciais invalidas");
        }

        var user = Usuario.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role("GESTOR")
                .build();
        usuarioRepository.save(user);

        var jwtToken = jwtService.generateToken(user);
        
        ResponseCookie cookie = ResponseCookie.from("jwt", jwtToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(24 * 60 * 60)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new AuthResponse(jwtToken, user.getUsername(), user.getRole()));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe() {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            if (auth.getPrincipal() instanceof Usuario usuario) {
                return ResponseEntity.ok(java.util.Map.of(
                        "username", usuario.getNomeUsuario() != null ? usuario.getNomeUsuario() : usuario.getEmail(),
                        "email", usuario.getEmail() != null ? usuario.getEmail() : "",
                        "role", usuario.getRole() != null ? usuario.getRole() : "GESTOR"
                ));
            }
            return ResponseEntity.ok(java.util.Map.of("username", auth.getName(), "role", "GESTOR"));
        }
        return ResponseEntity.status(401).body("Não logado");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0) // Expira imediatamente
                .build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(java.util.Map.of("message", "Deslogado com sucesso"));
    }
}
