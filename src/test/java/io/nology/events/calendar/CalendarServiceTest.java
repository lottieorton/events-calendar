package io.nology.events.calendar;

import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class CalendarServiceTest {
    @Mock
    private CalendarRepository repo;

    @InjectMocks
    private CalendarService calendarService;

    @Test 
    public void findAll_CallsFindAll() {
        this.calendarService.findAll();
        verify(this.repo).findAll();
    }

    @Test 
    public void findById_CallsFindById() {
        this.calendarService.findById(1L);
        verify(this.repo).findById(1L);
    }
}
