import api from './api';

export interface OrderItemDTO {
    id?: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    total: number;
}

export interface PaymentDTO {
    id?: number;
    paymentMethod: string;
    paymentStatus: string;
    amount: number;
    date: string;
}

export interface OrderDTO {
    id: number;
    clientId: number;
    date: string;
    subTotal: number;
    remise: number;
    tva: number;
    total: number;
    status: string;
    montantRestant: number;
    items: OrderItemDTO[];
    payments: PaymentDTO[];
}

const orderService = {
    getAllOrders: async () => {
        const response = await api.get<OrderDTO[]>('/orders');
        return response.data;
    }
};

export default orderService;
