import { computed, inject } from "@angular/core";
import { Product } from "./models/product";
import { patchState, 
    signalMethod, 
    signalStore, 
    withComputed, 
    withMethods, 
    withState 
} from '@ngrx/signals';
import { produce } from 'immer';
import { Toaster } from "./services/toaster";

export type AerogiftsState = {
    products: Product[];
    category: string;
    wishlistItems: Product[]; 
};

export const AerogiftsStore = signalStore(
    {
        providedIn: 'root'
    },
    withState({
        products: [
            {
                id: 'p-001',
                name: 'Laptop Pro Gamer X',
                description: 'Laptop de alto rendimiento con tarjeta gráfica dedicada y procesador de última generación. Ideal para gaming y diseño.',
                price: 1299.99,
                imageUrl: 'assets/electronica1.jpeg', // Puedes cambiar esto por tus rutas de assets
                rating: 4.8,
                reviewsCount: 120,
                instock: true,
                category: 'electronica'
            },
            {
                id: 'p-002',
                name: 'Auriculares Noise Cancelling',
                description: 'Auriculares inalámbricos con cancelación de ruido activa y batería de larga duración (30 horas).',
                price: 199.50,
                imageUrl: 'assets/electronica1.jpeg',
                rating: 4.5,
                reviewsCount: 85,
                instock: true,
                category: 'electronica'
            },
            {
                id: 'p-003',
                name: 'Zapatillas Running Velocidad',
                description: 'Diseño ergonómico y suela amortiguada para corredores de largas distancias. Transpirables y ligeras.',
                price: 89.99,
                imageUrl: 'https://placehold.co/400',
                rating: 4.2,
                reviewsCount: 200,
                instock: true,
                category: 'mudada'
            },
            {
                id: 'p-004',
                name: 'Cafetera Express Italiana',
                description: 'Prepara el mejor café en casa. Acabado en acero inoxidable y fácil de limpiar.',
                price: 45.00,
                imageUrl: 'https://placehold.co/400',
                rating: 4.7,
                reviewsCount: 340,
                instock: false, // Ejemplo de producto agotado
                category: 'hogar'
            },
            {
                id: 'p-005',
                name: 'Smartwatch Fitness Tracker',
                description: 'Monitorea tu ritmo cardíaco, pasos y sueño. Resistente al agua y compatible con iOS y Android.',
                price: 59.99,
                imageUrl: 'assets/accesorio1.jpeg',
                rating: 4.0,
                reviewsCount: 50,
                instock: true,
                category: 'accesorios'
            },
            {
                id: 'p-006',
                name: 'Camiseta Algodón Orgánico',
                description: 'Camiseta básica de cuello redondo, 100% algodón orgánico suave al tacto.',
                price: 15.99,
                imageUrl: 'https://placehold.co/400',
                rating: 4.9,
                reviewsCount: 15,
                instock: true,
                category: 'mudada'
            },
            {
                id: 'p-007',
                name: 'Set de Pesas Ajustables',
                description: 'Kit de mancuernas ajustables para entrenamiento en casa. Incluye barra conectora.',
                price: 75.00,
                imageUrl: 'https://placehold.co/400',
                rating: 4.6,
                reviewsCount: 92,
                instock: true,
                category: 'deportes'
            },
            {
                id: 'p-008',
                name: 'Mochila Impermeable Urbana',
                description: 'Mochila con compartimento para laptop y múltiples bolsillos. Material repelente al agua.',
                price: 35.50,
                imageUrl: 'assets/accesorio2.jpeg',
                rating: 4.3,
                reviewsCount: 45,
                instock: true,
                category: 'accesorios'
            }
        ],
        category: 'all',
        wishlistItems: []
    } as AerogiftsState),

    withComputed(({ category, products, wishlistItems }) => ({
        filteredProducts: computed(() => {
            if (category() === 'all') return products();

            return products().filter((p) => p.category === category().toLowerCase());
        }),
        wishlistCount: computed(() => wishlistItems().length)
    })),
    withMethods((store, toaster = inject(Toaster)) => ({
        setCategory: signalMethod<string>((category: string) => {
            patchState(store, { category });
        }),
        addToWishlist: (product: Product) => {
            const updatedWishlistItems = produce( store.wishlistItems(), (draft) => {
                if (!draft.find((p) => p.id === product.id)) {
                    draft.push(product);
                }
            });
            patchState(store, { wishlistItems: updatedWishlistItems });
            toaster.success('Producto agregado correctamente a la lista de deseos');
        },
        removeFromWishlist: (product: Product) => {
            patchState(store, {
                wishlistItems: store.wishlistItems().filter((p) => p.id !== product.id),
            });
            toaster.success('Producto eliminado correctamente de la lista de deseos');
        },

        clearWishlist: () => {
            patchState(store, { wishlistItems: []});
        }
    }))
);