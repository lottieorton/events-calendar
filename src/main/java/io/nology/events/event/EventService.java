package io.nology.events.event;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.openapitools.jackson.nullable.JsonNullable;
import org.springframework.stereotype.Service;

import io.nology.events.calendar.CalendarService;
import io.nology.events.calendar.entities.Calendar;
import io.nology.events.common.exceptions.UnprocessableContentException;
import io.nology.events.common.utils.JsonNullableUtils;
import io.nology.events.common.utils.TextUtils;
import io.nology.events.event.dtos.CreateEventRequest;
import io.nology.events.event.dtos.UpdateEventRequest;
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

    public Optional<Event> findById(Long id) {
        return this.repo.findById(id);
    }

    public Event create(CreateEventRequest data) {
        Calendar foundCalendar = resolveCalendar(data.calendarId());
        validateDates(data.startAt(), data.endAt());

        Event createdEvent = new Event(data.title(), data.description(), foundCalendar, data.startAt(), data.endAt(), data.isAllDay());

        this.repo.saveAndFlush(createdEvent);
        return createdEvent;
    }

    public Optional<Event> updateById(Long id, UpdateEventRequest data) {
        Optional<Event> result = this.findById(id);
        if(result.isEmpty()) {
            return result;
        }
        Event event = result.get();

        Instant startAt = Optional.ofNullable(data.startAt()).filter(JsonNullable::isPresent).map(JsonNullable::get).orElse(event.getStartAt());
        Instant endAt = Optional.ofNullable(data.endAt()).filter(JsonNullable::isPresent).map(JsonNullable::get).orElse(event.getEndAt());
        validateDates(startAt, endAt);

        JsonNullableUtils.updateNonNull(data.title(), event::setTitle);
        JsonNullableUtils.update(data.description(), TextUtils::blankToNull, event::setDescription);
        JsonNullableUtils.updateNonNull(data.calendarId(), calendarId -> {
            Calendar calendar = resolveCalendar(calendarId);
            event.setCalendar(calendar);
        });

        JsonNullableUtils.updateNonNull(data.startAt(), event::setStartAt);
        JsonNullableUtils.updateNonNull(data.endAt(), event::setEndAt);
        JsonNullableUtils.updateNonNull(data.isAllDay(), event::setIsAllDay);

        this.repo.saveAndFlush(event);

        return Optional.of(event);
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
