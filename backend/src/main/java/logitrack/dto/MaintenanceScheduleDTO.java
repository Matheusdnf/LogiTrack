package logitrack.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceScheduleDTO {
    private Long id;
    private String placa;
    private LocalDate dataAgendada;
    private String descricao;
    private BigDecimal custoEstimado;
}
