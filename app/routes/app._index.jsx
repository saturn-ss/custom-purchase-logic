import { useEffect } from "react";
import { useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
  TextField
} from "@shopify/polaris";

import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const existing = await admin.graphql(`
    query GetShopMetafieldDefinition {
      metafieldDefinitions(first: 10, ownerType: SHOP) {
        nodes { id key namespace }
      }
    }
  `);

return existing;
  const existingDataIndex = existing?.data?.metafieldDefinitions.nodes.findIndex(item => 
    item.key === "purchase" && item.namespace === "data"
  );

  // If no matching metafield is found, return an empty object
  if (existingDataIndex === -1) {
    return {};
  }

  // Return the matching metafield data
  return existing?.data?.metafieldDefinitions.nodes[existingDataIndex];
};

export default function Config() {
  const existing = useLoaderData();
  const existingSData = {};
  return (
    <Page>
      <Layout>
        <BlockStack>
          <InlineStack>
            <Text>
            </Text>
            <TextField />
          </InlineStack>
        </BlockStack>
      </Layout>
    </Page>
  );
}
