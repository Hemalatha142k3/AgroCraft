// Import icons you'll need
import { Check, X } from "lucide-react";

export const testimonials = {
  farmers: {
    title: "From Our Farmers",
    icon: X,
    items: [
      {
        quote:
          "AgroCraft has transformed my small farm business. I now sell directly to customers who appreciate quality produce, and I earn nearly 40% more than when I sold to distributors.",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        name: "Rajesh Patel",
        position: "Organic Vegetable Farmer, Gujarat",
      },
      {
        quote:
          "The platform's inventory management and analytics tools have helped me plan my harvests better. I waste less produce and can predict demand patterns now.",
        image: "https://randomuser.me/api/portraits/women/45.jpg",
        name: "Anita Sharma",
        position: "Fruit Orchard Owner, Himachal Pradesh",
      },
    ],
  },
  customers: {
    title: "From Our Customers",
    icon: Check,
    items: [
      {
        quote:
          "The difference in taste between AgroCraft produce and supermarket options is incredible. Everything is so fresh, and I love knowing exactly which farm my food comes from.",
        image: "https://randomuser.me/api/portraits/women/33.jpg",
        name: "Priya Desai",
        position: "Home Cook, Mumbai",
      },
      {
        quote:
          "As a restaurant owner, AgroCraft has been a game-changer for sourcing ingredients. The quality is consistent, prices are fair, and delivery is reliable.",
        image: "https://randomuser.me/api/portraits/men/47.jpg",
        name: "Vikram Mehta",
        position: "Restaurant Owner, Delhi",
      },
    ],
  },
};
