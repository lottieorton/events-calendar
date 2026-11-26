package io.nology.events.event.endpoints;

import java.time.Instant;

import org.junit.jupiter.api.Test;
import org.openapitools.jackson.nullable.JsonNullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import io.nology.events.calendar.entities.Calendar;
import io.nology.events.calendar.factory.CalendarTestFactory;
import io.nology.events.calendar.factory.CalendarTestFactoryOptions;
import io.nology.events.config.BaseEndToEndTest;
import io.nology.events.event.dtos.UpdateEventRequest;
import io.nology.events.event.entities.Event;
import io.nology.events.event.factory.EventTestFactory;
import io.nology.events.event.factory.EventTestFactoryOptions;
import io.restassured.http.ContentType;

import static io.restassured.RestAssured.given;
import static io.restassured.module.jsv.JsonSchemaValidator.matchesJsonSchemaInClasspath;
import static org.hamcrest.Matchers.equalTo;

public class PatchEventsIdEndToEndTest extends BaseEndToEndTest {
    private final EventTestFactory factory;
    private final CalendarTestFactory calendarFactory;

    @Autowired
    public PatchEventsIdEndToEndTest(EventTestFactory factory, CalendarTestFactory calendarFactory) {
        this.factory = factory;
        this.calendarFactory = calendarFactory;
    }

    @Test 
    public void updateById_ValidDtoAndEventInDB_ReturnsOKAndUpdatedEvent () {
        Calendar newCalendar = calendarFactory.create(CalendarTestFactoryOptions.builder().name("New calendar").build());
        var opts = EventTestFactoryOptions.builder().build();
        Event event = factory.create(opts);
        UpdateEventRequest data = new UpdateEventRequest(JsonNullable.of("Updated"), JsonNullable.of("New description"), JsonNullable.of(newCalendar.getId()), JsonNullable.of(Instant.parse("2026-11-25T15:00:00Z")), JsonNullable.of(Instant.parse("2026-11-25T20:00:00Z")), JsonNullable.of(true));

        given().contentType(ContentType.JSON).body(data)
        .when().patch("/events/" + event.getId())
        .then().statusCode(HttpStatus.OK.value())
        .body("title", equalTo("Updated"))
        .body("description", equalTo("New description"))
        .body("calendar.id", equalTo(newCalendar.getId().intValue()))
        .body("startAt", equalTo("2026-11-25T15:00:00Z"))
        .body("endAt", equalTo("2026-11-25T20:00:00Z"))
        .body("isAllDay", equalTo(true))
        .body(matchesJsonSchemaInClasspath("schemas/event-schema.json"));
    }

    @Test 
    public void updateById_EventNotInDB_ReturnsNotFound () {
        UpdateEventRequest data = new UpdateEventRequest(null, null, null, null, null, null);

        given().contentType(ContentType.JSON).body(data)
        .when().patch("/events/1")
        .then().statusCode(HttpStatus.NOT_FOUND.value())
        .body("error", equalTo("Not Found"))
        .body("message", equalTo("Could not find event with id 1"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test 
    public void updateById_InvalidDto_ReturnsBadRequest () {
        var opts = EventTestFactoryOptions.builder().build();
        Event event = factory.create(opts);
        UpdateEventRequest data = new UpdateEventRequest(JsonNullable.of(""), null, null, null, null, null);

        given().contentType(ContentType.JSON).body(data)
        .when().patch("/events/" + event.getId())
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body("details.title[0]", equalTo("Title cannot be empty"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test 
    public void updateById_InvalidIdType_ReturnsBadRequest () {
        UpdateEventRequest data = new UpdateEventRequest(null, null, null, null, null, null);
        
        given().contentType(ContentType.JSON).body(data)
        .when().patch("/events/a")
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test 
    public void updateById_NoBody_ReturnsBadRequest () {
        var opts = EventTestFactoryOptions.builder().build();
        Event event = factory.create(opts);

        given().contentType(ContentType.JSON)
        .when().patch("/events/" + event.getId())
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test 
    public void updateById_InvalidNewDateRange_ReturnsUnprocessableRequest () {
        var opts = EventTestFactoryOptions.builder().build();
        Event event = factory.create(opts);
        UpdateEventRequest data = new UpdateEventRequest(null, null, null, JsonNullable.of(Instant.parse("2026-11-25T15:00:00Z")), JsonNullable.of(Instant.parse("2026-11-25T10:00:00Z")), null);

        given().contentType(ContentType.JSON).body(data)
        .when().patch("/events/" + event.getId())
        .then().statusCode(HttpStatus.UNPROCESSABLE_CONTENT.value())
        .body("error", equalTo("Unprocessable Content"))
        .body("message", equalTo("End At date and time must be after Start At date and time"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test 
    public void updateById_InvalidNewStartDate_ReturnsUnprocessableRequest () {
        var opts = EventTestFactoryOptions.builder().endAt(Instant.parse("2026-11-01T13:00:00Z")).build();
        Event event = factory.create(opts);
        UpdateEventRequest data = new UpdateEventRequest(null, null, null, JsonNullable.of(Instant.parse("2026-11-25T15:00:00Z")), null, null);

        given().contentType(ContentType.JSON).body(data)
        .when().patch("/events/" + event.getId())
        .then().statusCode(HttpStatus.UNPROCESSABLE_CONTENT.value())
        .body("error", equalTo("Unprocessable Content"))
        .body("message", equalTo("End At date and time must be after Start At date and time"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test 
    public void updateById_InvalidNewEndDate_ReturnsUnprocessableRequest () {
        var opts = EventTestFactoryOptions.builder().startAt(Instant.parse("2026-11-25T13:00:00Z")).build();
        Event event = factory.create(opts);
        UpdateEventRequest data = new UpdateEventRequest(null, null, null, null, JsonNullable.of(Instant.parse("2026-11-01T15:00:00Z")), null);

        given().contentType(ContentType.JSON).body(data)
        .when().patch("/events/" + event.getId())
        .then().statusCode(HttpStatus.UNPROCESSABLE_CONTENT.value())
        .body("error", equalTo("Unprocessable Content"))
        .body("message", equalTo("End At date and time must be after Start At date and time"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test 
    public void updateById_CalendarNotInDB_ReturnsUnprocessableRequest () {
        var opts = EventTestFactoryOptions.builder().build();
        Event event = factory.create(opts);
        UpdateEventRequest data = new UpdateEventRequest(null, null, JsonNullable.of(5L), null, null, null);

        given().contentType(ContentType.JSON).body(data)
        .when().patch("/events/" + event.getId())
        .then().statusCode(HttpStatus.UNPROCESSABLE_CONTENT.value())
        .body("error", equalTo("Unprocessable Content"))
        .body("message", equalTo("No calendar with id 5"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }
}
