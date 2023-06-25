package cz.cvut.fel.nss.budgetmanager.Dispatcher.rest;

import cz.cvut.fel.nss.budgetmanager.Dispatcher.dto.TransactionResponseDTO;
import cz.cvut.fel.nss.budgetmanager.Dispatcher.model.Category;
import cz.cvut.fel.nss.budgetmanager.Dispatcher.model.Transaction;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

/**
 * REST controller for managing transactions.
 */
@RestController
@RequestMapping("rest/transaction")
public class TransactionController {

    private final RestTemplate restTemplate;
    private final String serverUrl;
    private final HttpServletRequest requestFromClient;

    @Autowired
    public TransactionController(RestTemplate restTemplate, @Value("${server1.url}") String serverUrl,
                                 HttpServletRequest requestFromClient) {
        this.restTemplate = restTemplate;
        this.serverUrl = serverUrl + "transaction";
        this.requestFromClient = requestFromClient;
    }

    /**
     * Retrieves all transactions.
     *
     * @return The list of TransactionResponseDTO objects.
     */
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public List<TransactionResponseDTO> getAllTransactions() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", this.requestFromClient.getHeader("Authorization"));
        HttpEntity<Transaction> request = new HttpEntity<>(headers);

        ResponseEntity<TransactionResponseDTO[]> response = restTemplate.exchange(serverUrl, HttpMethod.GET,
                request,
                TransactionResponseDTO[].class);
        return Arrays.asList(Objects.requireNonNull(response.getBody()));
    }

    /**
     * Retrieves a transaction by its ID.
     *
     * @param id The ID of the transaction.
     * @return The ResponseEntity containing the retrieved TransactionResponseDTO object and the appropriate status.
     */
    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TransactionResponseDTO> getTransactionById(@PathVariable Long id) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", this.requestFromClient.getHeader("Authorization"));
        HttpEntity<Transaction> request = new HttpEntity<>(headers);

        String url = serverUrl + "/" + id;
        return restTemplate.exchange(url, HttpMethod.GET, request, TransactionResponseDTO.class);
    }

    /**
     * Creates a new transaction.
     *
     * @param transaction The transaction to create.
     * @return The ResponseEntity containing the created TransactionResponseDTO object and the appropriate status.
     */
    @PostMapping(value = "/new", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TransactionResponseDTO> createTransaction(@RequestBody Transaction transaction) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", this.requestFromClient.getHeader("Authorization"));
        HttpEntity<Transaction> request = new HttpEntity<>(transaction, headers);
        return restTemplate.exchange(serverUrl + "/new", HttpMethod.POST, request, TransactionResponseDTO.class);
    }

    /**
     * Updates an existing transaction.
     *
     * @param id                The ID of the transaction to update.
     * @param updatedTransaction The updated transaction object.
     * @return The ResponseEntity containing the updated TransactionResponseDTO object and the appropriate status.
     */
    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<TransactionResponseDTO> updateTransaction(@PathVariable Long id,
                                                                    @RequestBody Transaction updatedTransaction) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", this.requestFromClient.getHeader("Authorization"));
        HttpEntity<Transaction> request = new HttpEntity<>(updatedTransaction, headers);
        return restTemplate.exchange(serverUrl + "/" + id, HttpMethod.PUT, request, TransactionResponseDTO.class);
    }

    /**
     * Deletes a transaction.
     *
     * @param id The ID of the transaction to delete.
     * @return The ResponseEntity with no content and the appropriate status.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable Long id) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", this.requestFromClient.getHeader("Authorization"));
        HttpEntity<Transaction> request = new HttpEntity<>(headers);

        restTemplate.exchange(serverUrl + "/" + id, HttpMethod.DELETE, request, Transaction.class);
        return ResponseEntity.noContent().build();
    }

    /**
     * Searches for transactions based on the specified parameters.
     *
     * @param category    The category of the transactions (optional).
     * @param date        The date of the transactions (optional).
     * @param description The description of the transactions (optional).
     * @param amount      The amount of the transactions (optional).
     * @return The list of TransactionResponseDTO objects matching the search criteria.
     */
    @GetMapping("/search")
    public List<TransactionResponseDTO> searchTransaction(@RequestParam(required = false) Category category,
                                                          @RequestParam(required = false) LocalDate date,
                                                          @RequestParam(required = false) String description,
                                                          @RequestParam(required = false) BigDecimal amount) {
        // Build URL with query parameters
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(serverUrl + "/search")
                .queryParam("category", category)
                .queryParam("date", date)
                .queryParam("description", description)
                .queryParam("amount", amount);
        String url = builder.toUriString();
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", this.requestFromClient.getHeader("Authorization"));
        HttpEntity<Transaction> request = new HttpEntity<>(headers);

        ResponseEntity<TransactionResponseDTO[]> response = restTemplate.exchange(url, HttpMethod.GET, request,
                TransactionResponseDTO[].class);

        return Arrays.asList(Objects.requireNonNull(response.getBody()));
    }

    /**
     * Exports transactions to a text file.
     *
     * @return The ResponseEntity containing the exported file resource and the appropriate status.
     */
    @GetMapping("/export")
    public ResponseEntity<Resource> exportTransaction() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", this.requestFromClient.getHeader("Authorization"));
        HttpEntity<Resource> request = new HttpEntity<>(headers);
        return restTemplate.exchange(serverUrl + "/export", HttpMethod.GET, request, Resource.class);
    }

    /**
     * Retrieves transactions by description.
     *
     * @param description The description of the transactions.
     * @return The list of Transaction objects matching the description.
     */
    @GetMapping(value = "/findByDescription/{description}", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Transaction> findByDescription(@PathVariable String description) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", this.requestFromClient.getHeader("Authorization"));
        HttpEntity<Transaction[]> request = new HttpEntity<>(headers);

        ResponseEntity<Transaction[]> response =
                restTemplate.exchange(serverUrl + "/findByDescription/" + description, HttpMethod.GET,
                        request, Transaction[].class);
        return Arrays.asList(Objects.requireNonNull(response.getBody()));
    }
}
