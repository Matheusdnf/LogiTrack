package logitrack.service;

import logitrack.dto.DashboardSummaryDTO;
import logitrack.repository.DashboardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final DashboardRepository dashboardRepository;

    public DashboardSummaryDTO getDashboardSummary(Long vehicleId) {
        return DashboardSummaryDTO.builder()
                .totalKm(dashboardRepository.getTotalKm(vehicleId))
                .volumePorCategoria(dashboardRepository.getCategoryVolume())
                .proximasManutencoes(dashboardRepository.getUpcomingMaintenances())
                .rankingUtilizacao(dashboardRepository.getUtilizationRanking(10))
                .projecaoFinanceiraMes(dashboardRepository.getMonthlyMaintenanceProjection())
                .manutencoesConcluidas(dashboardRepository.getCompletedMaintenances())
                .build();
    }
    
    public BigDecimal getTotalKm(Long vehicleId) {
        return dashboardRepository.getTotalKm(vehicleId);
    }
}
