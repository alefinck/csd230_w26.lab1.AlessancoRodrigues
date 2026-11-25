package csd230.lab1.controllers;

import csd230.lab1.entities.UserEntity;
import csd230.lab1.repositories.UserEntityRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class RegisterController {

    private final UserEntityRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public RegisterController(UserEntityRepository userRepository,
                              PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/register")
    public String showRegistrationForm(Model model) {
        model.addAttribute("user", new UserEntity());
        return "register";
    }

    @PostMapping("/register")
    public String registerUser(@ModelAttribute UserEntity user) {
        if (userRepository.findByUsername(user.getUsername()) != null) {
            return "redirect:/register?error";
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER");
        userRepository.save(user);
        return "redirect:/login";
    }
}