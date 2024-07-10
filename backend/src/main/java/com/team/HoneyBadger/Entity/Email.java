package com.team.HoneyBadger.Entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Email {
    // 이메일
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(length = 100)
    private String title;
    @Column(columnDefinition = "LONGTEXT")
    private String content;
    @ManyToOne(fetch = FetchType.EAGER)
    private SiteUser sender;
    @OneToMany(mappedBy = "email", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<EmailReceiver> receiverList;
//    @ManyToOne(fetch = FetchType.LAZY)
//    private EmailTag tag;

    private LocalDateTime sendTime;

    @Builder
    public Email(String title, String content, SiteUser sender, EmailTag tag, LocalDateTime sendTime) {
        this.title = title;
        this.content = content;
        this.sender = sender;
        this.sendTime = sendTime;
//        this.tag = tag;
        this.receiverList = new ArrayList<>();
    }
}
