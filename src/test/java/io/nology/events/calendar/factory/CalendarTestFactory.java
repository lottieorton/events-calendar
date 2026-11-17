package io.nology.events.calendar.factory;

import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import com.github.javafaker.Faker;

import io.nology.events.calendar.CalendarRepository;
import io.nology.events.calendar.entities.Calendar;
import io.nology.events.calendar.entities.CalendarColor;

@Component 
@Profile("test")
public class CalendarTestFactory {
    
    private final CalendarRepository repo;
    private final Faker faker;

    public CalendarTestFactory(CalendarRepository repo, Faker faker) {
        this.repo = repo;
        this.faker = faker;
    }

    public long count() {
        return this.repo.count();
    }

    public Calendar build(CalendarTestFactoryOptions opts) {
        String name = opts.name != null ? opts.name : faker.options().option("Personal", "Social", "Family", "Work");
        CalendarColor color = opts.color != null ? opts.color : faker.options().option(CalendarColor.class);
        Calendar calendar = new Calendar();
        calendar.setName(name);
        calendar.setColor(color);
        return calendar;
    }
    
    public Calendar build() {
        var emptyOptions = emptyOpts();
        return build(emptyOptions);
    }

    public Calendar create(CalendarTestFactoryOptions opts) {
        Calendar calendar = this.build(opts);
        return this.repo.saveAndFlush(calendar);
    }
    
    public Calendar create() {
        var emptyOptions = emptyOpts();
        return create(emptyOptions);
    }

    private CalendarTestFactoryOptions emptyOpts() {
        return CalendarTestFactoryOptions.builder().build();
    }
}
