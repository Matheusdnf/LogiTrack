package logitrack.service.impl;

import logitrack.model.Vehicle;
import logitrack.dto.VehicleDTO;
import logitrack.repository.VehicleRepository;
import logitrack.service.VehicleService;
import logitrack.exception.ResourceNotFoundException;
import logitrack.exception.BusinessRuleException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;

    @Override
    public List<VehicleDTO> findAll() {
        return vehicleRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public VehicleDTO create(VehicleDTO request) {
        if (!"LEVE".equalsIgnoreCase(request.getTipo()) && !"PESADO".equalsIgnoreCase(request.getTipo())) {
            throw new BusinessRuleException("O tipo de veículo deve ser restrito a LEVE ou PESADO.");
        }
        Vehicle vehicle = Vehicle.builder()
                .placa(request.getPlaca())
                .modelo(request.getModelo())
                .tipo(request.getTipo().toUpperCase())
                .ano(request.getAno())
                .build();
        Vehicle saved = vehicleRepository.save(vehicle);
        return toDTO(saved);
    }

    @Override
    public VehicleDTO update(Long id, VehicleDTO request) {
        if (!"LEVE".equalsIgnoreCase(request.getTipo()) && !"PESADO".equalsIgnoreCase(request.getTipo())) {
            throw new BusinessRuleException("O tipo de veículo deve ser restrito a LEVE ou PESADO.");
        }
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Veículo não encontrado"));
        
        // Verifica se a nova placa já existe e não é do próprio veículo
        vehicleRepository.findAll().stream()
                .filter(v -> v.getPlaca().equalsIgnoreCase(request.getPlaca()) && !v.getId().equals(id))
                .findFirst()
                .ifPresent(v -> {
                    throw new BusinessRuleException("Já existe um veículo com esta placa");
                });

        vehicle.setPlaca(request.getPlaca());
        vehicle.setModelo(request.getModelo());
        vehicle.setTipo(request.getTipo().toUpperCase());
        vehicle.setAno(request.getAno());

        Vehicle updated = vehicleRepository.save(vehicle);
        return toDTO(updated);
    }

    @Override
    public void delete(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Veículo não encontrado"));
        vehicleRepository.delete(vehicle);
    }

    private VehicleDTO toDTO(Vehicle vehicle) {
        return VehicleDTO.builder()
                .id(vehicle.getId())
                .placa(vehicle.getPlaca())
                .modelo(vehicle.getModelo())
                .tipo(vehicle.getTipo())
                .ano(vehicle.getAno())
                .build();
    }
}
