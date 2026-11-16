package io.nology.events.event;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.nology.events.event.dtos.EventResponse;
import io.nology.events.event.entities.Event;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;


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
    
}
