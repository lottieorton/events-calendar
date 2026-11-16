package io.nology.events.event.endpoints;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static io.restassured.module.jsv.JsonSchemaValidator.matchesJsonSchemaInClasspath;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.test.context.jdbc.Sql;

import io.nology.events.calendar.CalendarRepository;
import io.nology.events.calendar.entities.Calendar;
import io.nology.events.calendar.entities.CalendarColor;
import io.nology.events.event.EventRepository;
import io.nology.events.event.entities.Event;
import io.restassured.RestAssured;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Sql(scripts = "/sql/cleanup.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class GetEventsEndToEndTest {
    @LocalServerPort 
    private int port;

    @Autowired 
    private EventRepository eventRepo;

    @Autowired 
    private CalendarRepository calendarRepo;

    @BeforeEach 
    public void setup() {
        RestAssured.port = this.port;
    }

    @Test 
    public void getAllCalendars_CalendarsInDB_ReturnsOKAndListOfCalendars() {
        Calendar calendar1 = new Calendar();
        calendar1.setName("Personal");
        calendar1.setColor(CalendarColor.BLUE);
        calendarRepo.saveAndFlush(calendar1);
        
        Event event1 = new Event();
        event1.setTitle("Go to the Gym class");
        event1.setDescription("Attend the HIIT class");
        event1.setCalendar(calendar1);
        event1.setStartAt(Instant.parse("2026-11-12T17:00:00Z"));
        event1.setEndAt(Instant.parse("2026-11-12T18:00:00Z"));
        event1.setIsAllDay(false);
        event1.setCreatedAt(Instant.parse("2026-11-12T17:00:00Z"));
        eventRepo.saveAndFlush(event1);

        Event event2 = new Event();
        event2.setTitle("Beach day");
        event2.setDescription("Have a picnic at the beach");
        event2.setCalendar(calendar1);
        event2.setStartAt(LocalDate.of(2026, 11, 12).atStartOfDay(ZoneId.of("Australia/Sydney")).toInstant());
        event2.setEndAt(LocalDate.of(2026, 11, 13).atStartOfDay(ZoneId.of("Australia/Sydney")).toInstant());
        event2.setIsAllDay(true);
        event2.setCreatedAt(LocalDate.of(2026, 11, 12).atStartOfDay(ZoneId.of("Australia/Sydney")).toInstant());
        eventRepo.saveAndFlush(event2);

        given().get("/events")
        .then().statusCode(HttpStatus.OK.value())
        .body("$", hasSize(2))
        .body(matchesJsonSchemaInClasspath("schemas/event-list-schema.json"));
    }

    @Test 
    public void getAllCalendars_NoCalendars_ReturnsOKAndEmptyList() {
        given().get("/events")
        .then().statusCode(HttpStatus.OK.value())
        .body("$", hasSize(0));
    }
}
