export interface Product {
    productID: string;
    name: string;
    shortDescription: string;
    price: number;
    image: string;
    message?:string
    success?: string
}
