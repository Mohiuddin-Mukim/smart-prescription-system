-- Migration: Create refresh_tokens table for MySQL
CREATE TABLE refresh_tokens (
                                id BIGINT NOT NULL AUTO_INCREMENT,
                                token VARCHAR(255) NOT NULL,
                                expiry_date DATETIME(6) NOT NULL,
                                revoked TINYINT(1) NOT NULL DEFAULT 0,
                                user_id BIGINT NOT NULL,
                                PRIMARY KEY (id),
                                UNIQUE KEY uk_refresh_token (token),
                                CONSTRAINT fk_refresh_token_user
                                    FOREIGN KEY (user_id)
                                        REFERENCES users (id)
                                        ON DELETE CASCADE
) ENGINE=InnoDB;

-- Index for faster lookups
CREATE INDEX idx_refresh_token_value ON refresh_tokens(token);