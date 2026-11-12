package io.nology.events.event;

import java.util.List;

import org.springframework.stereotype.Service;

import io.nology.events.event.entities.Event;

@Service 
public class EventService {
    private EventRepository repo;    

    public EventService(EventRepository repo) {
        this.repo = repo;
    }

    public List<Event> findAll() {
        return this.repo.findAll();
    }
    
}
