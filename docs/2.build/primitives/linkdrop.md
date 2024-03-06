---
id: linkdrop
title: Linkdrops
hide_table_of_contents: false
---

import {FeatureList, Column, Feature} from "@site/src/components/featurelist"
import ContactUs from '@site/src/components/ContactUs.mdx';

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import BOSGetKeyPairs from "../../7.primitives/linkdrop/bos/get-key-pairs.md"
import BOSSimpleDrop from "../../7.primitives/linkdrop/bos/simple-drop.md"
import BOSCreateNFTDrop from "../../7.primitives/linkdrop/bos/create-nft-drop.md"
import BOSGetDropId from "../../7.primitives/linkdrop/bos/get-drop-id.md"
import BOSTransferNFT from "../../7.primitives/linkdrop/bos/transfer-nft.md"
import BOSCreateFTDrop from "../../7.primitives/linkdrop/bos/create-ft-drop.md"
import BOSTransferFT from "../../7.primitives/linkdrop/bos/transfer-ft.md"
import BOSCreateFunctionCallDrop from "../../7.primitives/linkdrop/bos/create-function-call-drop.md"

import WebAppGetKeyPairs from "../../7.primitives/linkdrop/web-app/get-key-pairs.md"
import WebAppSimpleDrop from "../../7.primitives/linkdrop/web-app/simple-drop.md"
import WebAppCreateNFTDrop from "../../7.primitives/linkdrop/web-app/create-nft-drop.md"
import WebAppGetDropId from "../../7.primitives/linkdrop/web-app/get-drop-id.md"
import WebAppTransferNFT from "../../7.primitives/linkdrop/web-app/transfer-nft.md"
import WebAppCreateFTDrop from "../../7.primitives/linkdrop/web-app/create-ft-drop.md"
import WebAppTransferFT from "../../7.primitives/linkdrop/web-app/transfer-ft.md"
import WebAppCreateFunctionCallDrop from "../../7.primitives/linkdrop/web-app/create-function-call-drop.md"

import CLIGetKeyPairs from "../../7.primitives/linkdrop/near-cli/get-key-pairs.md"
import CLISimpleDrop from "../../7.primitives/linkdrop/near-cli/simple-drop.md"
import CLICreateNFTDrop from "../../7.primitives/linkdrop/near-cli/create-nft-drop.md"
import CLIGetDropId from "../../7.primitives/linkdrop/near-cli/get-drop-id.md"
import CLITransferNFT from "../../7.primitives/linkdrop/near-cli/transfer-nft.md"
import CLICreateFTDrop from "../../7.primitives/linkdrop/near-cli/create-ft-drop.md"
import CLITransferFT from "../../7.primitives/linkdrop/near-cli/transfer-ft.md"
import CLICreateFunctionCallDrop from "../../7.primitives/linkdrop/near-cli/create-function-call-drop.md"

Linkdrops allow users to distribute assets and onboard people to Web3 apps through a simple web link.

![Linkdrop](/docs/primitives/linkdrop.png)

They work by storing assets and linking [AccessKeys](../1.concepts/accounts/access-keys.md) to them. The `AccessKeys` are then distributed to users in the form of web links. These links take users to a website that automatically uses the keys to call the `claim` method in the `linkdrop` contract.

