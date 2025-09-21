package com.car.Backend.model;

import jakarta.persistence.*;

@Entity
public class Score {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String playerName;
    private int points;

    public Score() {}

    public Score(String playerName, int points) {
        this.playerName = playerName;
        this.points = points;
    }

    public Long getId() { return id; }

    public String getPlayerName() { return playerName; }
    public void setPlayerName(String playerName) { this.playerName = playerName; }

    public int getPoints() { return points; }
    public void setPoints(int points) { this.points = points; }
}
