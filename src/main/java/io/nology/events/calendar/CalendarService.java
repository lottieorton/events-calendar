package io.nology.events.calendar;

import java.util.List;

import org.springframework.stereotype.Service;

import io.nology.events.calendar.entities.Calendar;

@Service 
public class CalendarService {
    private CalendarRepository repo;

    public CalendarService(CalendarRepository repo) {
        this.repo = repo;
    }

    public List<Calendar> findAll() {
        return this.repo.findAll();
    }
    
}
