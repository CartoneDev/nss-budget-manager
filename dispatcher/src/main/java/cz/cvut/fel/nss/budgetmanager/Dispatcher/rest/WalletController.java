package cz.cvut.fel.nss.budgetmanager.Dispatcher.rest;

import cz.cvut.fel.nss.budgetmanager.Dispatcher.dto.TransactionResponseDTO;
import cz.cvut.fel.nss.budgetmanager.Dispatcher.dto.WalletGoalResponseDTO;
import cz.cvut.fel.nss.budgetmanager.Dispatcher.dto.WalletResponseDTO;
import cz.cvut.fel.nss.budgetmanager.Dispatcher.model.Currency;
import cz.cvut.fel.nss.budgetmanager.Dispatcher.model.Goal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("rest/wallet")
public class WalletController {

    private final RestTemplate restTemplate;
    private final String serverUrl;

    /**
     * Creates a WalletController with a RestTemplate and server URL.
     *
     * @param restTemplate The RestTemplate for making HTTP requests.
     * @param serverUrl     The URL of the server.
     */
    @Autowired
    public WalletController(RestTemplate restTemplate, @Value("${server1.url}") String serverUrl) {
        this.restTemplate = restTemplate;
        this.serverUrl = serverUrl;
    }

    /**
     * Adds money to the wallet.
     *
     * @param amount The amount of money to add.
     * @return The ResponseEntity.
     */
    @PutMapping(value = "/money", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> addMoneyToWallet(@RequestBody BigDecimal amount){
        HttpEntity<BigDecimal> request = new HttpEntity<>(amount);
        return restTemplate.exchange(serverUrl + "/money",HttpMethod.PUT, request, Void.class);
    }

    /**
     * Adds a goal to the wallet.
     *
     * @param walletGoalResponseDTO The WalletGoalResponseDTO containing the goal details.
     * @return The ResponseEntity with the WalletGoalResponseDTO.
     */
    @PostMapping(value = "/goal", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<WalletGoalResponseDTO> addGoal(@RequestBody WalletGoalResponseDTO walletGoalResponseDTO) {
        HttpEntity<WalletGoalResponseDTO> request = new HttpEntity<>(walletGoalResponseDTO);
        return restTemplate.exchange(serverUrl + "/goal", HttpMethod.POST, request, WalletGoalResponseDTO.class);
    }

    /**
     * Get all user's wallet goals;
     *
     * @return The list of goals;
     */
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public List<WalletGoalResponseDTO> getAllGoals() {
        ResponseEntity<WalletGoalResponseDTO[]> response = restTemplate.getForEntity(serverUrl, WalletGoalResponseDTO[].class);
        return Arrays.asList(Objects.requireNonNull(response.getBody()));
    }

    /**
     * Changes the currency of the wallet.
     *
     * @param currency The new currency.
     * @return The ResponseEntity.
     */
    @PutMapping(value = "/currency")
    public ResponseEntity<Void> changeCurrency(@RequestParam("currency") Currency currency){
        HttpEntity<Currency> request = new HttpEntity<>(currency);
        return restTemplate.exchange(serverUrl + "/currency?currency={currency}", HttpMethod.PUT, request, Void.class, currency);
    }

    /**
     * Retrieves the wallet.
     *
     * @return The ResponseEntity with the WalletResponseDTO.
     */
    @GetMapping(value = "/myWallet")
    public ResponseEntity<WalletResponseDTO> getWallet(){
        return restTemplate.getForEntity(serverUrl + "/myWallet", WalletResponseDTO.class);
    }
}
