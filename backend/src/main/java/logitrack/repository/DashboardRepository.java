package logitrack.repository;

import logitrack.dto.CategoryVolumeDTO;
import logitrack.dto.MaintenanceScheduleDTO;
import logitrack.dto.UtilizationRankingDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class DashboardRepository {

    private final JdbcTemplate jdbcTemplate;

    // 1. Total KM Traveled (optional vehicle filter)
    public BigDecimal getTotalKm(Long vehicleId) {
        String sql = "SELECT COALESCE(SUM(km_percorrida), 0) FROM viagens";
        if (vehicleId != null) {
            sql += " WHERE veiculo_id = ?";
            return jdbcTemplate.queryForObject(sql, BigDecimal.class, vehicleId);
        }
        return jdbcTemplate.queryForObject(sql, BigDecimal.class);
    }

    // 2. Volume by Category (Light vs Heavy)
    public List<CategoryVolumeDTO> getCategoryVolume() {
        String sql = "SELECT ve.tipo as categoria, COUNT(vi.id) as total " +
                     "FROM veiculos ve " +
                     "LEFT JOIN viagens vi ON ve.id = vi.veiculo_id " +
                     "GROUP BY ve.tipo";
        
        return jdbcTemplate.query(sql, (rs, rowNum) -> new CategoryVolumeDTO(
                rs.getString("categoria"),
                rs.getLong("total")
        ));
    }

    // 3. Maintenance Schedule (next 5 upcoming)
    public List<MaintenanceScheduleDTO> getUpcomingMaintenances() {
        String sql = "SELECT m.id, ve.placa, m.data_inicio as dataAgendada, m.tipo_servico as descricao, m.custo_estimado as custoEstimado " +
                     "FROM manutencoes m " +
                     "JOIN veiculos ve ON ve.id = m.veiculo_id " +
                     "WHERE m.data_inicio >= CURRENT_DATE " +
                     "  AND m.status = 'PENDENTE' " +
                     "ORDER BY m.data_inicio ASC " +
                     "LIMIT 5";

        return jdbcTemplate.query(sql, (rs, rowNum) -> new MaintenanceScheduleDTO(
                rs.getLong("id"),
                rs.getString("placa"),
                rs.getDate("dataAgendada") != null ? rs.getDate("dataAgendada").toLocalDate() : null,
                rs.getString("descricao"),
                rs.getBigDecimal("custoEstimado")
        ));
    }

    // 3b. Maintenance Schedule (completed)
    public List<MaintenanceScheduleDTO> getCompletedMaintenances() {
        String sql = "SELECT m.id, ve.placa, m.data_finalizacao as dataAgendada, m.tipo_servico as descricao, m.custo_estimado as custoEstimado " +
                     "FROM manutencoes m " +
                     "JOIN veiculos ve ON ve.id = m.veiculo_id " +
                     "WHERE m.status = 'CONCLUIDA' " +
                     "ORDER BY m.data_finalizacao DESC " +
                     "LIMIT 10";

        return jdbcTemplate.query(sql, (rs, rowNum) -> new MaintenanceScheduleDTO(
                rs.getLong("id"),
                rs.getString("placa"),
                rs.getDate("dataAgendada") != null ? rs.getDate("dataAgendada").toLocalDate() : null,
                rs.getString("descricao"),
                rs.getBigDecimal("custoEstimado")
        ));
    }

    // 4. Utilization Ranking
    public List<UtilizationRankingDTO> getUtilizationRanking(int limit) {
        String sql = "SELECT ve.id as veiculo_id, ve.placa, ve.modelo, ve.tipo, COALESCE(SUM(vi.km_percorrida), 0) AS km_acumulado " +
                     "FROM veiculos ve " +
                     "LEFT JOIN viagens vi ON ve.id = vi.veiculo_id " +
                     "GROUP BY ve.id, ve.placa, ve.modelo, ve.tipo " +
                     "ORDER BY km_acumulado DESC " +
                     "LIMIT ?";

        return jdbcTemplate.query(sql, (rs, rowNum) -> new UtilizationRankingDTO(
                rs.getLong("veiculo_id"),
                rs.getString("placa"),
                rs.getString("modelo"),
                rs.getString("tipo"),
                rs.getBigDecimal("km_acumulado")
        ), limit);
    }

    // 5. Financial Projection (Current Month)
    public BigDecimal getMonthlyMaintenanceProjection() {
        String sql = "SELECT COALESCE(SUM(m.custo_estimado), 0) AS custo_total_mes " +
                     "FROM manutencoes m " +
                     "WHERE EXTRACT(YEAR FROM m.data_inicio) = EXTRACT(YEAR FROM CURRENT_DATE) " +
                     "  AND EXTRACT(MONTH FROM m.data_inicio) = EXTRACT(MONTH FROM CURRENT_DATE)";

        return jdbcTemplate.queryForObject(sql, BigDecimal.class);
    }
}
