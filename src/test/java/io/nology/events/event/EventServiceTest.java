package io.nology.events.event;

import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
public class EventServiceTest {
    @Mock 
    private EventRepository repo;

    @InjectMocks
    private EventService eventService;

    @Test 
    public void findAll_CallsFindAll() {
        this.eventService.findAll();
        verify(this.repo).findAll();
    }
}
