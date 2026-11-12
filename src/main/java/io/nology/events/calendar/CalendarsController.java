package io.nology.events.calendar;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.nology.events.calendar.dtos.CalendarResponse;
import io.nology.events.calendar.entities.Calendar;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/calendars")
public class CalendarsController {
    private final CalendarService calendarService;

    public CalendarsController(CalendarService calendarService) {
        this.calendarService = calendarService;
    }

    @GetMapping()
    public ResponseEntity<List<CalendarResponse>> findAllCalendars() {
        List<Calendar> allCalendars = this.calendarService.findAll();
        return ResponseEntity.ok(CalendarResponse.of(allCalendars));
    }
    
}
