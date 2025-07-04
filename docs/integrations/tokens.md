---
id: tokens
title: Tokens
description: Learn how to integrate NEAR tokens (NEAR, FT, and NFT) into your application, including balance queries, transfers, and token metadata.
---

# Tokens {#tokens}

## Table of contents

- [Introduction](#introduction)
- [NEAR tokens](#near-tokens)
- [Fungible tokens](#fungible-tokens)
- [Non-fungible tokens](#non-fungible-tokens)

## Introduction

Tokens are a fundamental part of the NEAR ecosystem, representing both the native currency of the network and user-defined assets. This document will guide you through the different types of tokens on NEAR, how to interact with them, and best practices for integrating token functionality into your applications.

## NEAR tokens

The native token of the NEAR protocol is called NEAR. It is used to pay for transaction fees and can be transferred between accounts. Every NEAR account has a balance of NEAR tokens, which can be viewed using the `near` CLI tool or through the NEAR wallet.

### Get balance

To check the balance of a NEAR account, use the following command:

```bash
near state <account_id>
```

This will return the account state, including the balance in NEAR tokens.

### Transfer tokens

To transfer NEAR tokens between accounts, use the `near send` command:

```bash
near send <receiver_id> <amount> --accountId <sender_id>
```

## Fungible tokens

Fungible tokens are tokens that are interchangeable with each other and have a fixed value. Examples include currency tokens like USD Coin (USDC) or Bitcoin (BTC) on NEAR.

### Get balance

To check the balance of a fungible token for a specific account, use the following command:

```bash
near view <contract_id> ft_balance_of '{"account_id": "<account_id>"}'
```

### Transfer tokens

To transfer fungible tokens, use the `ft_transfer` method:

```bash
near call <contract_id> ft_transfer '{"receiver_id": "<receiver_id>", "amount": "1"}' --accountId <sender_id> --amount 0.000000000000000000000001
```

## Non-fungible tokens

Non-fungible tokens (NFTs) are unique tokens that represent ownership of a specific item or piece of content, like digital art or music. Each NFT has distinct metadata and cannot be exchanged on a one-to-one basis with other NFTs.

### Get NFT metadata

To retrieve the metadata of an NFT, use the following command:

```bash
near view <contract_id> nft_metadata
```

### Transfer NFT

To transfer an NFT to another account, use the `nft_transfer` method:

```bash
near call <contract_id> nft_transfer '{"receiver_id": "<receiver_id>", "token_id": "<token_id>"}' --accountId <sender_id>
```

## Conclusion

Integrating NEAR tokens into your application allows for a wide range of functionalities, from simple transactions to complex interactions with fungible and non-fungible tokens. By understanding the basics of how tokens work on NEAR, you can create more engaging and versatile applications.
