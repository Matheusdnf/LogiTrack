package logitrack.service;

import logitrack.dto.TripRequestDTO;
import logitrack.dto.TripResponseDTO;

import java.util.List;

public interface TripService {
    TripResponseDTO create(TripRequestDTO request);
    List<TripResponseDTO> findAll();
    TripResponseDTO findById(Long id);
    TripResponseDTO update(Long id, TripRequestDTO request);
    void delete(Long id);
}
