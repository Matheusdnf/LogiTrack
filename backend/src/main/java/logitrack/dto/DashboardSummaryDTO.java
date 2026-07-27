package logitrack.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardSummaryDTO {
    private BigDecimal totalKm;
    private List<CategoryVolumeDTO> volumePorCategoria;
    private List<MaintenanceScheduleDTO> proximasManutencoes;
    private List<UtilizationRankingDTO> rankingUtilizacao;
    private BigDecimal projecaoFinanceiraMes;
    private List<MaintenanceScheduleDTO> manutencoesConcluidas;
}
