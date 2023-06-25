package cz.cvut.fel.nss.budgetmanager.BudgetManager.model.notification;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

/**
 * Represents a notification entity.
 */
@Data
@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;
    private Instant timestamp;
    private String info;
    private NotificationType type;
    private Long userId;

    /**
     * Constructs a notification with the specified details.
     *
     * @param timestamp The timestamp of the notification.
     * @param info      The information/message of the notification.
     * @param type      The type/category of the notification.
     * @param userId    The ID of the user associated with the notification.
     */
    public Notification(Instant timestamp, String info, NotificationType type, Long userId) {
        this.timestamp = timestamp;
        this.info = info;
        this.type = type;
        this.userId = userId;
    }

}
