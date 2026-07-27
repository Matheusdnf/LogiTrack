package logitrack.security;

import logitrack.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String emailOrUsername) throws UsernameNotFoundException {
        return usuarioRepository.findByEmail(emailOrUsername)
                .or(() -> usuarioRepository.findByUsername(emailOrUsername))
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado: " + emailOrUsername));
    }
}
