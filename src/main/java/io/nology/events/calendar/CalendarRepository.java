package io.nology.events.calendar;

import org.springframework.data.jpa.repository.JpaRepository;

import io.nology.events.calendar.entities.Calendar;

public interface CalendarRepository extends JpaRepository<Calendar, Long> {
    
}
