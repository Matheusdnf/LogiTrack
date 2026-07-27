package logitrack.controller;

import logitrack.dto.TripRequestDTO;
import logitrack.dto.TripResponseDTO;
import logitrack.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/trips")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TripResponseDTO create(@Valid @RequestBody TripRequestDTO request) {
        return tripService.create(request);
    }

    @GetMapping
    public List<TripResponseDTO> findAll() {
        return tripService.findAll();
    }

    @GetMapping("/{id}")
    public TripResponseDTO findById(@PathVariable Long id) {
        return tripService.findById(id);
    }

    @PutMapping("/{id}")
    public TripResponseDTO update(@PathVariable Long id, @Valid @RequestBody TripRequestDTO request) {
        return tripService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        tripService.delete(id);
    }
}
