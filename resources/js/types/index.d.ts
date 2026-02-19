import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface Image {
    id: number;
    thumb: string;
    small: string;
    large: string;
}

export type ProductAttributeValue = {
    id: number;
    value: string;
    images: Image[];
    type: ProductAttribute;
}

export type ProductAttribute = {
    id: number;
    name: string;
    type: 'Select' | 'Radio' | 'Image';
    options: ProductAttributeValue[]
}

export type PaginationProps<T> = {
    data: Array<T>
}

export interface Product {
    data: {
        id: number;
        name: string;
        slug: string;
        price: number;
        quantity: number;
        image: string;
        images: Image[];
        description: string;
        user: {
            id: number;
            name: string;
        };
        department: {
            id: number;
            name: string;
        };
        category: {
          id: number;
            name: string;
        };
        productAttributes: ProductAttribute[],
        skus: Array<{
            id: number;
            sku: number;
            quantity: number;
            price: number;
        }>
    };
}

export interface Section {
    id: number;
    title: string;
    slug: string;
    layout: string;
    type: string;
    sort_order: number;
    products: Product[];
}

export interface SharedData {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
