import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ProductSync } from '../../app/components/ProductSync';

describe('ProductSync', () => {
  const mockProps = {
    sessionId: 'test-session',
    currentProduct: {
      id: '1',
      title: 'Test Product',
      price: '$19.99',
      image: 'test.jpg'
    }
  };

  it('renders current product', () => {
    const { getByText } = render(<ProductSync {...mockProps} />);
    expect(getByText('Test Product')).toBeInTheDocument();
    expect(getByText('$19.99')).toBeInTheDocument();
  });

  it('shows currently viewing status for active product', () => {
    const { getByText } = render(<ProductSync {...mockProps} />);
    expect(getByText('Currently Viewing')).toBeInTheDocument();
  });

  it('syncs product when clicking view together', () => {
    const newProduct = {
      id: '2',
      title: 'Another Product',
      price: '$29.99',
      image: 'test2.jpg'
    };

    const { getByText } = render(
      <ProductSync
        {...mockProps}
        viewedProducts={[mockProps.currentProduct, newProduct]}
      />
    );

    const viewTogetherButton = getByText('View Together');
    fireEvent.click(viewTogetherButton);

    // TODO: Add socket emission verification
  });
});