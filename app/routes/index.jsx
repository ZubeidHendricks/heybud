import { Page, Layout, Card } from '@shopify/polaris';
import { authenticate } from '../middleware/shopify-auth';
import { SharedShoppingProvider } from '../providers/SharedShoppingProvider';
import { useShopifyContext } from '../hooks/useShopifyContext';

export default function Index() {
  const { shop } = useShopifyContext();
  
  return (
    <Page title="Shared Shopping Experience">
      <SharedShoppingProvider>
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <ShopifySharedBrowsing />
            </Card>
          </Layout.Section>
        </Layout>
      </SharedShoppingProvider>
    </Page>
  );
}