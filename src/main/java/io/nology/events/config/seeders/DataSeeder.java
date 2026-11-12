package io.nology.events.config.seeders;

import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import io.nology.events.calendar.CalendarRepository;
import io.nology.events.calendar.entities.Calendar;
import io.nology.events.calendar.entities.CalendarColor;

@Component 
@Profile({"dev"})
public class DataSeeder implements CommandLineRunner {
    private final CalendarRepository calendarRepo;
    private record CalendarSeedData(String name, CalendarColor color) {}

    public DataSeeder(CalendarRepository calendarRepo) {
        this.calendarRepo = calendarRepo;
    }

    @Override
    public void run(String... args) throws Exception {
        seedCalendars();
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
    
}
