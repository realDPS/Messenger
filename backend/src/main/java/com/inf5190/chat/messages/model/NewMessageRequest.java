package com.inf5190.chat.messages.model;

/**
 * Représente un message.
 */
public record NewMessageRequest(String text, String username, ChatImageData imageData) {
}