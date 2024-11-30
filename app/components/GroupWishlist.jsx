import React, { useState } from 'react';
import { Card, ResourceList, Stack, Button, TextStyle, Modal } from '@shopify/polaris';

export function GroupWishlist({ sessionId, participants }) {
  const [wishlist, setWishlist] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const addToWishlist = (product) => {
    setWishlist(prev => [...prev, {
      id: Date.now(),
      product,
      addedBy: 'currentUser',
      votes: 0,
      comments: []
    }]);
  };

  const removeFromWishlist = (itemId) => {
    setWishlist(prev => prev.filter(item => item.id !== itemId));
  };

  const voteForItem = (itemId) => {
    setWishlist(prev => prev.map(item => 
      item.id === itemId ? { ...item, votes: item.votes + 1 } : item
    ));
  };

  const addComment = (itemId, comment) => {
    setWishlist(prev => prev.map(item => 
      item.id === itemId ? {
        ...item,
        comments: [...item.comments, {
          id: Date.now(),
          text: comment,
          user: 'currentUser',
          timestamp: new Date()
        }]
      } : item
    ));
  };

  return (
    <>
      <Card title="Group Wishlist">
        <Card.Section>
          <Button onClick={() => setShowAddModal(true)}>Add Item</Button>
        </Card.Section>
        <Card.Section>
          <ResourceList
            items={wishlist}
            renderItem={(item) => (
              <ResourceList.Item
                id={item.id}
                media={<img src={item.product.image} alt={item.product.title} />}
              >
                <Stack>
                  <Stack.Item fill>
                    <h3><TextStyle variation="strong">{item.product.title}</TextStyle></h3>
                    <p>${item.product.price}</p>
                    <p>Added by: {item.addedBy}</p>
                    <p>Votes: {item.votes}</p>
                  </Stack.Item>
                  <Stack.Item>
                    <Stack vertical>
                      <Button onClick={() => voteForItem(item.id)}>Vote</Button>
                      <Button destructive onClick={() => removeFromWishlist(item.id)}>Remove</Button>
                    </Stack>
                  </Stack.Item>
                </Stack>
                {item.comments.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <TextStyle variation="subdued">Comments:</TextStyle>
                    {item.comments.map(comment => (
                      <p key={comment.id}>
                        <strong>{comment.user}:</strong> {comment.text}
                      </p>
                    ))}
                  </div>
                )}
              </ResourceList.Item>
            )}
          />
        </Card.Section>
      </Card>

      <Modal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add to Wishlist"
        primaryAction={{
          content: 'Add',
          onAction: () => {
            if (selectedProduct) {
              addToWishlist(selectedProduct);
              setShowAddModal(false);
            }
          }
        }}
      >
        <Modal.Section>
          {/* Add product search/selection UI here */}
        </Modal.Section>
      </Modal>
    </>
  );
}