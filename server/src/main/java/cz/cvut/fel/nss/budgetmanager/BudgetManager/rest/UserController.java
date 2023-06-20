package cz.cvut.fel.nss.budgetmanager.BudgetManager.rest;

import cz.cvut.fel.nss.budgetmanager.BudgetManager.exceptions.NotFoundException;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.exceptions.UserAlreadyExists;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.model.User;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.repository.security.AuthTokenDao;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.rest.util.RestUtil;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.security.model.AuthenticationRequest;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.security.model.AuthenticationResponse;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.security.service.TokenValidatorService;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.service.UserService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cglib.core.Local;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;

@AllArgsConstructor
@RestController
@Slf4j
@RequestMapping("rest/user")
public class UserController {

    private final UserService userService;
    private final AuthTokenDao authTokenDao;

    @PostMapping(value = "/register", consumes = MediaType.APPLICATION_JSON_VALUE)
    @ExceptionHandler({UserAlreadyExists.class})
    public ResponseEntity<Void> register(@RequestBody User user) {
        Boolean result = userService.createUser( user.getEmail(), user.getUsername(),
                user.getPassword());
        if (!result) {
            throw new UserAlreadyExists("User with that email " + user.getEmail() + " already exists");
        }
        log.debug("User with email {} successfully registered.", user.getEmail());
        final HttpHeaders headers = RestUtil.createLocationHeaderFromCurrentUri("/current");
        return new ResponseEntity<>(headers, HttpStatus.CREATED);
    }

    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ExceptionHandler({NotFoundException.class})
    public User getUser(@PathVariable Long id) {
        User u = userService.findUser(id);
        if (u == null){
            throw new NotFoundException("User not found");
        }
        return u;
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {

        User user = userService.findUserByEmail(request.getEmail());

        if (user == null) {
            return new ResponseEntity<>(new AuthenticationResponse("", ""),
                    HttpStatus.UNAUTHORIZED);
        }

        LocalDateTime currentTime = LocalDateTime.now(ZoneId.of("UTC"));
        LocalDateTime futureExpireTokenTime = currentTime.plusHours(8);

        log.info(String.format("A new token for user %s was set.", user.getEmail()));
        log.info(String.format("Token will expire in: %s", futureExpireTokenTime));

        authTokenDao.insertToken(request.getEmail(), user.getClientId(), futureExpireTokenTime);

        return new ResponseEntity<>(
                new AuthenticationResponse(
                        request.getEmail(), ""), HttpStatus.OK);
    }
}
