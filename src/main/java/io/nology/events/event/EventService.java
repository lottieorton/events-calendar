package io.nology.events.event;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import io.nology.events.calendar.CalendarService;
import io.nology.events.calendar.entities.Calendar;
import io.nology.events.common.exceptions.UnprocessableContentException;
import io.nology.events.event.dtos.CreateEventRequest;
import io.nology.events.event.entities.Event;

@Service 
public class EventService {
    private EventRepository repo;
    private CalendarService calendarService;

    public EventService(EventRepository repo, CalendarService calendarService) {
        this.repo = repo;
        this.calendarService = calendarService;
    }

    public List<Event> findAll() {
        return this.repo.findAll();
    }

    public Event create(CreateEventRequest data) {
        Calendar foundCalendar = resolveCalendar(data.calendarId());
        validateDates(data.startAt(), data.endAt());

        Event createdEvent = new Event(data.title(), data.description(), foundCalendar, data.startAt(), data.endAt(), data.isAllDay());

        this.repo.saveAndFlush(createdEvent);
        return createdEvent;
    }

    private Calendar resolveCalendar(Long id) {
        Optional<Calendar> returnedCalendar = this.calendarService.findById(id);
        if(returnedCalendar.isEmpty()) {
            throw new UnprocessableContentException("No calendar with id " + id);
        }
        return returnedCalendar.get();
    }
    
    private void validateDates(Instant startAt, Instant endAt) {
        if (startAt.isAfter(endAt) || startAt.equals(endAt)) {
            throw new UnprocessableContentException("End At date and time must be after Start At date and time");
        }
    }
}
