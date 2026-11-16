package io.nology.events.event;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import io.nology.events.event.entities.Event;

public interface EventRepository extends JpaRepository<Event, Long> {

    @EntityGraph(attributePaths = "calendar")
    List<Event> findAll();

}
