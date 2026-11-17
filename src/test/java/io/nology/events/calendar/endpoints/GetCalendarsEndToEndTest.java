package io.nology.events.calendar.endpoints;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static io.restassured.module.jsv.JsonSchemaValidator.matchesJsonSchemaInClasspath;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import io.nology.events.calendar.factory.CalendarTestFactory;
import io.nology.events.config.BaseEndToEndTest;

@DisplayName("GET /calendars")
public class GetCalendarsEndToEndTest extends BaseEndToEndTest {
    
    private final CalendarTestFactory calendarFactory;

    @Autowired
    public GetCalendarsEndToEndTest(CalendarTestFactory calendarFactory) {
        this.calendarFactory = calendarFactory;
    }

    @Test 
    public void getAllCalendars_CalendarsInDB_ReturnsOKAndListOfCalendars() {
        this.calendarFactory.create();
        this.calendarFactory.create();
        this.calendarFactory.create();

        given().get("/calendars")
        .then().statusCode(HttpStatus.OK.value())
        .body("$", hasSize(3))
        .body(matchesJsonSchemaInClasspath("schemas/calendar-list-schema.json"));
    }

    @Test
    public void getAllCalendars_NoCalendars_ReturnsOKAndEmptyList() {
        given().get("/calendars")
        .then().statusCode(HttpStatus.OK.value())
        .body("$", hasSize(0));
    }
}
