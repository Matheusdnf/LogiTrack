package logitrack.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UtilizationRankingDTO {
    private Long veiculoId;
    private String placa;
    private String modelo;
    private String tipo;
    private BigDecimal kmAcumulado;
}
