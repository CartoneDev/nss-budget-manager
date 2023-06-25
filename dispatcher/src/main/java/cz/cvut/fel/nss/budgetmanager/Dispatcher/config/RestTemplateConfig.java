package cz.cvut.fel.nss.budgetmanager.Dispatcher.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    /**
     * Creates a RestTemplate bean..
     *
     * @return RestTemplate.
     */
    @Bean
    public RestTemplate restTemplate() {

        return new RestTemplate();
    }
}
