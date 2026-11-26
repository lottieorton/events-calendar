package io.nology.events.event;

import java.time.Instant;
import java.util.Set;
import java.util.stream.Collectors;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

import io.nology.events.event.dtos.CreateEventRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;

public class CreateEventRequestTest {
    private static final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test 
    void requestWithoutDescription_isValid() {
        var req = new CreateEventRequest("Hello", null, 1L, Instant.parse("2026-11-25T15:00:00Z"), Instant.parse("2026-11-25T16:00:00Z"), false);
        
        assertThat(validator.validate(req)).isEmpty();
    }

    @Test 
    void blankTitle_isInvalid() {
        var req = new CreateEventRequest(" ", null, 1L, Instant.parse("2026-11-25T15:00:00Z"), Instant.parse("2026-11-25T16:00:00Z"), false);
        
        assertThat(violatedFields(req)).containsExactly("title");
    }

    @Test 
    void nullTitle_isInvalid() {
        var req = new CreateEventRequest(null, null, 1L, Instant.parse("2026-11-25T15:00:00Z"), Instant.parse("2026-11-25T16:00:00Z"), false);
        
        assertThat(violatedFields(req)).containsExactly("title");
    }

    @Test 
    void blankDescription_isInvalid() {
        var req = new CreateEventRequest("Test", " ", 1L, Instant.parse("2026-11-25T15:00:00Z"), Instant.parse("2026-11-25T16:00:00Z"), false);
        
        assertThat(violatedFields(req)).containsExactly("description");
    }

    @Test 
    void positiveCalendarId_isValid() {
        var req = new CreateEventRequest("Test", null, 10L, Instant.parse("2026-11-25T15:00:00Z"), Instant.parse("2026-11-25T16:00:00Z"), false);
        
        assertThat(validator.validate(req)).isEmpty();
    }

    @Test 
    void negativeCalendarId_isInvalid() {
        var req = new CreateEventRequest("Test", null, -1L, Instant.parse("2026-11-25T15:00:00Z"), Instant.parse("2026-11-25T16:00:00Z"), false);
        
        assertThat(violatedFields(req)).containsExactly("calendarId");
    }

    @Test 
    void zeroCalendarId_isInvalid() {
        var req = new CreateEventRequest("Test", null, 0L, Instant.parse("2026-11-25T15:00:00Z"), Instant.parse("2026-11-25T16:00:00Z"), false);
        
        assertThat(violatedFields(req)).containsExactly("calendarId");
    }

    @Test 
    void nullCalendarId_isInvalid() {
        var req = new CreateEventRequest("Test", null, null, Instant.parse("2026-11-25T15:00:00Z"), Instant.parse("2026-11-25T16:00:00Z"), false);
        
        assertThat(violatedFields(req)).containsExactly("calendarId");
    }

    @Test 
    void nullStartAt_isInvalid() {
        var req = new CreateEventRequest("Test", null, 1L, null, Instant.parse("2026-11-25T16:00:00Z"), false);
        
        assertThat(violatedFields(req)).containsExactly("startAt");
    }

    @Test 
    void nullEndAt_isInvalid() {
        var req = new CreateEventRequest("Test", null, 1L, Instant.parse("2026-11-25T15:00:00Z"), null, false);
        
      assertThat(violatedFields(req)).containsExactly("endAt");
    }

    @Test 
    void nullIsAllDay_isInvalid() {
        var req = new CreateEventRequest("Test", null, 1L, Instant.parse("2026-11-25T15:00:00Z"), Instant.parse("2026-11-25T16:00:00Z"), null);
        
        assertThat(violatedFields(req)).containsExactly("isAllDay");
    }
    

    private static Set<String> violatedFields(CreateEventRequest request) {
        Set<ConstraintViolation<CreateEventRequest>> violations = validator.validate(request);

        return violations.stream().map(v -> v.getPropertyPath().toString()).collect(Collectors.toSet());
    }
}
