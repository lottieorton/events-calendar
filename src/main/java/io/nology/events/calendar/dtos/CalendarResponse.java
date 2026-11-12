package io.nology.events.calendar.dtos;

import java.util.List;

import io.nology.events.calendar.entities.Calendar;
import io.nology.events.calendar.entities.CalendarColor;

public record CalendarResponse(Long id, String name, CalendarColor color) {
    public static CalendarResponse of(Calendar calendar) {
        return new CalendarResponse(calendar.getId(), calendar.getName(),calendar.getColor());
    }

    public static List<CalendarResponse> of(List<Calendar> calendars) {
        return calendars.stream().map(c -> CalendarResponse.of(c)).toList();
    }
}
