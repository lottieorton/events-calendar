package io.nology.events.event.endpoints;

import java.time.Instant;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import io.nology.events.calendar.entities.Calendar;
import io.nology.events.calendar.factory.CalendarTestFactory;
import io.nology.events.calendar.factory.CalendarTestFactoryOptions;
import io.nology.events.config.BaseEndToEndTest;
import io.nology.events.event.dtos.CreateEventRequest;
import io.restassured.http.ContentType;

import static io.restassured.RestAssured.given;
import static io.restassured.module.jsv.JsonSchemaValidator.matchesJsonSchemaInClasspath;
import static org.hamcrest.Matchers.equalTo;

@DisplayName("POST /events")
public class CreateEventsEndToEndTest extends BaseEndToEndTest {
    private final CalendarTestFactory calendarFactory;

    @Autowired
    public CreateEventsEndToEndTest(CalendarTestFactory calendarFactory) {
        this.calendarFactory = calendarFactory;
    }

    @Test 
    public void create_ValidDto_ReturnsOKAndCreatedEvent () {
        Calendar testCalendar = calendarFactory.create(CalendarTestFactoryOptions.builder().name("Example").build());
        CreateEventRequest data = new CreateEventRequest("Test", "Test description", testCalendar.getId(), Instant.parse("2026-11-19T18:00:00Z"), Instant.parse("2026-11-19T19:00:00Z"), false);

        given().contentType(ContentType.JSON).body(data)
        .when().post("/events")
        .then().log().body().statusCode(HttpStatus.CREATED.value())
        .body("title", equalTo("Test"))
        .body("description", equalTo("Test description"))
        .body("calendar.id", equalTo(testCalendar.getId().intValue()))
        .body("startAt", equalTo("2026-11-19T18:00:00Z"))
        .body("endAt", equalTo("2026-11-19T19:00:00Z"))
        .body("isAllDay", equalTo(false))
        .body(matchesJsonSchemaInClasspath("schemas/event-schema.json"));
    }

    @Test 
    public void create_InvalidDto_ReturnsBadRequest () {
        CreateEventRequest data = new CreateEventRequest(null, null, null, Instant.parse("2026-11-19T18:00:00Z"), Instant.parse("2026-11-19T19:00:00Z"), false);

        given().contentType(ContentType.JSON).body(data)
        .when().post("/events")
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("message", equalTo("Validation failed"))
        .body("error", equalTo("Bad Request"))
        .body("details.title[0]", equalTo("Title cannot be empty"))
        .body("details.calendarId[0]", equalTo("Calendar cannot be empty"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test 
    public void create_NoBody_ReturnsBadRequest () {
        given().contentType(ContentType.JSON).when().post("/events")
        .then().statusCode(HttpStatus.BAD_REQUEST.value())
        .body("error", equalTo("Bad Request"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test 
    public void create_CalendarNotInDb_ReturnsUnprocessableContent () {
        CreateEventRequest data = new CreateEventRequest("Test", "Test description", 1L, Instant.parse("2026-11-19T18:00:00Z"), Instant.parse("2026-11-19T19:00:00Z"), false);

        given().contentType(ContentType.JSON).body(data)
        .when().post("/events")
        .then().statusCode(HttpStatus.UNPROCESSABLE_CONTENT.value())
        .body("error", equalTo("Unprocessable Content"))
        .body("message", equalTo("No calendar with id 1"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }

    @Test 
    public void create_InvalidDateRange_ReturnsUnprocessableContent () {
        Calendar testCalendar = calendarFactory.create(CalendarTestFactoryOptions.builder().name("Example").build());
        CreateEventRequest data = new CreateEventRequest("Test", "Test description", testCalendar.getId(), Instant.parse("2026-11-19T18:00:00Z"), Instant.parse("2026-11-19T17:00:00Z"), false);

        given().contentType(ContentType.JSON).body(data)
        .when().post("/events")
        .then().statusCode(HttpStatus.UNPROCESSABLE_CONTENT.value())
        .body("error", equalTo("Unprocessable Content"))
        .body("message", equalTo("End At date and time must be after Start At date and time"))
        .body(matchesJsonSchemaInClasspath("schemas/api-error-schema.json"));
    }
}
