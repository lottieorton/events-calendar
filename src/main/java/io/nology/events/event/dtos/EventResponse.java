package io.nology.events.event.dtos;

import java.time.Instant;
import java.util.List;

import io.nology.events.calendar.dtos.CalendarResponse;
import io.nology.events.event.entities.Event;

public record EventResponse(Long id, String title, String description, CalendarResponse calendar, Instant startAt, Instant endAt, Boolean isAllDay) {
    public static EventResponse of(Event event) {
        return new EventResponse(event.getId(), event.getTitle(), event.getDescription(), CalendarResponse.of(event.getCalendar()), event.getStartAt(), event.getEndAt(), event.getIsAllDay());
    }

    public static List<EventResponse> of(List<Event> events) {
        return events.stream().map(e -> EventResponse.of(e)).toList();
    }
}
