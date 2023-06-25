package cz.cvut.fel.nss.budgetmanager.Dispatcher.rest;

import cz.cvut.fel.nss.budgetmanager.Dispatcher.dto.UserDTO;
import cz.cvut.fel.nss.budgetmanager.Dispatcher.model.Category;
import cz.cvut.fel.nss.budgetmanager.Dispatcher.model.User;
import cz.cvut.fel.nss.budgetmanager.Dispatcher.security.model.AuthenticationRequest;
import cz.cvut.fel.nss.budgetmanager.Dispatcher.security.model.AuthenticationResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("rest/user")
public class UserController {
    private final RestTemplate restTemplate;
    private final String serverUrl;
    private final HttpServletRequest requestFromClient;

    /**
     * Creates a UserController with a RestTemplate and server URL.
     *
     * @param restTemplate      The RestTemplate for making HTTP requests.
     * @param serverUrl         The URL of the server.
     * @param requestFromClient
     */
    @Autowired
    public UserController(RestTemplate restTemplate, @Value("${server1.url}") String serverUrl,
                          HttpServletRequest requestFromClient) {
        this.restTemplate = restTemplate;
        this.serverUrl = serverUrl + "user";
        this.requestFromClient = requestFromClient;
    }

    /**
     * Registers a new user.
     *
     * @param userDTO The UserDTO object containing user details.
     * @return The ResponseEntity.
     */
    @PostMapping(value = "/register", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Void> register(@RequestBody UserDTO userDTO) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBasicAuth("admin@test.test", "admin");
        HttpEntity<UserDTO> request = new HttpEntity<>(userDTO);
        ResponseEntity<Void> response = restTemplate.exchange(serverUrl + "/register", HttpMethod.POST, request, Void.class);
        System.out.println(response);
        return response;
    }

    /**
     * Retrieves a user by ID.
     *
     * @param id The ID of the user.
     * @return The User object.
     */
    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public User getUser(@PathVariable Long id) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", this.requestFromClient.getHeader("Authorization"));
        HttpEntity<User> request = new HttpEntity<>(headers);
        ResponseEntity<User> response = restTemplate.exchange(serverUrl + "/" + id, HttpMethod.GET, request,
                User.class);
        return response.getBody();
    }

    /**
     * Authenticates a user.
     *
     * @param request The AuthenticationRequest object containing user credentials.
     * @return The ResponseEntity containing the AuthenticationResponse.
     */
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        HttpEntity<AuthenticationRequest> req = new HttpEntity<>(request);
        return restTemplate.postForEntity(serverUrl + "/authenticate", req, AuthenticationResponse.class);
    }

}