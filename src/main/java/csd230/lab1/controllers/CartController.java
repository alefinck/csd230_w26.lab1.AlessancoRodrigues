package csd230.lab1.controllers;

import csd230.lab1.entities.BookEntity;
import csd230.lab1.entities.CartEntity;
import csd230.lab1.entities.OrderEntity;
import csd230.lab1.entities.ProductEntity;
import csd230.lab1.entities.PublicationEntity;
import csd230.lab1.repositories.BookEntityRepository;
import csd230.lab1.repositories.CartEntityRepository;
import csd230.lab1.repositories.OrderEntityRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.time.LocalDateTime;

@Controller
@RequestMapping("/cart")
public class CartController {

    private final CartEntityRepository cartRepository;
    private final BookEntityRepository bookRepository;
    private final OrderEntityRepository orderRepository;

    public CartController(CartEntityRepository cartRepository,
                          BookEntityRepository bookRepository,
                          OrderEntityRepository orderRepository) {
        this.cartRepository = cartRepository;
        this.bookRepository = bookRepository;
        this.orderRepository = orderRepository;
    }

    @GetMapping
    public String viewCart(Model model) {
        Long defaultCartId = 1L;
        CartEntity cart = cartRepository.findById(defaultCartId)
                .orElseGet(() -> {
                    CartEntity newCart = new CartEntity();
                    newCart.setId(defaultCartId);
                    return cartRepository.save(newCart);
                });
        model.addAttribute("cart", cart);
        return "cartDetails";
    }

    @GetMapping("/add/{bookId}")
    public String addToCart(@PathVariable Long bookId) {
        Long defaultCartId = 1L;
        CartEntity cart = cartRepository.findById(defaultCartId).orElse(null);
        BookEntity book = bookRepository.findById(bookId).orElse(null);
        if (cart != null && book != null) {
            cart.addProduct(book);
            cartRepository.save(cart);
        }
        return "redirect:/books";
    }

    @GetMapping("/remove/{bookId}")
    public String removeFromCart(@PathVariable Long bookId) {
        Long defaultCartId = 1L;
        CartEntity cart = cartRepository.findById(defaultCartId).orElse(null);
        BookEntity book = bookRepository.findById(bookId).orElse(null);
        if (cart != null && book != null) {
            cart.getProducts().remove(book);
            cartRepository.save(cart);
        }
        return "redirect:/cart";
    }

    @PostMapping("/checkout")
    public String checkout() {
        Long defaultCartId = 1L;
        CartEntity cart = cartRepository.findById(defaultCartId).orElse(null);

        if (cart == null || cart.getProducts().isEmpty()) {
            return "redirect:/cart";
        }

        OrderEntity order = new OrderEntity();
        order.setOrderDate(LocalDateTime.now());

        double total = 0.0;

        for (ProductEntity product : cart.getProducts()) {
            total += product.getPrice();
            order.addProduct(product);

            if (product instanceof PublicationEntity publication) {
                if (publication.getCopies() > 0) {
                    publication.setCopies(publication.getCopies() - 1);
                }
            }
        }

        order.setTotalAmount(total);

        orderRepository.save(order);

        cart.getProducts().clear();
        cartRepository.save(cart);

        return "redirect:/cart/order/" + order.getId();
    }

    @GetMapping("/order/{orderId}")
    public String viewOrder(@PathVariable Long orderId, Model model) {
        OrderEntity order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return "redirect:/books";
        }
        model.addAttribute("order", order);
        return "orderDetails";
    }
}