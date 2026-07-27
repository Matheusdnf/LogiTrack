package logitrack.service.impl;

import logitrack.model.Trip;
import logitrack.model.Vehicle;
import logitrack.dto.TripRequestDTO;
import logitrack.dto.TripResponseDTO;
import logitrack.dto.VehicleDTO;
import logitrack.exception.BusinessRuleException;
import logitrack.exception.ResourceNotFoundException;
import logitrack.repository.TripRepository;
import logitrack.repository.VehicleRepository;
import logitrack.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TripServiceImpl implements TripService {

    private final TripRepository tripRepository;
    private final VehicleRepository vehicleRepository;

    @Override
    @Transactional
    public TripResponseDTO create(TripRequestDTO request) {
        validateDates(request);
        Vehicle veiculo = vehicleRepository.findById(request.getVeiculoId())
                .orElseThrow(() -> new ResourceNotFoundException("Veículo não encontrado com o ID: " + request.getVeiculoId()));

        Trip trip = Trip.builder()
                .veiculo(veiculo)
                .dataSaida(request.getDataSaida())
                .dataChegada(request.getDataChegada())
                .origem(request.getOrigem())
                .destino(request.getDestino())
                .kmPercorrida(request.getKmPercorrida())
                .build();

        return toDTO(tripRepository.save(trip));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TripResponseDTO> findAll() {
        return tripRepository.findAllWithVehicle().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TripResponseDTO findById(Long id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Viagem não encontrada com o ID: " + id));
        return toDTO(trip);
    }

    @Override
    @Transactional
    public TripResponseDTO update(Long id, TripRequestDTO request) {
        validateDates(request);
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Viagem não encontrada com o ID: " + id));

        Vehicle veiculo = vehicleRepository.findById(request.getVeiculoId())
                .orElseThrow(() -> new ResourceNotFoundException("Veículo não encontrado com o ID: " + request.getVeiculoId()));

        trip.setVeiculo(veiculo);
        trip.setDataSaida(request.getDataSaida());
        trip.setDataChegada(request.getDataChegada());
        trip.setOrigem(request.getOrigem());
        trip.setDestino(request.getDestino());
        trip.setKmPercorrida(request.getKmPercorrida());

        return toDTO(tripRepository.save(trip));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        if (!tripRepository.existsById(id)) {
            throw new ResourceNotFoundException("Viagem não encontrada com o ID: " + id);
        }
        tripRepository.deleteById(id);
    }

    private void validateDates(TripRequestDTO request) {
        if (request.getDataChegada() != null && request.getDataChegada().isBefore(request.getDataSaida())) {
            throw new BusinessRuleException("A data de chegada não pode ser anterior à data de saída.");
        }
    }

    private TripResponseDTO toDTO(Trip trip) {
        Vehicle veiculo = trip.getVeiculo();
        VehicleDTO veiculoDTO = null;
        if (veiculo != null) {
            veiculoDTO = VehicleDTO.builder()
                    .id(veiculo.getId())
                    .placa(veiculo.getPlaca())
                    .modelo(veiculo.getModelo())
                    .tipo(veiculo.getTipo())
                    .ano(veiculo.getAno())
                    .build();
        }

        return TripResponseDTO.builder()
                .id(trip.getId())
                .veiculo(veiculoDTO)
                .dataSaida(trip.getDataSaida())
                .dataChegada(trip.getDataChegada())
                .origem(trip.getOrigem())
                .destino(trip.getDestino())
                .kmPercorrida(trip.getKmPercorrida())
                .build();
    }
}
