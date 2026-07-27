package logitrack.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleDTO {
    private Long id;

    @NotBlank(message = "A placa é obrigatória")
    @Pattern(regexp = "^[A-Z]{3}-?\\d[A-Z0-9]\\d{2}$", message = "Formato de placa inválido (Use AAA-1234)")
    private String placa;

    @NotBlank(message = "O modelo é obrigatório")
    private String modelo;

    @NotNull(message = "O tipo do veículo é obrigatório")
    @Pattern(regexp = "^(LEVE|PESADO)$", message = "O tipo do veículo deve ser LEVE ou PESADO")
    private String tipo;

    @NotNull(message = "O ano é obrigatório")
    private Integer ano;
}
