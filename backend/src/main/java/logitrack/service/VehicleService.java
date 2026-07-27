package logitrack.service;

import logitrack.dto.VehicleDTO;
import java.util.List;

public interface VehicleService {
    List<VehicleDTO> findAll();
    VehicleDTO create(VehicleDTO request);
    VehicleDTO update(Long id, VehicleDTO request);
    void delete(Long id);
}
