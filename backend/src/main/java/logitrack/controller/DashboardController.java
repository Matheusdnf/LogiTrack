package logitrack.controller;

import logitrack.dto.DashboardSummaryDTO;
import logitrack.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public DashboardSummaryDTO getDashboardSummary(@RequestParam(required = false) Long vehicleId) {
        return dashboardService.getDashboardSummary(vehicleId);
    }
    
    @GetMapping("/km-total")
    public BigDecimal getTotalKm(@RequestParam(required = false) Long vehicleId) {
        return dashboardService.getTotalKm(vehicleId);
    }
}
