package com.car.Backend.controller;

import com.car.Backend.model.Score;
import com.car.Backend.repository.ScoreRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")  // allow React frontend
public class GameController {

    private final ScoreRepository scoreRepository;

    public GameController(ScoreRepository scoreRepository) {
        this.scoreRepository = scoreRepository;
    }

    // Save a new score
    @PostMapping("/score")
    public Score saveScore(@RequestBody Score score) {
        return scoreRepository.save(score);
    }

    // Get all scores (leaderboard)
    @GetMapping("/leaderboard")
    public List<Score> getLeaderboard() {
        return scoreRepository.findAll();
    }
}
