package cz.cvut.fel.nss.budgetmanager.BudgetManager.security.filter;

import cz.cvut.fel.nss.budgetmanager.BudgetManager.security.model.BudgetUserDetails;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.security.service.AuthenticationService;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.security.service.TokenValidatorService;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.security.util.SecurityUtils;
import cz.cvut.fel.nss.budgetmanager.BudgetManager.service.security.BudgetUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class TokenAuthenticationFilter extends OncePerRequestFilter {

    private final TokenValidatorService tokenValidatorService;
    private final BudgetUserDetailsService budgetUserDetailsService;
    private final AuthenticationService authenticationService;

    /**
     * Performs the authentication check for each incoming request.
     *
     * @param request     The HttpServletRequest object.
     * @param response    The HttpServletResponse object.
     * @param filterChain The FilterChain object.
     * @throws ServletException if a servlet exception occurs.
     * @throws IOException      if an I/O exception occurs.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        if (request.getServletPath().contains("/rest/user/authenticate")
                || request.getServletPath().contains("/rest/user/register")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = request.getHeader("Authorization");
        System.out.println("Token: " + token);
        if (!token.isEmpty() && tokenValidatorService.validateToken(token)) {
            final BudgetUserDetails budgetUserDetails = (BudgetUserDetails) budgetUserDetailsService.loadUserByUsername(token);

            authenticationService.authenticate(token);
            SecurityUtils.setCurrentUser(budgetUserDetails);
            filterChain.doFilter(request, response);

        }
    }
}
