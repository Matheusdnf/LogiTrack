package logitrack.controller;

import logitrack.dto.VehicleDTO;
import logitrack.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    @GetMapping
    public List<VehicleDTO> findAll() {
        return vehicleService.findAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VehicleDTO create(@Valid @RequestBody VehicleDTO request) {
        return vehicleService.create(request);
    }

    @PutMapping("/{id}")
    public VehicleDTO update(@PathVariable Long id, @Valid @RequestBody VehicleDTO request) {
        return vehicleService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        vehicleService.delete(id);
    }
}
