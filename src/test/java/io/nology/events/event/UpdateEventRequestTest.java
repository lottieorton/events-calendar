package io.nology.events.event;

import org.junit.jupiter.api.Test;
import org.openapitools.jackson.nullable.JsonNullable;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Set;
import java.util.stream.Collectors;

import io.nology.events.event.dtos.UpdateEventRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;

public class UpdateEventRequestTest {
    private static final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test 
    void undefinedTitle_isValid() {
        UpdateEventRequest req = new UpdateEventRequest(JsonNullable.undefined(), null, null, null, null, null);
        
        assertThat(validator.validate(req)).isEmpty();
    }

    @Test 
    void validTitle_isValid() {
        UpdateEventRequest req = new UpdateEventRequest(JsonNullable.of("Hello"), null, null, null, null, null);
        
        assertThat(validator.validate(req)).isEmpty();
    }

    @Test 
    void blankTitle_isInvalid() {
        UpdateEventRequest req = new UpdateEventRequest(JsonNullable.of(" "), null, null, null, null, null);

        assertThat(violatedFields(req)).containsExactly("title");
    }

    @Test 
    void nullTitle_isValid() {
        UpdateEventRequest req = new UpdateEventRequest(JsonNullable.of(null), null, null, null, null, null);

        assertThat(validator.validate(req)).isEmpty();
    }

    @Test 
    void positiveCalendarId_isValid() {
        UpdateEventRequest req = new UpdateEventRequest(null, null, JsonNullable.of(1L), null, null, null);
        
        assertThat(validator.validate(req)).isEmpty();
    }

    @Test 
    void negativeCalendarId_isInvalid() {
        UpdateEventRequest req = new UpdateEventRequest(null, null, JsonNullable.of(-1L), null, null, null);
        
        assertThat(violatedFields(req)).containsExactly("calendarId");
    }

    @Test 
    void zeroCalendarId_isInvalid() {
        UpdateEventRequest req = new UpdateEventRequest(null, null, JsonNullable.of(0L), null, null, null);
        
        assertThat(violatedFields(req)).containsExactly("calendarId");
    }

    @Test 
    void nullCalendarId_isValid() {
        UpdateEventRequest req = new UpdateEventRequest(null, null, JsonNullable.of(null), null, null, null);
        
        assertThat(validator.validate(req)).isEmpty();
    }

    private static Set<String> violatedFields(UpdateEventRequest request) {
        Set<ConstraintViolation<UpdateEventRequest>> violations = validator.validate(request);

        return violations.stream().map(v -> v.getPropertyPath().toString()).collect(Collectors.toSet());
    }
}
