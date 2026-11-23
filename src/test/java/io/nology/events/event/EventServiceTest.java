package io.nology.events.event;

import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;

import java.time.Instant;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import io.nology.events.calendar.CalendarService;
import io.nology.events.calendar.entities.Calendar;
import io.nology.events.common.exceptions.UnprocessableContentException;
import io.nology.events.event.dtos.CreateEventRequest;
import io.nology.events.event.entities.Event;

@ExtendWith(MockitoExtension.class)
public class EventServiceTest {
    @Mock 
    private EventRepository repo;

    @Mock 
    private CalendarService calendarService;

    @InjectMocks
    private EventService eventService;

    @Test 
    public void findAll_CallsFindAll() {
        this.eventService.findAll();
        verify(this.repo).findAll();
    }

    @Test 
    public void create_WhenCalendarExistsAndValidDto_SavesEventInDB() {
        CreateEventRequest data = new CreateEventRequest("Test", "Test description", 1L, Instant.parse("2026-11-19T18:00:00Z"), Instant.parse("2026-11-19T19:00:00Z"), false);
        Calendar calendar = new Calendar();

        when(this.calendarService.findById(1L)).thenReturn(Optional.of(calendar));
        when(this.repo.saveAndFlush(any(Event.class))).thenAnswer(e -> {
            Event savedEvent = e.getArgument(0);
            savedEvent.setId(1L);
            return savedEvent;
        });

        Event result = this.eventService.create(data);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("Test", result.getTitle());

        ArgumentCaptor<Event> eventCaptor = ArgumentCaptor.forClass(Event.class);
        verify(this.repo).saveAndFlush(eventCaptor.capture());
        
        Event capturedEvent = eventCaptor.getValue();
        assertEquals("Test", capturedEvent.getTitle());
        assertEquals("Test description", capturedEvent.getDescription());
        assertEquals(calendar, capturedEvent.getCalendar());
        assertEquals(Instant.parse("2026-11-19T18:00:00Z"), capturedEvent.getStartAt());
        assertEquals(Instant.parse("2026-11-19T19:00:00Z"), capturedEvent.getEndAt());
        assertEquals(false, capturedEvent.getIsAllDay());
        
    }

    @Test 
    public void create_WhenCalendarDoesNotExist_ThrowsException() {
        CreateEventRequest data = new CreateEventRequest("Test", "Test description", 1L, Instant.parse("2026-11-19T18:00:00Z"), Instant.parse("2026-11-19T19:00:00Z"), false);

        when(this.calendarService.findById(1L)).thenReturn(Optional.empty());

        assertThrows(UnprocessableContentException.class, () -> this.eventService.create(data));
        verify(this.calendarService).findById(1L);
        verify(this.repo, never()).saveAndFlush(any(Event.class));

    }

    @Test 
    public void create_WhenDateRangeInvalid_ThrowsException() {
        CreateEventRequest data = new CreateEventRequest("Test", "Test description", 1L, Instant.parse("2026-11-19T20:00:00Z"), Instant.parse("2026-11-19T19:00:00Z"), false);
        Calendar calendar = new Calendar();

        when(this.calendarService.findById(1L)).thenReturn(Optional.of(calendar));

        assertThrows(UnprocessableContentException.class, () -> this.eventService.create(data));
        verify(this.calendarService).findById(1L);
        verify(this.repo, never()).saveAndFlush(any(Event.class));
    }
}