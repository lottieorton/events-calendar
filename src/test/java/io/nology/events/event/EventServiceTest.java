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
import org.openapitools.jackson.nullable.JsonNullable;

import io.nology.events.calendar.CalendarService;
import io.nology.events.calendar.entities.Calendar;
import io.nology.events.common.exceptions.UnprocessableContentException;
import io.nology.events.event.dtos.CreateEventRequest;
import io.nology.events.event.dtos.UpdateEventRequest;
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
    public void findById_CallsFindById() {
        this.eventService.findById(1L);
        verify(this.repo).findById(1L);
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

    @Test
    public void updateById_WhenEventExists_Saves() {
        UpdateEventRequest data = new UpdateEventRequest(null, null, null, null, null, null);
        Event event = new Event("Title", "Fake description", new Calendar(), Instant.parse("2026-11-19T20:00:00Z"), Instant.parse("2026-11-19T21:00:00Z"), false);

        when(this.repo.findById(1L)).thenReturn(Optional.of(event));

        this.eventService.updateById(1L, data);

        verify(this.repo).saveAndFlush(event);
    }

    @Test
    public void updateById_WhenEventExistsUpdatesValues_Saves() {
        Calendar newCalendar = new Calendar();
        newCalendar.setId(2L);
        UpdateEventRequest data = new UpdateEventRequest(JsonNullable.of("Updated"), JsonNullable.of("New description"), JsonNullable.of(2L), JsonNullable.of(Instant.parse("2026-11-25T15:00:00Z")), JsonNullable.of(Instant.parse("2026-11-25T20:00:00Z")), JsonNullable.of(true));
        Event event = new Event("Title", "Fake description", new Calendar(), Instant.parse("2026-11-19T20:00:00Z"), Instant.parse("2026-11-19T21:00:00Z"), false);

        when(this.repo.findById(1L)).thenReturn(Optional.of(event));
        when(this.calendarService.findById(2L)).thenReturn(Optional.of(newCalendar));

        this.eventService.updateById(1L, data);

        ArgumentCaptor<Event> eventCaptor = ArgumentCaptor.forClass(Event.class);
        verify(this.repo).saveAndFlush(eventCaptor.capture());

        Event capturedEvent = eventCaptor.getValue();

        assertEquals("Updated", capturedEvent.getTitle());
        assertEquals("New description", capturedEvent.getDescription());
        assertEquals(newCalendar, capturedEvent.getCalendar());
        assertEquals(Instant.parse("2026-11-25T15:00:00Z"), capturedEvent.getStartAt());
        assertEquals(Instant.parse("2026-11-25T20:00:00Z"), capturedEvent.getEndAt());
        assertEquals(true, capturedEvent.getIsAllDay());
    }

    @Test
    public void updateById_WhenEventDoesNotExist_DoesNotSave() {
        UpdateEventRequest data = new UpdateEventRequest(null, null, null, null, null, null);

        when(this.repo.findById(1L)).thenReturn(Optional.empty());

        this.eventService.updateById(1L, data);

        verify(this.repo, never()).saveAndFlush(any(Event.class));
    }

    @Test
    public void updateById_WhenDateRangeInvalid_ThrowsException() {
        UpdateEventRequest data = new UpdateEventRequest(null, null, null, JsonNullable.of(Instant.parse("2026-11-26T19:00:00Z")), JsonNullable.of(Instant.parse("2026-11-26T11:00:00Z")), null);
        Event event = new Event("Title", "Fake description", new Calendar(), Instant.parse("2026-11-25T20:00:00Z"), Instant.parse("2026-11-25T21:00:00Z"), false);

        when(this.repo.findById(1L)).thenReturn(Optional.of(event));

        assertThrows(UnprocessableContentException.class, () -> this.eventService.updateById(1L, data));
        verify(this.calendarService, never()).findById(1L);
        verify(this.repo, never()).saveAndFlush(any(Event.class));
    }

    @Test
    public void updateById_WhenCalendarDoesNotExist_ThrowsException() {
        UpdateEventRequest data = new UpdateEventRequest(null, null, JsonNullable.of(2L), null, null, null);
        Event event = new Event("Title", "Fake description", new Calendar(), Instant.parse("2026-11-25T20:00:00Z"), Instant.parse("2026-11-25T21:00:00Z"), false);

        when(this.repo.findById(1L)).thenReturn(Optional.of(event));
        when(this.calendarService.findById(2L)).thenReturn(Optional.empty());

        assertThrows(UnprocessableContentException.class, () -> this.eventService.updateById(1L, data));
        verify(this.calendarService).findById(2L);
        verify(this.repo, never()).saveAndFlush(any(Event.class));
    }
}