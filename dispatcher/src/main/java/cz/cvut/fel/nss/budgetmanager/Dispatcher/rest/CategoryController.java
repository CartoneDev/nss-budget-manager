package cz.cvut.fel.nss.budgetmanager.Dispatcher.rest;

import cz.cvut.fel.nss.budgetmanager.Dispatcher.model.Category;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@RestController
@RequestMapping("rest/categories")
public class CategoryController {

    private final RestTemplate restTemplate;
    private final String serverUrl;
    private final HttpServletRequest requestFromClient;

    /**
     * Creates a CategoryController with a RestTemplate and server URL.
     *
     * @param restTemplate The RestTemplate for making HTTP requests.
     * @param serverUrl     The URL of the server.
     */
    @Autowired
    public CategoryController(RestTemplate restTemplate, @Value("${server2.url}") String serverUrl,
                              HttpServletRequest requestFromClient) {
        this.restTemplate = restTemplate;
        this.serverUrl = serverUrl + "categories";
        this.requestFromClient = requestFromClient;
    }

    /**
     * Creates a new category.
     *
     * @param category The Category object to create.
     * @return The ResponseEntity with the created Category.
     */
    @PostMapping
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", this.requestFromClient.getHeader("Authorization"));
        HttpEntity<Category> request = new HttpEntity<>(category, headers);
        return restTemplate.exchange(serverUrl, HttpMethod.POST, request, Category.class);
    }

    /**
     * Updates an existing category.
     *
     * @param id             The ID of the category to update.
     * @param updatedCategory The updated Category object.
     * @return The ResponseEntity with the updated Category.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category updatedCategory) {
        String url = serverUrl + "/{id}";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", this.requestFromClient.getHeader("Authorization"));
        HttpEntity<Category> requestEntity = new HttpEntity<>(updatedCategory, headers);

        return restTemplate.exchange(url,
                HttpMethod.PUT,
                requestEntity,
                Category.class,
                id);
    }

    /**
     * Deletes a category.
     *
     * @param id The ID of the category to delete.
     * @return The ResponseEntity.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        String url = serverUrl + "/{id}";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", this.requestFromClient.getHeader("Authorization"));
        HttpEntity<Category> requestEntity = new HttpEntity<>(headers);

        return restTemplate.exchange(url,
                HttpMethod.DELETE,
                requestEntity,
                Void.class,
                id);
    }

    /**
     * Retrieves a category by ID.
     *
     * @param id The ID of the category to retrieve.
     * @return The ResponseEntity with the retrieved Category.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategory(@PathVariable Long id) {
        String url = serverUrl +"/{id}";
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", this.requestFromClient.getHeader("Authorization"));
        HttpEntity<String> entity = new HttpEntity<>(headers);

        return restTemplate.exchange(url,
                HttpMethod.GET, entity, Category.class, id);
    }

    /**
     * Retrieves all categories.
     *
     * @return The ResponseEntity with the list of all categories.
     */
    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", this.requestFromClient.getHeader("Authorization"));
        HttpEntity<String> entity = new HttpEntity<>(headers);
        return restTemplate.exchange(
                serverUrl,
                HttpMethod.GET,
                entity,
                new ParameterizedTypeReference<>() {
                });
    }
}

