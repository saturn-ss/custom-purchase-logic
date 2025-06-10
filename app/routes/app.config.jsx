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
      metafieldDefinitions(first: 10,  ownerType: SHOP) {
        nodes { id key namespace }
      }
    }
  `);

  const existingData = existing.findIndex(item => {
    if (item.key == "purchase" && item.namespace == "data") {
      return;
    }
  });

  return existingData == -1 ? {} : existingData;
}

export default function Config() {
  const existingData = useLoaderData();
  return (
    <Page>
      <Layout>
        <BlockStack>
          <InlineStack>
            <Text>Product A</Text>
            <TextField />
          </InlineStack>
        </BlockStack>
      </Layout>
    </Page>
  );
}

// 
// import { afterAuth } from '@shopify/shopify-app-remix';
// import { AdminApiContext } from '~/shopify.server';

// export const loader = afterAuth(async ({ session, admin }) => {
//   const existing = await admin.graphql(`
//     query GetShopMetafieldDefinition {
//       metafieldDefinitions(first: 10, ownerType: SHOP) {
//         nodes { id key namespace }
//       }
//     }
//   `);
//   // Check if namespace:key exists
//   if (!/* found */) {
//     await admin.graphql(`
//       mutation {
//         metafieldDefinitionCreate(definition: {
//           name: "Store Tagline",
//           namespace: "custom",
//           key: "tagline",
//           type: "single_line_text_field",
//           ownerType: SHOP
//         }) {
//           userErrors { message }
//         }
//       }
//     `);
//   }
//   return redirect('/app');
// });
