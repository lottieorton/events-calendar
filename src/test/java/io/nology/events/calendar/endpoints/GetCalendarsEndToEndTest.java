package io.nology.events.calendar.endpoints;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static io.restassured.module.jsv.JsonSchemaValidator.matchesJsonSchemaInClasspath;

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
import io.restassured.RestAssured;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@Sql(scripts = "/sql/cleanup.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
public class GetCalendarsEndToEndTest {
    @LocalServerPort 
    private int port;

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
        Calendar calendar2 = new Calendar();
        calendar2.setName("Family");
        calendar2.setColor(CalendarColor.PURPLE);
        calendarRepo.saveAndFlush(calendar2);
        Calendar calendar3 = new Calendar();
        calendar3.setName("Work");
        calendar3.setColor(CalendarColor.GREEN);
        calendarRepo.saveAndFlush(calendar3);

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
