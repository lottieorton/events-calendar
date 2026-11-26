package io.nology.events.common.utils;

public class TextUtils {
    public static String blankToNull(String input) {
        return (input == null || input.isEmpty() || input.trim().isEmpty()) ? null : input;
    }
}