In order for a contract to be considered a Linkdrop-contract it has to follow the [**NEP-452 standard**](https://github.com/near/NEPs/blob/master/neps/nep-0452.md). The **NEP-452** explains the **minimum interface** required to be implemented, as well as the expected functionality.

---

## [Keypom](https://keypom.xyz/)

The simplest way to create Linkdrops is by using [Keypom](https://keypom.xyz/). Keypom is a community project that allows you to create Linkdrops for NEAR tokens and NFTs in a few clicks.  

![keypom](/docs/primitives/keypom.png)

---

## AccessKeys

In order to create any kind of drop, you need to first generate key pairs. You will need to create **one key per drop**. 

- The `linkdrop` contract will store the **`public`** part of the key.
- You will give the `private` part of the key to the user you want to receive the drop.

<Tabs groupId="code-tabs">
  <TabItem value="⚛️ Component" label="⚛️ Component" default>
    <BOSGetKeyPairs />
  </TabItem>
  <TabItem value="🌐 WebApp" label="🌐 WebApp">
    <WebAppGetKeyPairs />
  </TabItem>
  <TabItem value="🖥️ CLI" label="🖥️ CLI">
    <CLIGetKeyPairs />
  </TabItem>
</Tabs>

---

## $NEAR Drops

To create a $NEAR drop you will ask the contract to create a drop (`create_drop`), passing the public part of the keys you generated, and how much you want to drop on each key use (`deposit_per_use`).

The contract will create a drop and **return the numerical ID** that identifies it.

<Tabs groupId="code-tabs">
  <TabItem value="⚛️ Component" label="⚛️ Component" default>
    <BOSSimpleDrop />
  </TabItem>
  <TabItem value="🌐 WebApp" label="🌐 WebApp">
    <WebAppSimpleDrop />
  </TabItem>
  <TabItem value="🖥️ CLI" label="🖥️ CLI">
    <CLISimpleDrop />
  </TabItem>
</Tabs>

:::info
To claim the drop, you will need to send the user a [link with the private key](#building-drop-links)
:::

---

## NFT Drops

To drop an existing NFT, you will (1) create a drop, and then (2) **transfer the NFT** to keypom.

#### 1. Creating the Drop
To create an NFT drop, you will call the `create_drop` method, now passing a `nft` argument, which will tell the linkdrop contract to wait for an NFT to be transferred. 

The contract will then create a drop and **return the numerical ID** that identifies it.

<Tabs groupId="code-tabs">
  <TabItem value="⚛️ Component" label="⚛️ Component" default>
    <BOSCreateNFTDrop />
  </TabItem>
  <TabItem value="🌐 WebApp" label="🌐 WebApp">
    <WebAppCreateNFTDrop />
  </TabItem>
  <TabItem value="🖥️ CLI" label="🖥️ CLI">
    <CLICreateNFTDrop />
  </TabItem>
</Tabs>

#### 2. Transferring the NFT

Having the Drop ID, you now need to transfer the NFT to the linkdrop contract, specifying to which drop you want to add it.

<Tabs groupId="code-tabs">
  <TabItem value="⚛️ Component" label="⚛️ Component" default>
    <BOSTransferNFT />
  </TabItem>
  <TabItem value="🌐 WebApp" label="🌐 WebApp">
    <WebAppTransferNFT />
  </TabItem>
  <TabItem value="🖥️ CLI" label="🖥️ CLI">
    <CLITransferNFT />
  </TabItem>
</Tabs>

:::tip
The `linkdrop` contract will validate that you are transferring the NFT to a drop that belongs to you 
:::

---

## FT Drops

The process to drop a Fungible Token is very similar to that of creating an [NFT drop](#nft-drop). You will first create the drop, and then fund it with FTs.

#### 1.Creating a drop

To create a FT drop you will call the `create_drop` method, now passing a `ftData` argument, which will tell the linkdrop contract to wait for a certain amount of FT to be transferred. 

The contract will then create a drop and **return the numerical ID** that identifies it.

<Tabs groupId="code-tabs">
  <TabItem value="⚛️ Component" label="⚛️ Component" default>
    <BOSCreateFTDrop />
  </TabItem>
  <TabItem value="🌐 WebApp" label="🌐 WebApp">
    <WebAppCreateFTDrop />
  </TabItem>
  <TabItem value="🖥️ CLI" label="🖥️ CLI">
    <CLICreateFTDrop />
  </TabItem>
</Tabs>

#### 2. Transferring FT

Having the Drop ID, you now need to transfer the fungible tokens to the linkdrop contract.

:::note
To transfer FTs to an account, you need to first [register](./ft#register-user) the receiver account (e.g. the keypom contract) on the FT contract.
:::

<Tabs groupId="code-tabs">
  <TabItem value="⚛️ Component" label="⚛️ Component" default>
    <BOSTransferFT />
  </TabItem>
  <TabItem value="🌐 WebApp" label="🌐 WebApp">
    <WebAppTransferFT />
  </TabItem>
  <TabItem value="🖥️ CLI" label="🖥️ CLI">
    <CLITransferFT />
  </TabItem>
</Tabs>

---

## Function Call Drop
Linkdrop contracts allow to create `function call` drops. These drops will execute one or more methods on a contract when the user claims the drop.

:::tip
Function call drops can be thought as the abstract version of other drops: you can create a drop that will mint an NFT, register a user in a DAO, or pay for a service.
:::

<Tabs groupId="code-tabs">
  <TabItem value="⚛️ Component" label="⚛️ Component" default>
    <BOSCreateFunctionCallDrop />
  </TabItem>
  <TabItem value="🌐 WebApp" label="🌐 WebApp">
    <WebAppCreateFunctionCallDrop />
  </TabItem>
  <TabItem value="🖥️ CLI" label="🖥️ CLI">
    <CLICreateFunctionCallDrop />
  </TabItem>
</Tabs>

---

## Building drop links

```js
const getLinks = () => {
  const links = [];

  // It assumes that private keys have been already stored in State by using State.init() and State.update() method
  state.privKeys.map((e, i) => {
    const link =
      "https://app.mynearwallet.com" + "/linkdrop/v2.keypom.near/" + e;
    links.push(link);
  });

  return links;
};
```

<details>
<summary>Example response</summary>
<p>

```js
[
  'https://app.mynearwallet.com/linkdrop/v2.keypom.near/ed25519:2H32THYM8ob336yk81cZUxpidvKi34zLck6a97ypmCY8bbSAuEfrCTu9LWmWGiG9df2C6vkg2FGKGZzY9qE4aEcj',
  'https://app.mynearwallet.com/linkdrop/v2.keypom.near/ed25519:3eoMcqKmmY9Q6qgBy3hZy65HisZ8NXQd9aGGYUGe6RRsmNpGJS5YN64MgZaBVVYJJhbFXhQ2ca3DRRBiKh1rYM48'
]
```

</p>

</details>

:::note
If you didn't save your linkdrop links before closing NEAR App, you can always find them on [KeyPom app](https://keypom.xyz/drops).
:::

---

## Additional Resources

1. [Linkdrop plus](https://near.org/near/widget/ComponentDetailsPage?src=cuongdcdev.near/widget/linkdrop_plus) allows to create a Simple Drop. Powered by [KeyPom](https://keypom.xyz/)
2. [Keypom Drop Viewer](https://near.org/near/widget/ComponentDetailsPage?src=kiskesis.near/widget/Keypom-Drop-Viewer-fork) shows drops created by current logged in user.