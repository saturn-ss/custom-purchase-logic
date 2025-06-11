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
  TextField,
  useBreakpoints,
  InlineGrid,
  Divider
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
};

export default function Config() {
  const existing = useLoaderData();
  const existingSData = {};

  async function selectProduct(includeProduct) {
    const products = await window.shopify.resourcePicker({
      type: "product",
      action: "select",
    });

    if (products) {
      const { images, id, variant, title, handle } = products[0];
      
      return id;
    }
    return null;
  }

  const { smUp } = useBreakpoints();
  return (
    <Page
      divider
      primaryAction={{ content: "View on your store", disabled: true }}
      secondaryActions={[
        {
          content: "Duplicate",
          accessibilityLabel: "Secondary action label",
          onAction: () => alert("Duplicate action"),
        },
      ]}
    >
      <BlockStack gap={{ xs: "800", sm: "400" }}>
        <InlineStack gap={300}>
          <Text variant="headingXl" as="h4">If customer purchase products A and B, customer can only purchase 1 product F</Text>
        </InlineStack>
        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box
            as="section"
            paddingInlineStart={{ xs: 400, sm: 0 }}
            paddingInlineEnd={{ xs: 400, sm: 0 }}
          >
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Product A
              </Text>
              <Text as="p" variant="bodyMd">
                Interjambs are the rounded protruding bits of your puzzlie piece
              </Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <InlineGrid columns={["twoThirds", "oneThird"]} gap={300}>
                <TextField label="Product ID" />
                <TextField label="Minium Amount" />
              </InlineGrid>
              <Button onClick={selectProduct}>Select Product</Button>
            </BlockStack>
          </Card>
        </InlineGrid>
        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box
            as="section"
            paddingInlineStart={{ xs: 400, sm: 0 }}
            paddingInlineEnd={{ xs: 400, sm: 0 }}
          >
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Product B
              </Text>
              <Text as="p" variant="bodyMd">
                Interjambs are the rounded protruding bits of your puzzlie piece
              </Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <InlineGrid columns={["twoThirds", "oneThird"]} gap={300}>
                <TextField label="Product ID" />
                <TextField label="Minium Amount" />
              </InlineGrid>
              <Button onClick={selectProduct}>Select Product</Button>
            </BlockStack>
          </Card>
        </InlineGrid>
        <Divider />
        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box
            as="section"
            paddingInlineStart={{ xs: 400, sm: 0 }}
            paddingInlineEnd={{ xs: 400, sm: 0 }}
          >
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Product F
              </Text>
              <Text as="p" variant="bodyMd">
                Interjambs are the rounded protruding bits of your puzzlie piece
              </Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <InlineGrid columns={["twoThirds", "oneThird"]} gap={300}>
                <TextField label="Product ID" />
                <TextField label="Minium Amount" />
              </InlineGrid>
              <Button onClick={selectProduct}>Select Product</Button>
            </BlockStack>
          </Card>
        </InlineGrid>
      </BlockStack>
    </Page>
  );
}
