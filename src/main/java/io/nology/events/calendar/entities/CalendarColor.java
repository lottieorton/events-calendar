package io.nology.events.calendar.entities;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum CalendarColor {
    PURPLE,
    BLUE,
    PINK,
    GREEN;
    
    
    @JsonCreator 
    public static CalendarColor fromString(String value) {
        if(value == null) {
            return null;
        }
        try {
            return CalendarColor.valueOf(value.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    } 
}

