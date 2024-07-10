package com.team.HoneyBadger.Service.Module;

import com.team.HoneyBadger.Entity.MessageReservation;
import com.team.HoneyBadger.Repository.MessageReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageReservationService {
    private final MessageReservationRepository messageReservationRepository;


    public MessageReservation save(MessageReservation messageReservation) {
        return messageReservationRepository.save(messageReservation);
    }



    public List<MessageReservation> getMessageReservationFromDate(LocalDateTime nowDate) {
        return messageReservationRepository.findBySendDate(nowDate);
    }

    public void delete(MessageReservation messageReservation) {
        messageReservationRepository.delete(messageReservation);
    }

    public MessageReservation getMessageReservation(Long reservationMessageId) {
        return messageReservationRepository.findById(reservationMessageId).orElseThrow();
    }

    public void update(MessageReservation messageReservation, String message, LocalDateTime sendDate) {
        messageReservation.setMessage(message);
        messageReservation.setSendDate(sendDate);

        messageReservationRepository.save(messageReservation);
    }
}