import api from './api';

export interface ProductDTO {
    id: number;
    name: string;
    price: number;
    stock: number;
}

export interface Page<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

const productService = {
    getAllProducts: async (name: string = '', page: number = 0, size: number = 10) => {
        const response = await api.get<Page<ProductDTO>>('/products', {
            params: {
                name,
                page,
                size,
                sort: 'id,asc'
            }
        });
        return response.data;
    },

};

export default productService;
