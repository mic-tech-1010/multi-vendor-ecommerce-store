import ProductGridSection from './ProductGridSection';
import ProductSliderSection from './ProductSliderSection';
import { Section } from '@/types';

export default function ProductSectionRenderer({ section }: { section: Section }) {

    switch (section.layout) {

        case 'slider':
            return <ProductSliderSection section={section} />;

        case 'two-by-two-grid':
        case 'three-by-one-grid':
        case 'single-grid':
            return <ProductGridSection section={section} />;

        default:
            return null;
    }
}
