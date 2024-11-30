import React, { useState } from 'react';
import { Card, Stack, Button, TextField, Modal, Icon } from '@shopify/polaris';
import { ShareMinor, EmailMajor, TwitterMinor, FacebookMinor } from '@shopify/polaris-icons';

export function SocialSharing({ sessionId, product }) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [shareMessage, setShareMessage] = useState('');

  const generateShareLink = async () => {
    try {
      const response = await fetch('/api/sharing/generate-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          productId: product.id
        })
      });

      const data = await response.json();
      setShareLink(data.shareLink);
    } catch (error) {
      console.error('Failed to generate share link:', error);
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Join my shopping session!');
    const body = encodeURIComponent(`Check out what I'm shopping for: ${shareLink}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareViaTwitter = () => {
    const text = encodeURIComponent(`Shopping together is more fun! Join my session: ${shareLink}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`);
  };

  const shareViaFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`);
  };

  return (
    <>
      <Card title="Share Shopping Session">
        <Card.Section>
          <Stack vertical>
            <Button onClick={() => setShowShareModal(true)} icon={ShareMinor}>
              Share Session
            </Button>
          </Stack>
        </Card.Section>
      </Card>

      <Modal
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share Your Shopping Session"
      >
        <Modal.Section>
          <Stack vertical>
            <TextField
              label="Share Message"
              value={shareMessage}
              onChange={setShareMessage}
              multiline
            />

            <TextField
              label="Share Link"
              value={shareLink}
              onChange={() => {}}
              readOnly
              connectedRight={<Button onClick={generateShareLink}>Generate</Button>}
            />

            <Stack distribution="equalSpacing">
              <Button icon={EmailMajor} onClick={shareViaEmail}>Email</Button>
              <Button icon={TwitterMinor} onClick={shareViaTwitter}>Twitter</Button>
              <Button icon={FacebookMinor} onClick={shareViaFacebook}>Facebook</Button>
            </Stack>
          </Stack>
        </Modal.Section>
      </Modal>
    </>
  );
}