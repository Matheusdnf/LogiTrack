package logitrack.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserUpdateDTO {
    @NotBlank(message = "O nome de usuário não pode estar vazio")
    @Size(min = 3, message = "O nome de usuário deve ter no mínimo 3 caracteres")
    private String username;

    @NotBlank(message = "O email não pode estar vazio")
    @Email(message = "Formato de email inválido")
    private String email;

    // Senha opcional na edição
    private String password;

    @NotBlank(message = "O cargo (role) deve ser informado (ex: ADMIN, GESTOR)")
    private String role;
}
