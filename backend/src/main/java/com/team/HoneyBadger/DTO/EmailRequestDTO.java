package com.team.HoneyBadger.DTO;

import java.util.List;

public record EmailRequestDTO(String title, String content, String senderId, List<String> receiverIds) {
}