package io.nology.events.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import com.github.javafaker.Faker;

@Configuration 
@Profile("test")
public class TestFactoryConfig {
    
    @Bean 
    public Faker faker() {
        return new Faker();
    }
}
