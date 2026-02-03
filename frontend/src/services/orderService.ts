import api from './api';

export interface OrderItemDTO {
    id?: number;
    productId: number;
    commandeId?: number;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface PaymentDTO {
    id?: number;
    commandeId?: number;
    number?: number;
    amount: number;
    paymentType: string;
    reference?: string;
    datePayment: string;
    dateReceipt?: string;
    bank?: string;
    deadline?: string;
    paymentStatus: string;
}

export interface OrderDTO {
    id: number;
    clientId: number;
    date: string;
    subTotal: number;
    remise: number;
    tva: number;
    total: number;
    promoCode?: string;
    status: string;
    montantRestant: number;
    items: OrderItemDTO[];
    payments: PaymentDTO[];
}

export interface CreateOrderDTO {
    clientId: number;
    items: { productId: number; quantity: number }[];
    promoCode?: string | null;
}

const orderService = {
    getAllOrders: async () => {
        const response = await api.get<OrderDTO[]>('/orders');
        return response.data;
    },
    createOrder: async (data: CreateOrderDTO) => {
        const response = await api.post<OrderDTO>('/orders', data);
        return response.data;
    },
    getOrder: async (id: number) => {
        const response = await api.get<OrderDTO>(`/orders/${id}`);
        return response.data;
    },
    confirmOrder: async (id: number) => {
        await api.patch(`/orders/${id}/confirm`);
    },
    cancelOrder: async (id: number) => {
        await api.patch(`/orders/${id}/cancel`);
    },
    rejectOrder: async (id: number) => {
        await api.patch(`/orders/${id}/reject`);
    }
};

export default orderService;
