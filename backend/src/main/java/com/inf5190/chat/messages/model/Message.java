package com.inf5190.chat.messages.model;

/**
 * Représente un message.
 */
public record Message(String id, String username, Long timestamp, String text) {
}