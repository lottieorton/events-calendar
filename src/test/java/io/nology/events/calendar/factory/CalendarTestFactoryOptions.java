package io.nology.events.calendar.factory;

import io.nology.events.calendar.entities.CalendarColor;

public class CalendarTestFactoryOptions {
    
    String name;
    CalendarColor color;

    private CalendarTestFactoryOptions(Builder builder) {
        this.name = builder.name;
        this.color = builder.color;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static final class Builder {
        private String name;
        private CalendarColor color;

        public Builder name(String name) {
            this.name = name;
            return this;
        }

        public Builder color(CalendarColor color) {
            this.color = color;
            return this;
        }

        public CalendarTestFactoryOptions build() {
            return new CalendarTestFactoryOptions(this);
        }    
    }
}
