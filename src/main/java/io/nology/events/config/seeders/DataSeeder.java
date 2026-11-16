package io.nology.events.config.seeders;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import io.nology.events.calendar.CalendarRepository;
import io.nology.events.calendar.entities.Calendar;
import io.nology.events.calendar.entities.CalendarColor;
import io.nology.events.event.EventRepository;
import io.nology.events.event.entities.Event;

@Component 
@Profile({"dev"})
public class DataSeeder implements CommandLineRunner {
    private final CalendarRepository calendarRepo;

    private final EventRepository eventRepo;

    private record CalendarSeedData(String name, CalendarColor color) {}

    public DataSeeder(CalendarRepository calendarRepo, EventRepository eventRepo) {
        this.calendarRepo = calendarRepo;
        this.eventRepo = eventRepo;
    }

    @Override
    public void run(String... args) throws Exception {
        List<Calendar> calendars = seedCalendars();
        seedEvents(calendars);
    }

    private List<Calendar> seedCalendars() {
        if(calendarRepo.count() > 0) {
            return calendarRepo.findAll();
        };
        
        List<CalendarSeedData> calendarData = List.of(
            new CalendarSeedData("Personal", CalendarColor.PURPLE),
            new CalendarSeedData("Family", CalendarColor.BLUE),
            new CalendarSeedData("Work", CalendarColor.GREEN)
        );

        List<Calendar> calendarsToSave = new ArrayList<>();

        for(CalendarSeedData calendar: calendarData) {
            Calendar newCalendar = new Calendar();
            newCalendar.setName(calendar.name());
            newCalendar.setColor(calendar.color());
            calendarsToSave.add(newCalendar);
        }
        calendarRepo.saveAllAndFlush(calendarsToSave);
        return calendarsToSave;

    }
    
    private void seedEvents(List<Calendar> calendars) {
        if(eventRepo.count() > 0) {
            return;
        };

        Event event1 = createEvent("Go to the gym", "Attend the HIIT Class. Remember to bring a towel.", calendars.get(0), Instant.parse("2026-11-12T17:00:00Z"), Instant.parse("2026-11-12T18:00:00Z"), false);
        eventRepo.saveAndFlush(event1);
        Event event2 = createEvent("Beach day", "Drive down to Wattamola beach with a picnic.", calendars.get(1), LocalDate.of(2026, 11, 12).atStartOfDay(ZoneId.of("Australia/Sydney")).toInstant(), LocalDate.of(2026, 11, 13).atStartOfDay(ZoneId.of("Australia/Sydney")).toInstant(), true);
        eventRepo.saveAndFlush(event2);
        Event event3 = createEvent("Finish auth ticket", "Complete the backend authentication configuration ticket.", calendars.get(2), Instant.parse("2026-11-13T09:00:00Z"), Instant.parse("2026-11-12T16:00:00Z"), false);
        eventRepo.saveAndFlush(event3);

    }

    private Event createEvent(String title, String description, Calendar calendar, Instant startAt, Instant endAt, Boolean isAllDay) {
        return new Event(title, description, calendar, startAt, endAt, isAllDay);
    }
}
