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
import { useAppBridge } from "@shopify/app-bridge-react";
import { ResourcePicker } from '@shopify/app-bridge/actions';

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

  const app = useAppBridge();

  const handleOpen = () => {
    const picker = ResourcePicker.create(app, {
      resourceType: "Product",
      selectMultiple: false,
      showVariants: false,
    })

    picker.subscribe(ResourcePicker.Action.SELECT, (action) => {
      const [ product ] = action.payload.selection;
      onselect(product);
      picker.unsubscride();
      picker.close();
    });

    picker.dispatch(ResourcePicker.Action.OPEN);
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
        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box
            as="section"
            paddingInlineStart={{ xs: 400, sm: 0 }}
            paddingInlineEnd={{ xs: 400, sm: 0 }}
          >
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                InterJambs
              </Text>
              <Text as="p" variant="bodyMd">
                Interjambs are the rounded protruding bits of your puzzlie piece
              </Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <TextField label="Interjamb style" />
              <Button onClick={handleOpen}>Select Product</Button>
              <TextField label="Interjamb ratio" />
            </BlockStack>
          </Card>
        </InlineGrid>
        {smUp ? <Divider /> : null}
        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box
            as="section"
            paddingInlineStart={{ xs: 400, sm: 0 }}
            paddingInlineEnd={{ xs: 400, sm: 0 }}
          >
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Dimensions
              </Text>
              <Text as="p" variant="bodyMd">
                Interjambs are the rounded protruding bits of your puzzlie piece
              </Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <TextField label="Horizontal" />
              <TextField label="Interjamb ratio" />
            </BlockStack>
          </Card>
        </InlineGrid>
      </BlockStack>
    </Page>
  );
}
