package io.nology.events.event;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.nology.events.event.dtos.CreateEventRequest;
import io.nology.events.event.dtos.EventResponse;
import io.nology.events.event.entities.Event;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;



@RestController 
@RequestMapping("/events")
@Tag(name = "Events Controller")
public class EventsController {
    private final EventService eventService;

    public EventsController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping()
    public ResponseEntity<List<EventResponse>> findAllEvents() {
        List<Event> allEvents = this.eventService.findAll();
        return ResponseEntity.ok(EventResponse.of(allEvents));
    }

    @PostMapping()
    public ResponseEntity<EventResponse> createEvent(@Valid @RequestBody CreateEventRequest data) {
        Event result = this.eventService.create(data);
        return new ResponseEntity<EventResponse>(EventResponse.of(result), HttpStatus.CREATED);
    }
    
    
}
